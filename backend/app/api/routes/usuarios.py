from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.domain.models.usuario import UsuarioOut, UsuarioRolUpdate
from app.infrastructure.db.database import get_db
from app.infrastructure.repositories.usuario_repository import UsuarioRepository

router = APIRouter()

@router.get("", response_model=list[UsuarioOut])
def get_usuarios(db: Session = Depends(get_db)):
    repo = UsuarioRepository(db)
    return repo.list_all()

@router.patch("/{usuario_id}/rol", response_model = UsuarioOut)
def update_rol(
    usuario_id: int,
    payload: UsuarioRolUpdate,
    db: Session = Depends(get_db)):
    repo = UsuarioRepository(db)
    usuario = repo.update_rol(usuario_id, payload.rol)
    
    if not usuario:
        raise HTTPException(status_code = 404, detail = "Usuario no encontrado")
    
    return usuario

