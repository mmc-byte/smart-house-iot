from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.models.device import Device
from app.models.room import Room
from app.schemas.device import DeviceCreate, DeviceResponse
from typing import List

router = APIRouter()

# Obtener todos los dispositivos de un room
@router.get("/room/{room_id}")
def get_devices_by_room(room_id: int, db: Session = Depends(get_db)):
    devices = db.query(Device).filter(Device.room_id == room_id).all()
    return devices  # aunque devices sea [], devuelve []


# Crear nuevo dispositivo
@router.post("/", response_model=DeviceResponse)
def create_device(device_in: DeviceCreate, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == device_in.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    new_device = Device(
        room_id=device_in.room_id,
        name=device_in.name,
        type=device_in.type,
    )
    db.add(new_device)
    db.commit()
    db.refresh(new_device)
    return new_device

# Obtener un dispositivo por id
@router.get("/{device_id}", response_model=DeviceResponse)
def get_device(device_id: int, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device
