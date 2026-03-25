from fastapi import APIRouter, HTTPException, status

router = APIRouter()


@router.get("/login")
def get_login_stats():
    # TODO: implementar estadisticas del login para el panel publico.
    # Respuesta esperada por frontend:
    # {
    #   "ingresos_hoy": int,
    #   "autos_activos": int,
    #   "autos_entregados_hoy": int,
    #   "tiempo_promedio_minutos": int | float,
    #   "productividad_porcentaje": int | float
    # }
    #
    # Guia de implementacion sugerida:
    # 1) Contar autos ingresados en el dia actual.
    # 2) Contar autos activos (por ejemplo RECIBIDO + EN_LAVADO).
    # 3) Contar autos entregados/finalizados hoy.
    # 4) Calcular tiempo promedio por auto en minutos.
    # 5) Calcular productividad del equipo en porcentaje.
    #
    # Nota: cuando implementes esta logica, reemplaza este HTTP 501
    # por un diccionario con los datos reales.
    
    respuesta_harcodeada ={
      "ingresos_hoy": 0,
      "autos_activos": 0,
      "autos_entregados_hoy": 0,
      "tiempo_promedio_minutos": 45.00,
      "productividad_porcentaje": 95.00
    }
    
    return respuesta_harcodeada
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="TODO: implementar GET /api/stats/login",
    )
