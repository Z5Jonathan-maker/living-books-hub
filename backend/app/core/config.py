from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://localhost:5432/living_books"
    frontend_url: str = "http://localhost:3000"

    stripe_secret_key: str = ""
    stripe_publishable_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_price_id: str = ""

    llm_enabled: bool = False
    anthropic_api_key: str = ""

    admin_api_key: str = "change-me-in-production"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
