from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserHouse(Base):
    __tablename__ = "user_houses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    house_id = Column(Integer, ForeignKey("houses.id", ondelete="CASCADE"))
    role_id = Column(Integer, ForeignKey("roles.id"))

    # Relaciones
    user = relationship("User", back_populates="houses_link")
    house = relationship("House", back_populates="users_link")
    role = relationship("Role", back_populates="user_houses")