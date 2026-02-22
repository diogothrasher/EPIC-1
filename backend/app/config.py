from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    secret_key: str
    environment: str = "development"
    admin_email: str = "admin@gestao.com"
    admin_password: str = "admin123456"
    access_token_expire_minutes: int = 1440  # 24h

    class Config:
        env_file = ".env"


settings = Settings()
