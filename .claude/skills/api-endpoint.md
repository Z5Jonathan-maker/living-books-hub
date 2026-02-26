# Skill: Create API Endpoint

## Purpose
Add a new FastAPI endpoint to the backend.

## Convention
- All routes in `backend/app/api/` module
- Prefix: `/api/v1/`
- Use Pydantic schemas for request/response
- Async handlers with SQLAlchemy async session
- Include OpenAPI tags and descriptions

## Steps
1. Define Pydantic schema in `backend/app/models/schemas.py`
2. Create route handler in appropriate `backend/app/api/*.py` file
3. Register router in `backend/app/main.py`
4. Add tests in `backend/tests/`

## Template
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db

router = APIRouter(prefix="/api/v1/example", tags=["example"])

@router.get("/")
async def list_items(db: AsyncSession = Depends(get_db)):
    ...
```
