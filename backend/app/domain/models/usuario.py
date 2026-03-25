from pydantic import BaseModel,Field,EmailStr,ConfigDict
from enum import Enum


# Esta capa representa el dominio del negocio.
# Aqui definimos entidades y reglas que describen al usuario.

class RolUsuario(str,Enum):
    ADMIN = "ADMIN"
    EMPLEADO = "EMPLEADO"
    CLIENTE = "CLIENTE"

class UsuarioRegister(BaseModel):
    nombre: str = Field(...,min_length = 2)
    apellido: str = Field(...,min_length = 2)
    email: EmailStr 
    password: str = Field(..., min_length = 6)
    
class UsuarioLogin(BaseModel):
    email: EmailStr
    password: str = Field(...,min_length = 6)
    
class UsuarioOut(BaseModel):
    model_config = ConfigDict(from_attributes = True)
    id:int
    nombre:str
    apellido:str
    email:EmailStr
    rol:str
    
class UsuarioRolUpdate(BaseModel):
    rol:RolUsuario
    
class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UsuarioOut