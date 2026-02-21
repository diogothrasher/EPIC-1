import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioLogin, UsuarioResponse, TokenResponse
from app.security import verify_password, create_access_token
from app.dependencies import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(credenciais: UsuarioLogin, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(
        Usuario.email == credenciais.email,
        Usuario.ativo == True
    ).first()

    if not usuario or not verify_password(credenciais.senha, usuario.senha_hash):
        logger.warning(f"Login falhou para email: {credenciais.email}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email ou senha inválidos")

    usuario.ultimo_acesso = datetime.utcnow()
    db.commit()

    token = create_access_token(usuario.id)
    logger.info(f"Login bem-sucedido: {usuario.email}")
    return {"access_token": token, "token_type": "bearer", "usuario": usuario}


@router.get("/me", response_model=UsuarioResponse)
def me(usuario: Usuario = Depends(get_current_user)):
    return usuario
