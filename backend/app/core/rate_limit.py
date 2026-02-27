import time
from collections import defaultdict
from fastapi import HTTPException, Request


class RateLimiter:
    """Simple in-memory rate limiter. Suitable for single-instance deployments."""

    def __init__(self, max_requests: int = 10, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._requests: dict[str, list[float]] = defaultdict(list)

    def _get_client_ip(self, request: Request) -> str:
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"

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


# Shared instances
newsletter_limiter = RateLimiter(max_requests=5, window_seconds=60)
tracking_limiter = RateLimiter(max_requests=60, window_seconds=60)
