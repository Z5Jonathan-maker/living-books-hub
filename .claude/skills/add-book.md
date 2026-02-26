# Skill: Add Book to Catalog

## Purpose
Add a new book entry to the Living Books database.

## Steps
1. Validate required fields: title, author, description, age_range, subjects
2. Check for duplicate ISBN if provided
3. Insert into `books` table via the FastAPI admin endpoint `POST /api/v1/admin/books`
4. Optionally attach book_links (vendor URLs) and list memberships

## Required Fields
- title (str)
- author (str)
- description (str, 1-3 sentences)
- age_range (str, e.g. "6-9")
- subjects (list[str], e.g. ["history", "nature"])

## Optional Fields
- long_description, reading_level, time_period, region, isbn, cover_image_url, language, series, awards, popularity_score

## Example
```json
{
  "title": "Paddle-to-the-Sea",
  "author": "Holling C. Holling",
  "description": "A carved wooden canoe travels from Lake Superior to the Atlantic Ocean.",
  "age_range": "8-12",
  "subjects": ["geography", "nature", "adventure"],
  "reading_level": "intermediate",
  "time_period": "20th century"
}
```
