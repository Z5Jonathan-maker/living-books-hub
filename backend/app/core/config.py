from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://localhost:5432/living_books"
    frontend_url: str = "http://localhost:3000"

    stripe_secret_key: str = ""
    stripe_publishable_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_price_id: str = ""
    stripe_annual_price_id: str = ""

    llm_enabled: bool = False
    anthropic_api_key: str = ""

    admin_api_key: str = ""

    # Auth
    jwt_secret_key: str = ""
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60 * 24  # 24 hours

    # Debug mode (controls /docs exposure)
    debug: bool = False
    magic_link_expire_minutes: int = 15

    # Email (Resend)
    resend_api_key: str = ""
    from_email: str = "Living Books Hub <noreply@livingbookshub.com>"

    # Groq AI
    groq_api_key: str = ""
    groq_enabled: bool = False

    model_config = {"env_file": ".env", "extra": "ignore"}

    @property
    def async_database_url(self) -> str:
        """Convert database URL to async format for SQLAlchemy."""
        url = self.database_url
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        return url


settings = Settings()
