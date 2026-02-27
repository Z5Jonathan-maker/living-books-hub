import json

from groq import Groq

from app.core.config import settings


def get_groq_client() -> Groq | None:
    """Get Groq client if configured."""
    if not settings.groq_enabled or not settings.groq_api_key:
        return None
    return Groq(api_key=settings.groq_api_key)


def generate_curriculum(
    child_name: str,
    child_age: int,
    interests: list[str],
    reading_level: str | None,
    book_catalog: str,
    preferences: dict | None = None,
) -> dict:
    """
    Generate a year-long reading curriculum using Groq Llama 3.3 70B.

    Returns structured dict with terms, weeks, and book assignments.
    """
    client = get_groq_client()
    if not client:
        raise ValueError("Groq AI is not configured")

    subject_prefs = preferences.get("subjects", []) if preferences else []
    period_prefs = preferences.get("time_periods", []) if preferences else []

    system_prompt = f"""You are an expert homeschool curriculum designer specializing in "living books" —
books written by passionate authors that bring subjects alive through literary storytelling.

You are creating a full-year reading plan for a child. You MUST ONLY recommend books from the
catalog provided below. Do NOT invent books that are not in this list.

BOOK CATALOG:
{book_catalog}

OUTPUT FORMAT: Return valid JSON matching this structure exactly:
{{
  "plan_name": "A descriptive name for this curriculum",
  "description": "A warm 2-3 sentence description of this plan",
  "terms": [
    {{
      "name": "Fall Term",
      "weeks": [
        {{
          "week_number": 1,
          "books": [
            {{"title": "exact title from catalog", "author": "exact author", "notes": "1-2 sentences on why this book fits and how to use it"}}
          ]
        }}
      ]
    }}
  ]
}}

Guidelines:
- Create 3 terms (Fall, Winter, Spring), each with 10-12 weeks
- Assign 1-2 books per week (some books span multiple weeks for longer reads)
- Vary subjects across the year for a well-rounded education
- Match reading difficulty to the child's level
- Group related books together when it makes sense (e.g., multiple history books in sequence)
- Include a mix of read-alouds and independent reads based on age
- Add practical notes for the parent on how to get the most from each book"""

    user_prompt = f"""Create a full-year living books reading plan for:
- Name: {child_name}
- Age: {child_age}
- Reading level: {reading_level or 'not specified'}
- Interests: {', '.join(interests) if interests else 'general — surprise us!'}
{"- Focus subjects: " + ', '.join(subject_prefs) if subject_prefs else ""}
{"- Time periods of interest: " + ', '.join(period_prefs) if period_prefs else ""}

Make it wonderful — this parent is trusting you to craft their child's literary year."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.7,
        max_tokens=4000,
        response_format={"type": "json_object"},
    )

    return json.loads(response.choices[0].message.content)


def ask_librarian_ai(
    message: str,
    book_catalog: str,
    family_context: str | None = None,
) -> str:
    """
    AI librarian chat using Groq Llama 3.3 70B.
    Returns a text response with book recommendations.
    """
    client = get_groq_client()
    if not client:
        raise ValueError("Groq AI is not configured")

    family_section = ""
    if family_context:
        family_section = f"""

FAMILY CONTEXT (use this to personalize your recommendations):
{family_context}
"""

    system_prompt = f"""You are a warm, knowledgeable librarian specializing in "living books" —
books written by passionate authors that bring subjects alive through storytelling.
You help homeschool and alternative education families find the perfect books.

ONLY recommend books from this catalog:
{book_catalog}
{family_section}
Be warm, specific, and helpful. Explain why each book is special and who it's perfect for.
Keep responses concise — 2-3 book recommendations max with brief explanations.
Always use the exact title and author from the catalog."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message},
        ],
        temperature=0.7,
        max_tokens=500,
    )

    return response.choices[0].message.content
