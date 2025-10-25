# Aquí es para verificar los roles del usuario
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.core.security import SECRET_KEY, ALGORITHM
from typing import Optional

# modelos usados
from app.models.user import User
from app.models.user_house import UserHouse
from app.models.role import Role


# ¿de dónde el frontend obtendrá el token? de login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/users/login")

#Para cuando el rol no importa en la ruta
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """Verifica el JWT, busca el usuario y lo devuelve."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: Optional[str] = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# Para cuando el rol importa en la ruta 
# (si hiciéramos más de una casa, también podría pasarse el id de la casa)

def get_current_user_with_role(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """Devuelve el usuario autenticado y su rol (si tiene casa asignada)."""
    user = get_current_user(token, db)

    user_house = (
        db.query(UserHouse)
        .filter(UserHouse.user_id == user.id)
        .join(Role)
        .first()
    )

    role_name = user_house.role.name if user_house and user_house.role else None

    return {"user": user, "role": role_name}

# El helper que autoriza o desautoriza
def role_required(required_roles: list[str]):
    """Dependencia que permite solo ciertos roles."""
    def wrapper(current=Depends(get_current_user_with_role)):
        role = current["role"]
        if role not in required_roles:
            raise HTTPException(
                status_code=403,
                detail=f"Access forbidden: requires one of {required_roles}, but user has role '{role}'",
            )
        return current
    return wrapper
