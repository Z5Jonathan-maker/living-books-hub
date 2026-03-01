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
            <div style="font-family: Georgia, serif; max-width: 500px;
                 margin: 0 auto; padding: 40px 20px;">
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


def send_subscription_confirmation(to_email: str, user_name: str | None = None) -> bool:
    """Send a premium subscription confirmation email via Resend."""
    if not settings.resend_api_key:
        print(f"\n{'='*60}")
        print(f"[DEV] Subscription confirmation for {to_email}")
        print(f"{'='*60}\n")
        return True

    resend.api_key = settings.resend_api_key
    name = user_name or "there"

    try:
        resend.Emails.send({
            "from": settings.from_email,
            "to": [to_email],
            "subject": "Welcome to Living Books Hub Premium!",
            "html": f"""
            <div style="font-family: Georgia, serif; max-width: 500px;
                 margin: 0 auto; padding: 40px 20px;">
                <h1 style="color: #2D5F2D; font-size: 24px;">Welcome to Premium, {name}!</h1>
                <p style="color: #555; line-height: 1.6;">
                    Thank you for joining Living Books Hub Premium. You now have full access to everything:
                </p>
                <ul style="color: #555; line-height: 1.8; padding-left: 20px;">
                    <li><strong>AI Curriculum Builder</strong> — personalized year-long reading plans</li>
                    <li><strong>Unlimited child profiles</strong> — track every reader</li>
                    <li><strong>Server-synced reading plans</strong> — access from any device</li>
                    <li><strong>Smart AI Librarian</strong> — unlimited recommendations with family context</li>
                    <li><strong>Unlimited reading plans</strong> — organize your reading year</li>
                </ul>
                <a href="{settings.frontend_url}/dashboard"
                   style="display: inline-block; padding: 14px 28px; background: #2D5F2D;
                          color: white; text-decoration: none; border-radius: 8px;
                          font-weight: bold; margin: 20px 0;">
                    Go to Your Dashboard
                </a>
                <p style="margin-top: 10px;">
                    <a href="{settings.frontend_url}/curriculum"
                       style="color: #2D5F2D; font-weight: bold; text-decoration: underline;">
                        Or try the AI Curriculum Builder →
                    </a>
                </p>
                <p style="color: #999; font-size: 12px; margin-top: 30px;">
                    Questions? Reply to this email and we'll be happy to help.
                </p>
            </div>
            """,
        })
        return True
    except Exception as e:
        print(f"[ERROR] Failed to send subscription confirmation email: {e}")
        return False


def send_newsletter_welcome(to_email: str, name: str | None = None) -> bool:
    """Send a welcome email to new newsletter subscribers via Resend."""
    if not settings.resend_api_key:
        print(f"\n{'='*60}")
        print(f"[DEV] Newsletter welcome for {to_email}")
        print(f"{'='*60}\n")
        return True

    resend.api_key = settings.resend_api_key
    greeting = name or "friend"

    try:
        resend.Emails.send({
            "from": settings.from_email,
            "to": [to_email],
            "subject": "Welcome to the Living Books Hub Newsletter!",
            "html": f"""
            <div style="font-family: Georgia, serif; max-width: 500px;
                 margin: 0 auto; padding: 40px 20px;">
                <h1 style="color: #2D5F2D; font-size: 24px;">Welcome, {greeting}!</h1>
                <p style="color: #555; line-height: 1.6;">
                    You're now part of the Living Books Hub community. Here's what to expect:
                </p>
                <ul style="color: #555; line-height: 1.8; padding-left: 20px;">
                    <li><strong>Weekly book spotlight</strong> — a hand-picked living book every Tuesday</li>
                    <li><strong>New collection alerts</strong> — first to know when we add curated lists</li>
                    <li><strong>Reading tips &amp; guides</strong> — practical homeschool advice</li>
                </ul>
                <p style="color: #555; line-height: 1.6;">
                    In the meantime, start exploring:
                </p>
                <a href="{settings.frontend_url}/search"
                   style="display: inline-block; padding: 14px 28px; background: #2D5F2D;
                          color: white; text-decoration: none; border-radius: 8px;
                          font-weight: bold; margin: 20px 0;">
                    Browse Living Books
                </a>
                <p style="color: #999; font-size: 12px; margin-top: 30px;">
                    You're receiving this because you signed up at Living Books Hub.
                </p>
            </div>
            """,
        })
        return True
    except Exception as e:
        print(f"[ERROR] Failed to send newsletter welcome email: {e}")
        return False
