import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routers.health import router as health_router
from app.routers.auth import router as auth_router
from app.routers.empresas import router as empresas_router
from app.routers.contatos import router as contatos_router
from app.routers.categorias import router as categorias_router
from app.routers.tickets import router as tickets_router
from app.routers.dashboard import router as dashboard_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

app = FastAPI(
    title="Sistema de Gestão - Diogo",
    description="API para gestão de tickets, empresas, contatos e faturamento",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(status_code=500, content={"detail": "Erro interno do servidor"})


app.include_router(health_router)
app.include_router(auth_router)
app.include_router(empresas_router)
app.include_router(contatos_router)
app.include_router(categorias_router)
app.include_router(tickets_router)
app.include_router(dashboard_router)
