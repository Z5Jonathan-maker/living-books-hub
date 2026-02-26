# Skill: Create Curated List

## Purpose
Create a new curated book list (e.g., "Early Elementary Favorites").

## Steps
1. Create the list via `POST /api/v1/admin/lists` with name, description, optional cover_image_url
2. Add books to the list via `POST /api/v1/admin/lists/{list_id}/items` with book_id, rank, optional note
3. Verify the list appears on the frontend curated lists page

## Example
```json
{
  "name": "Nature Study Essentials",
  "description": "Living books that bring the natural world alive for young readers.",
  "items": [
    {"book_id": 1, "rank": 1, "note": "Start here — a gentle introduction"},
    {"book_id": 5, "rank": 2}
  ]
}
```
