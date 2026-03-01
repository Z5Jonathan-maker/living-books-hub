import datetime
import secrets

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import create_access_token, get_current_user, require_user
from app.core.config import settings
from app.core.database import get_db
from app.core.rate_limit import auth_limiter
from app.models.schemas import MagicLinkRequest, MagicLinkResponse, UserOut, VerifyTokenRequest
from app.models.user import User
from app.services.email import send_magic_link_email

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/magic-link", response_model=MagicLinkResponse)
async def request_magic_link(
    request: Request,
    req: MagicLinkRequest,
    db: AsyncSession = Depends(get_db),
):
    """Send a magic link email. Creates user if they don't exist."""
    auth_limiter.check(request)
    email = req.email.lower().strip()

    # Find or create user
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user:
        user = User(email=email)
        db.add(user)
        await db.flush()

    # Generate magic link token
    token = secrets.token_urlsafe(48)
    user.magic_link_token = token
    user.magic_link_expires_at = datetime.datetime.now(
        datetime.UTC
    ) + datetime.timedelta(minutes=settings.magic_link_expire_minutes)
    await db.commit()

    # Send email
    magic_link_url = f"{settings.frontend_url}/auth/verify?token={token}"
    send_magic_link_email(email, magic_link_url)

    return MagicLinkResponse(message="Check your email for a sign-in link!")


@router.post("/verify")
async def verify_magic_link(
    req: VerifyTokenRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    """Verify a magic link token and set JWT cookie."""
    result = await db.execute(
        select(User).where(User.magic_link_token == req.token)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired link")

    if (
        user.magic_link_expires_at is None
        or user.magic_link_expires_at < datetime.datetime.now(datetime.UTC)
    ):
        raise HTTPException(status_code=400, detail="Link has expired. Please request a new one.")

    # Clear the token (single use)
    user.magic_link_token = None
    user.magic_link_expires_at = None
    await db.commit()

    # Create JWT and set as httpOnly cookie
    token = create_access_token(user.id, user.email)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.jwt_access_token_expire_minutes * 60,
        path="/",
    )

    return {"message": "Signed in successfully", "user": UserOut.model_validate(user)}


@router.get("/me", response_model=UserOut | None)
async def get_me(user: User | None = Depends(get_current_user)):
    """Get current authenticated user, or null if not logged in."""
    if user is None:
        return None
    return UserOut.model_validate(user)


@router.post("/logout")
async def logout(response: Response):
    """Clear the auth cookie."""
    response.delete_cookie(key="access_token", path="/")
    return {"message": "Signed out successfully"}


@router.put("/profile", response_model=UserOut)
async def update_profile(
    name: str,
    user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    """Update user profile name."""
    user.name = name
    await db.commit()
    return UserOut.model_validate(user)
