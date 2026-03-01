import time
from collections import defaultdict
from datetime import date

from fastapi import HTTPException, Request


class RateLimiter:
    """Simple in-memory rate limiter. Suitable for single-instance deployments."""

    def __init__(self, max_requests: int = 10, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._requests: dict[str, list[float]] = defaultdict(list)

    def _get_client_ip(self, request: Request) -> str:
        client_ip = request.client.host if request.client else "unknown"
        # Only trust X-Forwarded-For from loopback (behind reverse proxy)
        if client_ip in ("127.0.0.1", "::1"):
            forwarded = request.headers.get("x-forwarded-for")
            if forwarded:
                return forwarded.split(",")[0].strip()
        return client_ip

    def check(self, request: Request) -> None:
        ip = self._get_client_ip(request)
        now = time.time()
        cutoff = now - self.window_seconds

        # Remove expired entries
        self._requests[ip] = [t for t in self._requests[ip] if t > cutoff]

        if len(self._requests[ip]) >= self.max_requests:
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please try again later.",
            )

        self._requests[ip].append(now)


class DailyUserLimiter:
    """Per-user daily request limiter. Resets at midnight."""

    def __init__(self, max_per_day: int = 5):
        self.max_per_day = max_per_day
        self._counts: dict[str, int] = {}
        self._date: date = date.today()

    def check(self, user_id: int) -> None:
        today = date.today()
        if today != self._date:
            self._counts.clear()
            self._date = today

        key = str(user_id)
        count = self._counts.get(key, 0)
        if count >= self.max_per_day:
            raise HTTPException(
                status_code=429,
                detail=f"Free tier limit: {self.max_per_day} requests per day. Upgrade to Premium for unlimited access.",
            )
        self._counts[key] = count + 1


# Shared instances
newsletter_limiter = RateLimiter(max_requests=5, window_seconds=60)
tracking_limiter = RateLimiter(max_requests=60, window_seconds=60)
auth_limiter = RateLimiter(max_requests=5, window_seconds=300)
librarian_limiter = RateLimiter(max_requests=10, window_seconds=60)
free_librarian_limiter = DailyUserLimiter(max_per_day=5)
