import resend

from app.core.config import settings


def send_magic_link_email(to_email: str, magic_link_url: str) -> bool:
    """Send a magic link email via Resend."""
    if not settings.resend_api_key:
        # Dev fallback: print to console
        print(f"\n{'='*60}")
        print(f"[DEV] Magic link for {to_email}:")
        print(f"  {magic_link_url}")
        print(f"{'='*60}\n")
        return True

    resend.api_key = settings.resend_api_key
    try:
        resend.Emails.send({
            "from": settings.from_email,
            "to": [to_email],
            "subject": "Sign in to Living Books Hub",
            "html": f"""
            <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
                <h1 style="color: #2D5F2D; font-size: 24px;">Welcome to Living Books Hub</h1>
                <p style="color: #555; line-height: 1.6;">
                    Click the button below to sign in. This link expires in 15 minutes.
                </p>
                <a href="{magic_link_url}"
                   style="display: inline-block; padding: 14px 28px; background: #2D5F2D;
                          color: white; text-decoration: none; border-radius: 8px;
                          font-weight: bold; margin: 20px 0;">
                    Sign In to Living Books Hub
                </a>
                <p style="color: #999; font-size: 12px; margin-top: 30px;">
                    If you didn't request this, you can safely ignore this email.
                </p>
            </div>
            """,
        })
        return True
    except Exception as e:
        print(f"[ERROR] Failed to send magic link email: {e}")
        return False
