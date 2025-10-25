# Valida que el tipado esté bien

from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[EmailStr] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True # Que no lea solo tipo dict, de frente ORM

class UserLogin(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
