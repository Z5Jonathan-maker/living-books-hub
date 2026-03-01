"""Add email_drip_events, newsletter_sends tables, and unsubscribed_at column

Revision ID: 004_drip_newsletter_unsub
Revises: 003_users_children_plans_reviews
Create Date: 2026-02-28
"""
import sqlalchemy as sa
from alembic import op

revision = "004_drip_newsletter_unsub"
down_revision = "003_users_children_plans_reviews"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "email_drip_events",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column(
            "subscriber_id",
            sa.Integer(),
            sa.ForeignKey("email_subscribers.id"),
            nullable=False,
            index=True,
        ),
        sa.Column("campaign", sa.String(), nullable=False, server_default="welcome"),
        sa.Column("step", sa.Integer(), nullable=False),
        sa.Column(
            "sent_at",
            sa.DateTime(),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )

    op.create_table(
        "newsletter_sends",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column(
            "book_id",
            sa.Integer(),
            sa.ForeignKey("books.id"),
            nullable=False,
        ),
        sa.Column("subject", sa.String(), nullable=False),
        sa.Column(
            "sent_at",
            sa.DateTime(),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("recipient_count", sa.Integer(), nullable=False, server_default="0"),
    )

    op.add_column(
        "email_subscribers",
        sa.Column("unsubscribed_at", sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("email_subscribers", "unsubscribed_at")
    op.drop_table("newsletter_sends")
    op.drop_table("email_drip_events")
