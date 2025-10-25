# scripts/check_models.py
import sys
from pathlib import Path

# Agrega la carpeta 'backend' al path para poder importar 'app'
BASE_DIR = Path(__file__).resolve().parent.parent  # sube de scripts/ a backend/
sys.path.append(str(BASE_DIR))

from app.models.user import User
from app.models.house import House
from app.models.user_house import UserHouse
from app.models.role import Role
from sqlalchemy.orm import configure_mappers

try:
    configure_mappers()
    print("✅ Todos los mappers y relaciones se cargaron correctamente.")
except Exception as e:
    print("❌ Error al configurar los mappers:")
    print(e)

# Opcional: imprimir relaciones
print("\n--- Relaciones de User ---")
for rel in User.__mapper__.relationships:
    print(f"{rel.key} -> {rel.mapper.class_.__name__}")

print("\n--- Relaciones de House ---")
for rel in House.__mapper__.relationships:
    print(f"{rel.key} -> {rel.mapper.class_.__name__}")

print("\n--- Relaciones de UserHouse ---")
for rel in UserHouse.__mapper__.relationships:
    print(f"{rel.key} -> {rel.mapper.class_.__name__}")

print("\n--- Relaciones de Role ---")
for rel in Role.__mapper__.relationships:
    print(f"{rel.key} -> {rel.mapper.class_.__name__}")
