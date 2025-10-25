# Valida que el tipado esté bien

from pydantic import BaseModel, EmailStr
from typing import Optional, List

class RoleResponse(BaseModel):
    name: str

    class Config:
        orm_mode = True

class UserHouseResponse(BaseModel):
    id: int
    house_id: int
    role: Optional[RoleResponse]
    class Config:
        orm_mode = True

class UserBase(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[EmailStr] = None

class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    houses_link: List[UserHouseResponse] = []  # <-- nombre alineado con el modelo ORM

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
