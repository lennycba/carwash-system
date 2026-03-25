from sqlalchemy.orm import Session

from app.infrastructure.db.models import UsuarioORM

class UsuarioRepository:
    def __init__(self,db:Session) -> None:
        self.db = db
        
    def list_all(self):
        usuarios = self.db.query(UsuarioORM).order_by(UsuarioORM.id.desc()).all()
        return usuarios
    
    def update_rol(self, usuario_id: int, rol):
        usuario = self.db.query(UsuarioORM).filter(UsuarioORM.id == usuario_id).first()
        if not usuario:
            return None
        usuario.rol = rol
        self.db.commit()
        self.db.refresh(usuario)
        return usuario
    
    def get_by_email(self,email):
        usuario = self.db.query(UsuarioORM).filter(UsuarioORM.email == email).first()
        if not usuario:
            return None
        return usuario
    
    def count_users(self):
        cantidad_usuarios = self.db.query(UsuarioORM).count()
        return cantidad_usuarios
    
    def create(self,nombre,apellido,email,password_hash,rol):
        usuario = UsuarioORM(
            nombre=nombre,
            apellido=apellido,
            email=email,
            password=password_hash,
            rol=rol
        )
        self.db.add(usuario)
        self.db.commit()
        self.db.refresh(usuario)
        return usuario