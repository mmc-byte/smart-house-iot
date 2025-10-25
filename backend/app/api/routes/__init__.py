from fastapi import APIRouter
from app.api.routes import users, rooms, devices

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])

api_router.include_router(rooms.router, prefix="/rooms", tags=["rooms"])
api_router.include_router(devices.router, prefix="/devices", tags=["devices"])



# from fastapi import APIRouter
# from app.api.routes import users

# api_router = APIRouter()
# api_router.include_router(users.router, prefix="/users", tags=["users"])