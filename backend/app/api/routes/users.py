from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.models.user import User
from app.models.user_house import UserHouse as HouseLink

from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.core.security import hash_password, verify_password, create_access_token
from app.core.auth import get_current_user
from sqlalchemy.orm import joinedload

router = APIRouter()

# ==== ENDPOINTS ====
# Registro de usuario

@router.post("/register", response_model=UserResponse)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    # Chequear duplicados
    if db.query(User).filter((User.username == user_in.username) | (User.email == user_in.email)).first():
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    hashed_pw = hash_password(user_in.password)

    new_user = User(
        name=user_in.name,
        username=user_in.username,
        email=user_in.email,
        password_hash=hashed_pw,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


# Login : username o email
@router.post("/login", response_model=Token)
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    print("routes/users.py dice:")
    print(credentials)
    if not credentials.username and not credentials.email:
        raise HTTPException(status_code=400, detail="Username or email required")

    user = None
    if credentials.username:
        user = db.query(User).filter(User.username == credentials.username).first() # ojo: solo toma el primero
    elif credentials.email:
        user = db.query(User).filter(User.email == credentials.email).first()

    # mmc : aquí podríamos hacer que indique cuál es la cred inválida
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}


# --- Obtener perfil del usuario autenticado ---

@router.get("/me", response_model=UserResponse)
def read_user_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .options(
            joinedload(User.houses_link)
            .joinedload(HouseLink.role)
        )
        .filter(User.id == current_user.id)
        .first()
    )
    print([ (uh.id, uh.role.name if uh.role else None) for uh in user.houses_link ])
    return user

# SQLAlchemy 2.0+
# Ya no acepta strings en los loader options (joinedload, selectinload, etc.).
# Debes usar atributos de clase directamente.