from enum import Enum
from pydantic import BaseModel, Field


# Esta capa representa el dominio del negocio.
# Aqui definimos entidades y reglas que describen al lavadero.
class EstadoAuto(str, Enum):
    RECIBIDO = "RECIBIDO"
    EN_LAVADO = "EN_LAVADO"
    FINALIZADO = "FINALIZADO"


class AutoCreate(BaseModel):
    cliente: str = Field(..., min_length=2)
    telefono: str = Field(..., min_length=6)
    patente: str = Field(..., min_length=5, max_length=10)


class Auto(BaseModel):
    id: int
    cliente: str
    telefono: str
    patente: str
    estado: EstadoAuto

    class Config:
        from_attributes = True


class AutoEstadoUpdate(BaseModel):
    estado: EstadoAuto


class Usuario(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: str
    password: str
    rol: str

    class Config:
        from_attributes = True


class UsuarioCreate(BaseModel):
    nombre: str
    apellido: str
    email: str
    password: str
