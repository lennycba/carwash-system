import os
from datetime import datetime, timedelta
from jose import jwt

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES"))


if not JWT_SECRET or not JWT_ALGORITHM or not JWT_EXPIRE_MINUTES:
    raise ValueError("Las variables de entorno para JWT no estan configuradas correctamente")

def create_access_token(data:dict) -> str:
    to_encode = data.copy()
    expiracion = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expiracion})
    return jwt.encode(to_encode,JWT_SECRET,algorithm=JWT_ALGORITHM)
    