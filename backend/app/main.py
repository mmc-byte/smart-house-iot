from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import api_router
from app.core.config import settings

from fastapi import FastAPI, Header, Request


app = FastAPI(title="Smart Home Backend")

FRONTEND_PORT = settings.FRONTEND_PORT
# LAPTOP_IP=settings.LAPTOP_IP

# MY_URL_LAN=f"http://{LAPTOP_IP}:{FRONTEND_PORT}"
# origins = [MY_URL_LOCALHOST, MY_URL_LAN ]
# mmc: 'El backend puede ser accedido desde localhost (sí mismo, o sea el cliente - el celular) o desde la laptop.'

MY_URL_LOCALHOST= f"http://localhost:{FRONTEND_PORT}"
origins = [MY_URL_LOCALHOST]



# OJO: no puede recibir f-strings con variables que no sean simples strings. Cómo sufrí por culpa de eso x'c

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

@app.get("/ping")
def ping(request: Request):
    return {"headers MUAH": dict(request.headers)}