from app.domain.models.auto import EstadoAuto
from app.domain.services.lavadero_service import LavaderoService
from app.infrastructure.repositories.auto_repository import AutoRepository


# Esta capa application orquesta casos de uso.
# Flujo tipico: recibe datos -> valida reglas de negocio -> persiste cambios.
class CambiarEstadoAutoUseCase:
    def __init__(self, auto_repository: AutoRepository, service: LavaderoService) -> None:
        self.auto_repository = auto_repository
        self.service = service

    def execute(self, auto_id: int, nuevo_estado: EstadoAuto):
        # TODO: implementar el flujo completo del caso de uso.
        # Guia sugerida:
        # 1) auto = repository.get_by_id(auto_id)
        # 2) si no existe -> devolver None o lanzar error de dominio
        # 3) validar transicion con self.service.validar_cambio_estado(...)
        # 4) actualizar estado con repository.update_estado(...)
        # 5) si nuevo_estado == FINALIZADO -> simular notificacion por print
        raise NotImplementedError("TODO: implementar execute() en CambiarEstadoAutoUseCase")
