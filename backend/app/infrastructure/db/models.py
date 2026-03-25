from sqlalchemy import Column, Enum, Integer, String

from app.domain.models.auto import EstadoAuto
from app.infrastructure.db.database import Base


# Modelo ORM para tabla autos.
class AutoORM(Base):
    __tablename__ = "autos"

    id = Column(Integer, primary_key=True, index=True)
    cliente = Column(String(100), nullable=False)
    telefono = Column(String(30), nullable=False)
    patente = Column(String(20), nullable=False, unique=True, index=True)
    estado = Column(Enum(EstadoAuto), nullable=False, default=EstadoAuto.RECIBIDO)


# Modelo ORM para tabla usuarios.
class UsuarioORM(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False, unique=True, index=True)
    password = Column(String(255), nullable=False)
    rol = Column(String(20), nullable=False, default="CLIENTE")
