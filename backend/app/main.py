from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.autos import router as autos_router
from app.api.routes.stats import router as stats_router
from app.api.routes.auth import router as auth_router
from app.api.routes.usuarios import router as usuarios_router
from app.infrastructure.db.database import Base, engine

# Punto de entrada principal de FastAPI.
# En una app real, aqui tambien podriamos iniciar logging, monitoreo, etc.
load_dotenv()
app = FastAPI(title="Car Wash Management API", version="0.1.0")

# CORS habilitado para desarrollo local con frontend React.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    # Inicializacion simple: crea tablas si no existen.
    # Para produccion, reemplazar por migraciones (Alembic).
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(autos_router, prefix="/api/autos", tags=["Autos"])
app.include_router(stats_router, prefix="/api/stats", tags=["Stats"])
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(usuarios_router, prefix="/api/usuarios", tags=["Usuarios"])
