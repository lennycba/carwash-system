# Guia de desarrollo backend (practica)

Esta guia explica como implementar, paso a paso, las funcionalidades del frontend actual.
La idea es que practiques Python + FastAPI sin sobreingenieria.

## 1) Punto de partida

Estructura actual (hexagonal simplificada):

- `app/api/routes/autos.py`
- `app/domain/models/auto.py`
- `app/domain/services/lavadero_service.py`
- `app/application/use_cases/cambiar_estado_auto.py`
- `app/infrastructure/db/database.py`
- `app/infrastructure/db/models.py`
- `app/infrastructure/repositories/auto_repository.py`

El backend inicia, pero varias partes quedan con `TODO` y `NotImplementedError`.

## 2) Objetivo minimo (primera meta)

Implementar estos endpoints:

- `POST /api/autos`
- `GET /api/autos`
- `PATCH /api/autos/{id}/estado`

Pasos sugeridos:

1. Implementar `create`, `list_all`, `get_by_id`, `update_estado` en `auto_repository.py`.
2. Implementar `execute` en `cambiar_estado_auto.py`.
3. Validar transiciones con `lavadero_service.py`.
4. En `FINALIZADO`, dejar `print("WhatsApp enviado al cliente")`.

## 3) Autenticacion real (sin demo)

Frontend espera:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/usuarios`
- `PATCH /api/usuarios/{id}/rol`

Recomendacion:

1. Crear `api/routes/auth.py` y `api/routes/usuarios.py`.
2. Crear repositorio de usuarios.
3. Hashear password (por ejemplo con `passlib`).
4. Regla clave: si no existen usuarios, el primero debe quedar `ADMIN`.
5. Guardar usuario con campos separados: `nombre` y `apellido`.

## 4) Admin: estadisticas y asignacion de empleados

Frontend ya consume:

- `GET /api/autos/estadisticas/procesados?desde=YYYY-MM-DD&hasta=YYYY-MM-DD&empleado_id=...`
- `PATCH /api/autos/{id}/empleados` con body:
  - `{ "empleados_ids": [1, 2] }`

Recomendacion de modelo:

- Tabla intermedia `auto_empleados` (muchos a muchos).
- `autos` con timestamps (`created_at`, `updated_at`, opcional `fecha_finalizacion`).

Consulta de estadisticas:

- Contar autos `FINALIZADO`.
- Filtrar por rango de fechas.
- Filtrar por empleado asignado.

## 5) Orden sugerido para avanzar

1. Autos basico funcionando.
2. Registro/login.
3. Gestion de usuarios/roles.
4. Asignacion de empleados por auto.
5. Estadisticas admin.
6. Tests basicos.

## 6) Checklist corto

- [ ] Backend arranca (`/health` OK)
- [ ] Crear auto funciona
- [ ] Listar autos funciona
- [ ] Cambiar estado valida flujo
- [ ] Primer usuario queda ADMIN
- [ ] Login devuelve sesion usable por frontend
- [ ] Admin cambia roles
- [ ] Admin asigna empleados a auto
- [ ] Estadisticas por fecha/empleado funcionan
