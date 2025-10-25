from pydantic import BaseModel
from typing import Optional

class DeviceBase(BaseModel):
    name: str
    type: Optional[str] = None

class DeviceCreate(DeviceBase):
    room_id: int

class DeviceResponse(DeviceBase):
    id: int
    room_id: Optional[int]
    state_topic: Optional[str]
    command_topic: Optional[str]
    status: Optional[dict] = None

    class Config:
        orm_mode = True
