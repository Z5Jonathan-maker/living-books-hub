#!/bin/bash
set -e

echo "=== Running database migrations ==="
python -m alembic upgrade head || {
    echo "WARNING: Migrations failed, retrying in 5 seconds..."
    sleep 5
    python -m alembic upgrade head
}

echo "=== Running seed script ==="
python -m scripts.seed || {
    echo "WARNING: Seed script failed (may already be seeded), continuing..."
}

echo "=== Starting uvicorn ==="
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-10000}"
