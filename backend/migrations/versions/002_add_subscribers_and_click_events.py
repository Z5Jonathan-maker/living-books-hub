"""Add email_subscribers and click_events tables

Revision ID: 002_subscribers_clicks
Revises: 001_initial_schema
Create Date: 2026-02-27
"""
from alembic import op
import sqlalchemy as sa

revision = "002_subscribers_clicks"
down_revision = None  # Will be set by alembic
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "email_subscribers",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=True),
        sa.Column("signup_source", sa.String(), nullable=True),
        sa.Column("utm_source", sa.String(), nullable=True),
        sa.Column("utm_medium", sa.String(), nullable=True),
        sa.Column("utm_campaign", sa.String(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index("ix_email_subscribers_email", "email_subscribers", ["email"], unique=True)
    op.create_index("ix_email_subscribers_id", "email_subscribers", ["id"])

    op.create_table(
        "click_events",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("book_id", sa.Integer(), nullable=False),
        sa.Column("link_id", sa.Integer(), nullable=True),
        sa.Column("source_name", sa.String(), nullable=False),
        sa.Column("referrer", sa.String(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index("ix_click_events_book_id", "click_events", ["book_id"])
    op.create_index("ix_click_events_id", "click_events", ["id"])


def downgrade() -> None:
    op.drop_table("click_events")
    op.drop_table("email_subscribers")
