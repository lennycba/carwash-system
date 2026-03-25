from app.domain.models.auto import EstadoAuto


# Este servicio contiene la logica de negocio del lavadero.
# Es una pieza de dominio: no depende de FastAPI ni de SQLAlchemy.
class LavaderoService:
    # Reglas validas del flujo de estados.
    _transiciones_validas = {
        EstadoAuto.RECIBIDO: [EstadoAuto.EN_LAVADO],
        EstadoAuto.EN_LAVADO: [EstadoAuto.FINALIZADO],
        EstadoAuto.FINALIZADO: [],
    }

    def validar_cambio_estado(
        self, estado_actual: EstadoAuto, nuevo_estado: EstadoAuto
    ) -> bool:
        return nuevo_estado in self._transiciones_validas[estado_actual]

