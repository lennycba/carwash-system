from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.domain.models.usuario import UsuarioRegister,UsuarioOut,UsuarioLogin,LoginResponse
from app.infrastructure.repositories.usuario_repository import UsuarioRepository
from app.utils.security import hash_password,verify_password
from app.utils.jwt import create_access_token
from app.infrastructure.db.database import get_db

router = APIRouter()


@router.post("/register", response_model=UsuarioOut)
def register(
    payload: UsuarioRegister,
    db: Session = Depends(get_db),):
    repo = UsuarioRepository(db)
    if repo.get_by_email(payload.email):
        raise HTTPException(status_code = 409, detail = "Email ya registrado")
    
    if repo.count_users() == 0:
        rol_inicial = "ADMIN"
    else:
        rol_inicial = "CLIENTE"
    hashed_password = hash_password(payload.password)
        
    usuario = repo.create(
        nombre = payload.nombre,
        apellido = payload.apellido,
        email = payload.email,
        password_hash = hashed_password,
        rol = rol_inicial
    )
    return usuario


@router.post("/login", response_model=LoginResponse)
def login(
    payload: UsuarioLogin,
    db: Session = Depends(get_db),):
    repo = UsuarioRepository(db)
    usuario = repo.get_by_email(payload.email)
    
    if not usuario:
        raise HTTPException(status_code = 401, detail = "Credenciales invalidas")

    validated = verify_password(password=payload.password,hashed_password=usuario.password)
        
    if not validated:
        raise HTTPException(status_code = 401, detail = "Credenciales invalidas")
    
    token = create_access_token(data={"sub": usuario.email,"rol":usuario.rol,"user_id":str(usuario.id)})
    return LoginResponse(access_token=token, token_type="bearer", user=usuario)
