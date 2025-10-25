from sqlalchemy import Column, Integer, String, TIMESTAMP, text
from sqlalchemy.orm import relationship
from app.core.database import Base

class House(Base):
    __tablename__ = "houses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    location = Column(String(255), nullable=True)
    created_at = Column(TIMESTAMP, server_default=text("NOW()"))

    # Relación con UserHouse (muchos-a-muchos con users)
    users_link = relationship("UserHouse", back_populates="house")
    
    # Relación con Rooms
    rooms = relationship("Room", back_populates="house", cascade="all, delete")

    # Usaremos 'link' solamente para muchos a muchos.