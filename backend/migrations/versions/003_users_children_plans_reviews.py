"""Add users, children, reading_plans, reading_plan_items, book_reviews tables

Revision ID: 003_users_children_plans_reviews
Revises: 002_subscribers_clicks
Create Date: 2026-02-27
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ARRAY

revision = "003_users_children_plans_reviews"
down_revision = "002_subscribers_clicks"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Users table
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("email", sa.String(320), nullable=False),
        sa.Column("name", sa.String(200), nullable=True),
        sa.Column("stripe_customer_id", sa.String(100), nullable=True),
        sa.Column("subscription_tier", sa.String(20), nullable=False, server_default="free"),
        sa.Column("subscription_active", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("magic_link_token", sa.String(500), nullable=True),
        sa.Column("magic_link_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_stripe_customer_id", "users", ["stripe_customer_id"])

    # Children table
    op.create_table(
        "children",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("birth_year", sa.Integer(), nullable=True),
        sa.Column("grade_level", sa.String(50), nullable=True),
        sa.Column("interests", ARRAY(sa.String()), nullable=False, server_default="{}"),
        sa.Column("reading_level", sa.String(50), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_children_user_id", "children", ["user_id"])

    # Reading plans table
    op.create_table(
        "reading_plans",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("child_id", sa.Integer(), nullable=True),
        sa.Column("name", sa.String(300), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_ai_generated", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["child_id"], ["children.id"], ondelete="SET NULL"),
    )
    op.create_index("ix_reading_plans_user_id", "reading_plans", ["user_id"])

    # Reading plan items table
    op.create_table(
        "reading_plan_items",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("plan_id", sa.Integer(), nullable=False),
        sa.Column("book_id", sa.Integer(), nullable=False),
        sa.Column("week_number", sa.Integer(), nullable=True),
        sa.Column("order_in_week", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("status", sa.String(20), nullable=False, server_default="to-read"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["plan_id"], ["reading_plans.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["book_id"], ["books.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_reading_plan_items_plan_id", "reading_plan_items", ["plan_id"])

    # Book reviews table
    op.create_table(
        "book_reviews",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("book_id", sa.Integer(), nullable=False),
        sa.Column("rating", sa.Integer(), nullable=False),
        sa.Column("review_text", sa.Text(), nullable=True),
        sa.Column("child_age_when_read", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["book_id"], ["books.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("user_id", "book_id", name="uq_user_book_review"),
        sa.CheckConstraint("rating >= 1 AND rating <= 5", name="ck_rating_range"),
    )
    op.create_index("ix_book_reviews_book_id", "book_reviews", ["book_id"])
    op.create_index("ix_book_reviews_user_id", "book_reviews", ["user_id"])


def downgrade() -> None:
    op.drop_table("book_reviews")
    op.drop_table("reading_plan_items")
    op.drop_table("reading_plans")
    op.drop_table("children")
    op.drop_table("users")
