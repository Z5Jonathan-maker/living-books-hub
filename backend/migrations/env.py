import asyncio
import ssl as ssl_module
from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import async_engine_from_config

from app.core.config import settings
from app.core.database import Base

# Import all models so they're registered
from app.models import (  # noqa: F401  # noqa: F401
    book,
    child,
    click_event,
    list,
    reading_plan,
    review,
    subscriber,
    user,
)

config = context.config
config.set_main_option("sqlalchemy.url", settings.async_database_url)

# SSL config: external connections require SSL, Render internal (dpg-*) does not
_connect_args = {}
_db_url = settings.async_database_url
_is_local = "localhost" in _db_url or "127.0.0.1" in _db_url
_is_render_internal = "dpg-" in _db_url and "-a" in _db_url
if not _is_local and not _is_render_internal:
    _ssl_ctx = ssl_module.create_default_context()
    _connect_args["ssl"] = _ssl_ctx

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = settings.async_database_url
    connectable = async_engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        connect_args=_connect_args,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
