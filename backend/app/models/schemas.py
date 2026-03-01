from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# --- Book Schemas ---
class BookBase(BaseModel):
    title: str
    author: str
    description: str
    long_description: str | None = None
    reading_level: str | None = None
    age_range: str
    subjects: list[str] = []
    time_period: str | None = None
    region: str | None = None
    isbn: str | None = None
    cover_image_url: str | None = None
    language: str = "English"
    series: str | None = None
    awards: list[str] | None = None
    popularity_score: float = 0.0
    page_count: int | None = None
    publication_year: int | None = None
    publisher: str | None = None


class BookCreate(BookBase):
    pass


class BookLinkOut(BaseModel):
    id: int
    source_name: str
    source_logo_url: str | None
    url: str
    link_type: str
    price_hint: str | None

    model_config = {"from_attributes": True}


class BookOut(BookBase):
    id: int
    links: list[BookLinkOut] = []
    created_at: datetime

    model_config = {"from_attributes": True}


class BookSummary(BaseModel):
    id: int
    title: str
    author: str
    description: str
    age_range: str
    subjects: list[str]
    cover_image_url: str | None
    reading_level: str | None
    popularity_score: float

    model_config = {"from_attributes": True}


class BookSearchParams(BaseModel):
    q: str | None = None
    age_range: str | None = None
    subject: str | None = None
    time_period: str | None = None
    region: str | None = None
    reading_level: str | None = None
    language: str | None = None
    sort: str = "popularity"
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=24, ge=1, le=100)


# --- Source Schemas ---
class SourceCreate(BaseModel):
    name: str
    base_url: str
    affiliate_tag: str | None = None
    logo_url: str | None = None


class SourceOut(BaseModel):
    id: int
    name: str
    base_url: str
    affiliate_tag: str | None
    logo_url: str | None

    model_config = {"from_attributes": True}


# --- BookLink Schemas ---
class BookLinkCreate(BaseModel):
    book_id: int
    source_id: int
    url: str
    link_type: str = "buy"
    affiliate_tag: str | None = None
    price_hint: str | None = None


# --- List Schemas ---
class ListItemOut(BaseModel):
    id: int
    book: BookSummary
    rank: int
    note: str | None

    model_config = {"from_attributes": True}


class CuratedListOut(BaseModel):
    id: int
    name: str
    slug: str
    description: str
    cover_image_url: str | None
    category: str | None
    is_featured: bool
    book_count: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


class CuratedListDetail(CuratedListOut):
    items: list[ListItemOut] = []


class CuratedListCreate(BaseModel):
    name: str
    slug: str
    description: str
    cover_image_url: str | None = None
    category: str | None = None
    is_featured: bool = False


class ListItemCreate(BaseModel):
    book_id: int
    rank: int = 0
    note: str | None = None


# --- Pagination ---
class PaginatedBooks(BaseModel):
    items: list[BookSummary]
    total: int
    page: int
    per_page: int
    pages: int


# --- Librarian Chat ---
class LibrarianRequest(BaseModel):
    message: str = Field(max_length=2000)
    context: dict | None = None


class LibrarianResponse(BaseModel):
    reply: str
    suggested_books: list[BookSummary] = []


# --- Stripe ---
class CheckoutSessionCreate(BaseModel):
    success_url: str
    cancel_url: str
    price_id: str | None = None  # "annual" to select annual plan


class SubscriptionStatus(BaseModel):
    tier: str  # "free" or "premium"
    active: bool


# --- Stats ---
class CatalogStats(BaseModel):
    total_books: int
    total_lists: int
    total_subscribers: int = 0
    subjects: list[str]
    age_ranges: list[str]
    reading_levels: list[str]


# --- Newsletter ---
class NewsletterSubscribeRequest(BaseModel):
    email: EmailStr
    name: str | None = None
    signup_source: str | None = None
    utm_source: str | None = None
    utm_medium: str | None = None
    utm_campaign: str | None = None


class NewsletterSubscribeResponse(BaseModel):
    success: bool
    message: str


class NewsletterExportResponse(BaseModel):
    email: str
    name: str | None
    signup_source: str | None
    created_at: datetime


# --- Click Tracking ---
class ClickTrackRequest(BaseModel):
    book_id: int
    link_id: int | None = None
    source_name: str
    referrer: str | None = None


class ClickTrackResponse(BaseModel):
    success: bool


# --- User & Auth ---
class UserOut(BaseModel):
    id: int
    email: str
    name: str | None
    subscription_tier: str
    subscription_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class MagicLinkRequest(BaseModel):
    email: EmailStr


class MagicLinkResponse(BaseModel):
    message: str


class VerifyTokenRequest(BaseModel):
    token: str


# --- Children ---
class ChildCreate(BaseModel):
    name: str
    birth_year: int | None = None
    grade_level: str | None = None
    interests: list[str] = []
    reading_level: str | None = None


class ChildUpdate(BaseModel):
    name: str | None = None
    birth_year: int | None = None
    grade_level: str | None = None
    interests: list[str] | None = None
    reading_level: str | None = None


class ChildOut(BaseModel):
    id: int
    name: str
    birth_year: int | None
    grade_level: str | None
    interests: list[str]
    reading_level: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Reading Plans ---
class ReadingPlanCreate(BaseModel):
    name: str
    child_id: int | None = None
    description: str | None = None


class ReadingPlanItemCreate(BaseModel):
    book_id: int
    week_number: int | None = None
    order_in_week: int = 0
    notes: str | None = None


class ReadingPlanItemUpdate(BaseModel):
    status: str | None = None
    notes: str | None = None
    week_number: int | None = None


class ReadingPlanItemOut(BaseModel):
    id: int
    book: BookSummary
    week_number: int | None
    order_in_week: int
    notes: str | None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ReadingPlanOut(BaseModel):
    id: int
    name: str
    description: str | None
    child_id: int | None
    is_ai_generated: bool
    created_at: datetime
    item_count: int = 0

    model_config = {"from_attributes": True}


class ReadingPlanDetail(ReadingPlanOut):
    items: list[ReadingPlanItemOut] = []


class ImportLocalPlanItem(BaseModel):
    """A single item in an imported reading plan."""
    book_id: int
    status: str = "not_started"
    notes: str | None = None


class ImportLocalPlanRequest(BaseModel):
    """Import a localStorage reading plan to the server."""
    name: str = "My Reading Plan"
    items: list[ImportLocalPlanItem]


# --- Book Reviews ---
class ReviewCreate(BaseModel):
    rating: int = Field(ge=1, le=5)
    review_text: str | None = None
    child_age_when_read: int | None = None


class ReviewOut(BaseModel):
    id: int
    user_name: str | None
    rating: int
    review_text: str | None
    child_age_when_read: int | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ReviewSummary(BaseModel):
    avg_rating: float | None
    review_count: int


# --- AI Curriculum ---
class CurriculumRequest(BaseModel):
    child_id: int
    preferences: dict | None = None  # {"subjects": [...], "time_periods": [...]}


class CurriculumResponse(BaseModel):
    plan_id: int
    plan_name: str
    message: str
