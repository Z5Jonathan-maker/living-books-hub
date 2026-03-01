#!/bin/bash
set -e

echo "=== Running database migrations ==="
python -m alembic upgrade head || {
    echo "WARNING: Migrations failed, retrying in 5 seconds..."
    sleep 5
    python -m alembic upgrade head
}

echo "=== Running seed script ==="
python -m scripts.seed 2>&1 || {
    echo "WARNING: Seed script failed with exit code $?. Output above. Continuing..."
}

echo "=== Starting uvicorn ==="
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-10000}"
