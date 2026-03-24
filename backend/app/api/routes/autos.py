from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.application.use_cases.cambiar_estado_auto import CambiarEstadoAutoUseCase
from app.domain.models.auto import Auto, AutoCreate, AutoEstadoUpdate
from app.domain.services.lavadero_service import LavaderoService
from app.infrastructure.db.database import get_db
from app.infrastructure.repositories.auto_repository import AutoRepository

router = APIRouter()


@router.post("", response_model=Auto, status_code=201)
def create_auto(payload: AutoCreate, db: Session = Depends(get_db)):
    # Capa API: recibe HTTP y delega a application/repository.
    # TODO: completar logica en repository.create(...)
    repository = AutoRepository(db)
    try:
        return repository.create(payload)
    except NotImplementedError as exc:
        raise HTTPException(status_code=501, detail=str(exc)) from exc


@router.get("", response_model=list[Auto])
def list_autos(db: Session = Depends(get_db)):
    # TODO: completar logica en repository.list_all(...)
    repository = AutoRepository(db)
    try:
        return repository.list_all()
    except NotImplementedError as exc:
        raise HTTPException(status_code=501, detail=str(exc)) from exc


@router.patch("/{auto_id}/estado", response_model=Auto)
def update_estado(auto_id: int, payload: AutoEstadoUpdate, db: Session = Depends(get_db)):
    # TODO: completar caso de uso cambiar estado.
    repository = AutoRepository(db)
    service = LavaderoService()
    use_case = CambiarEstadoAutoUseCase(repository, service)

    try:
        auto = use_case.execute(auto_id, payload.estado)
    except NotImplementedError as exc:
        raise HTTPException(status_code=501, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    if not auto:
        raise HTTPException(status_code=404, detail="Auto no encontrado")
    return auto
