from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import api_router
from app.core.config import settings
from fastapi import FastAPI, Header, Request
from app.core.database import SessionLocal
from app.core.mqtt_client import connect_mqtt, subscribe_to_all_states
from contextlib import asynccontextmanager

app = FastAPI(title="Smart Home Backend")
# connect_mqtt()
@asynccontextmanager
async def lifespan(app: FastAPI):
    connect_mqtt()
    db = SessionLocal()
    try:
        subscribe_to_all_states(db)
    finally:
        db.close()

    yield 

FRONTEND_PORT = settings.FRONTEND_PORT
MY_URL_LOCALHOST= f"http://localhost:{FRONTEND_PORT}"

#Version LOCAL ========================
origins = [MY_URL_LOCALHOST]
# ====================================  

# Version LAN ========================
# LAPTOP_IP = settings.LAPTOP_IP
# MY_URL_LAN=f"http://{LAPTOP_IP}:{FRONTEND_PORT}"
# origins = [
#     MY_URL_LAN,  # clientes dentro de la LAN
#     MY_URL_LOCALHOST, # prueba desde la misma laptop
# ]
# ====================================  

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Smart Home API is running 🚀"}

# Solo para debug:
# @app.get("/ping")
# def ping(request: Request):
#     return {"headers": dict(request.headers)}