from sqlalchemy import Column, Integer, String, ForeignKey, JSON, TIMESTAMP, text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="SET NULL"))
    name = Column(String(100), nullable=False)
    type = Column(String(50))
    state_topic = Column(String(150))
    command_topic = Column(String(150))
    status = Column(JSON)
    last_update = Column(TIMESTAMP, server_default=text("NOW()"))

    # Relaciones
    room = relationship("Room", back_populates="devices")

    def __repr__(self):
        return f"<Device id={self.id} name={self.name} room_id={self.room_id}>"

    @property
    def topics(self):
        """Conveniencia: devuelve los dos tópicos como dict."""
        return {
            "command": self.command_topic,
            "state": self.state_topic,
        }
   ### mmc: Tal vez añadir passive deletes si se agrega un endpoint para borrar