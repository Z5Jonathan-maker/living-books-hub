"""Initial schema

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "books",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("author", sa.String(300), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("long_description", sa.Text(), nullable=True),
        sa.Column("reading_level", sa.String(50), nullable=True),
        sa.Column("age_range", sa.String(20), nullable=False),
        sa.Column("subjects", postgresql.ARRAY(sa.String()), nullable=False),
        sa.Column("time_period", sa.String(100), nullable=True),
        sa.Column("region", sa.String(100), nullable=True),
        sa.Column("isbn", sa.String(20), nullable=True),
        sa.Column("cover_image_url", sa.String(1000), nullable=True),
        sa.Column("language", sa.String(50), nullable=False, server_default="English"),
        sa.Column("series", sa.String(300), nullable=True),
        sa.Column("awards", postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column("popularity_score", sa.Float(), nullable=False, server_default="0"),
        sa.Column("page_count", sa.Integer(), nullable=True),
        sa.Column("publication_year", sa.Integer(), nullable=True),
        sa.Column("publisher", sa.String(300), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("isbn"),
    )
    op.create_index("ix_books_title", "books", ["title"])
    op.create_index("ix_books_author", "books", ["author"])

    op.create_table(
        "sources",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("base_url", sa.String(1000), nullable=False),
        sa.Column("affiliate_tag", sa.String(200), nullable=True),
        sa.Column("logo_url", sa.String(1000), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )

    op.create_table(
        "book_links",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("book_id", sa.Integer(), nullable=False),
        sa.Column("source_id", sa.Integer(), nullable=False),
        sa.Column("url", sa.String(2000), nullable=False),
        sa.Column("link_type", sa.String(20), nullable=False, server_default="buy"),
        sa.Column("affiliate_tag", sa.String(200), nullable=True),
        sa.Column("price_hint", sa.String(50), nullable=True),
        sa.ForeignKeyConstraint(["book_id"], ["books.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["source_id"], ["sources.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "curated_lists",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(300), nullable=False),
        sa.Column("slug", sa.String(300), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("cover_image_url", sa.String(1000), nullable=True),
        sa.Column("category", sa.String(100), nullable=True),
        sa.Column("is_featured", sa.Boolean(), server_default="false"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index("ix_curated_lists_slug", "curated_lists", ["slug"])

    op.create_table(
        "list_items",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("list_id", sa.Integer(), nullable=False),
        sa.Column("book_id", sa.Integer(), nullable=False),
        sa.Column("rank", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("note", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(["list_id"], ["curated_lists.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["book_id"], ["books.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("list_items")
    op.drop_table("curated_lists")
    op.drop_table("book_links")
    op.drop_table("sources")
    op.drop_index("ix_books_author", "books")
    op.drop_index("ix_books_title", "books")
    op.drop_table("books")
