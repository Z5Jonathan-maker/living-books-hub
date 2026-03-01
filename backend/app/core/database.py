import ssl as ssl_module
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

# Render PostgreSQL requires SSL for external connections
connect_args = {}
_db_url = settings.async_database_url
if "localhost" not in _db_url and "127.0.0.1" not in _db_url:
    ssl_ctx = ssl_module.create_default_context()
    connect_args["ssl"] = ssl_ctx

engine = create_async_engine(
    settings.async_database_url, echo=False, pool_pre_ping=True, connect_args=connect_args
)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
