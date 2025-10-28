from fastapi import APIRouter
from app.api.routes import users, rooms, devices, mqtt_control

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])

api_router.include_router(rooms.router, prefix="/rooms", tags=["rooms"])
api_router.include_router(devices.router, prefix="/devices", tags=["devices"])
api_router.include_router(mqtt_control.router, prefix="/mqtt", tags=["MQTT Control"])



# from fastapi import APIRouter
# from app.api.routes import users

# api_router = APIRouter()
# api_router.include_router(users.router, prefix="/users", tags=["users"])