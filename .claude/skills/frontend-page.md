# Skill: Create Frontend Page

## Purpose
Add a new page to the Next.js App Router frontend.

## Convention
- Pages in `frontend/src/app/` using App Router file conventions
- Use server components by default
- Client components only for interactivity (search, filters, forms)
- Tailwind CSS for all styling
- Fetch data from backend API via server-side fetch or client hooks

## Steps
1. Create `page.tsx` in appropriate `frontend/src/app/<route>/` directory
2. Add types to `frontend/src/types/`
3. Create reusable components in `frontend/src/components/`
4. Add loading.tsx and error.tsx for the route if needed
5. Update navigation if needed

## Template
```tsx
// frontend/src/app/books/page.tsx
export default async function BooksPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/books`);
  const books = await res.json();
  return <div>...</div>;
}
```
