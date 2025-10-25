from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    house_id = Column(Integer, ForeignKey("houses.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text)

    # Relaciones
    house = relationship("House", back_populates="rooms")
    devices = relationship("Device", back_populates="room")

    def __repr__(self):
        return f"<Room id={self.id} name={self.name}>"
