# Skill: Database Migration

## Purpose
Create and run Alembic database migrations for schema changes.

## Convention
- Models in `backend/app/models/`
- Migrations in `backend/migrations/versions/`
- Always make migrations reversible (include downgrade)
- Use `alembic revision --autogenerate -m "description"` to create
- Use `alembic upgrade head` to apply

## Steps
1. Modify SQLAlchemy model in `backend/app/models/`
2. Run: `cd backend && alembic revision --autogenerate -m "description"`
3. Review generated migration file
4. Run: `alembic upgrade head`
5. Verify with: `alembic current`

## Notes
- Never edit migration files after they've been applied in production
- Test both upgrade and downgrade paths locally
