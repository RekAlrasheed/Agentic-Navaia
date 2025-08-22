from pydantic_settings import BaseSettings
from pydantic import AnyUrl

class Settings(BaseSettings):
    app_name: str = "Navaia Backend"
    environment: str = "dev"

    db_url: str
    redis_url: str

    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_access_ttl_minutes: int = 60

    elevenlabs_hmac_secret: str

    tenant_id: str = "demo-tenant"

    class Config:
        env_file = ".env"
        env_prefix = ""
        case_sensitive = False


def get_settings() -> Settings:
    return Settings() 