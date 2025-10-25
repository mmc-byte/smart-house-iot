from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import api_router
from app.core.config import settings

from fastapi import FastAPI, Header, Request


app = FastAPI(title="Smart Home Backend")

FRONTEND_PORT = settings.FRONTEND_PORT
MY_URL_LOCALHOST= f"http://localhost:{FRONTEND_PORT}"
# Version LAN : 
# 1. Descomentar LAPTOP_IP en .env
# 2. Descomentar la siguiente variable (cuidado con la identación):
#LAPTOP_IP = settings.LAPTOP_IP
# 3.Descomentar la siguiente string (cuidado con la identación):
#MY_URL_LAN=f"http://{LAPTOP_IP}:{FRONTEND_PORT}"
# 4. Comentar origins =[MY_URL_LOCALHOST] aquí.
origins = [MY_URL_LOCALHOST]
# 5. Descomentar el siguiente arreglo 
# origins = [
#     MY_URL_LAN,  # para clientes dentro de la LAN
#     MY_URL_LOCALHOST, # si pruebas desde la misma laptop
# ]

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