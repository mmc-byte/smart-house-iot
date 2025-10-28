# backend/app/core/config.py
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[3]  # smart-home-iot/
ENV_PATH = BASE_DIR / ".env"

class Settings(BaseSettings):
    DB_HOST: str
    DB_PORT: int = 5432
    DB_NAME: str
    DB_USER: str
    DB_PASS: str

    # === otras env =====
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str  
    
    FRONTEND_PORT: int = 5173
    BACKEND_PORT: int = 8000
    VITE_BACKEND_PORT: int = 8000

    BROKER_MQTT_PORT: int =1883
    BROKER_WS_PORT: int =9001

    # ===================
    # Version LAN : Otras env para LAN 
    # 1. Descomentar estas variables en .env
    # 2. También descomentarlas aquí (cuidado con la identacion)
    # LAPTOP_IP: str
    # ARDUINO_IP: str

    #====================
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+psycopg2://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    #pydantic v2
    model_config = SettingsConfigDict(
        env_file=str(ENV_PATH),
        env_file_encoding="utf-8"
    )

settings = Settings()