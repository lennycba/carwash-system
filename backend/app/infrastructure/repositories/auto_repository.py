from sqlalchemy.orm import Session

from app.domain.models.auto import Auto, AutoCreate, EstadoAuto


# Repositorio: adapta el dominio a persistencia.
# Su responsabilidad es guardar/leer datos de DB.
class AutoRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, payload: AutoCreate) -> Auto:
        # TODO: implementar insercion de Auto en PostgreSQL usando SQLAlchemy.
        # Sugerencia:
        # 1) Crear instancia AutoORM
        # 2) db.add(...)
        # 3) db.commit()
        # 4) db.refresh(...)
        raise NotImplementedError("TODO: implementar create() en AutoRepository")

    def list_all(self) -> list[Auto]:
        # TODO: implementar listado de autos.
        # Sugerencia: consultar AutoORM ordenado por id desc.
        raise NotImplementedError("TODO: implementar list_all() en AutoRepository")

    def get_by_id(self, auto_id: int):
        # TODO: implementar busqueda por ID.
        raise NotImplementedError("TODO: implementar get_by_id() en AutoRepository")

    def update_estado(self, auto_id: int, estado: EstadoAuto):
        # TODO: implementar actualizacion de estado del auto.
        # Sugerencia:
        # 1) Buscar auto por ID
        # 2) Cambiar campo estado
        # 3) Commit y refresh
        raise NotImplementedError("TODO: implementar update_estado() en AutoRepository")
