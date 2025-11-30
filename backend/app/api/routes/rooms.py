from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.models.room import Room
from app.models.house import House
from app.schemas.room import RoomResponse, RoomBase
from typing import List

router = APIRouter()

# Obtener rooms de una casa
@router.get("/house/{house_id}", response_model=List[RoomResponse])
def get_rooms_by_house(house_id: int, db: Session = Depends(get_db)):
    rooms = db.query(Room).filter(Room.house_id == house_id).all()
    if not rooms:
        raise HTTPException(status_code=404, detail="No rooms found for this house")
    return rooms

# Crear un nuevo room
@router.post("/", response_model=RoomResponse)
def create_room(room_in: RoomBase, house_id: int, db: Session = Depends(get_db)):
    house = db.query(House).filter(House.id == house_id).first()
    if not house:
        raise HTTPException(status_code=404, detail="House not found")

    new_room = Room(house_id=house_id, name=room_in.name, description=room_in.description)
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    return new_room

    ### mmc: Tal vez añadir passive deletes si se agrega un endpoint para borrar