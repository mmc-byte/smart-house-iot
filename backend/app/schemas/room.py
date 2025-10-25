from pydantic import BaseModel
from typing import List, Optional
from .device import DeviceResponse

class RoomBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoomResponse(RoomBase):
    id: int
    devices: List[DeviceResponse] = []

    class Config:
        # orm_mode = True
        form_attributes = True