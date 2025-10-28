from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.mqtt_client import publish_message
from app.core.deps import get_db
from app.models.device import Device

router = APIRouter(tags=["MQTT Control"]) 

# POST - Controla
# topic like: houses/house_id/room/device/set
# or like: houses/house_id/device/set when room is global
@router.post("/devices/{device_id}/command")
def send_device_command(device_id: int, action: str, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    topic = device.command_topic # El topic generado en la DB con el registro de un device
    payload = {"action": action}

    publish_message(topic, payload)

    return {"status": "sent", "topic": topic, "payload": payload}

# GET - Obtiene el estado
# topic like: houses/house_id/room/device/state
# or like: houses/house_id/device/state
from app.core.mqtt_client import latest_states

@router.get("/devices/{device_id}/state")
def get_device_state(device_id: int, db: Session = Depends(get_db)):
    
    device = db.query(Device).filter(Device.id == device_id).first()

    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    topic = device.state_topic
    state = latest_states.get(topic)
    return {"topic": topic, "state": state or "unknown"}
