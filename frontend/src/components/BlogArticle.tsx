import Link from "next/link";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { EmailSignup } from "@/components/EmailSignup";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://livingbookshub.com";

export function BlogArticle({
  title,
  slug,
  datePublished,
  description,
  children,
}: {
  title: string;
  slug: string;
  datePublished: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <article className="animate-fade-in">
      <ArticleJsonLd
        title={title}
        description={description}
        url={`${SITE_URL}/blog/${slug}`}
        datePublished={datePublished}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          { name: title, url: `${SITE_URL}/blog/${slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center gap-2 text-sm text-warm-gray mb-8">
          <Link href="/" className="hover:text-ink transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-ink transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span className="text-ink font-medium truncate">{title}</span>
        </nav>
      </div>

      {/* Article header */}
      <header className="bg-paper-texture bg-cream py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <time
            dateTime={datePublished}
            className="text-sm text-warm-gray/60"
          >
            {new Date(datePublished).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <h1 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-ink leading-tight">
            {title}
          </h1>
          <p className="mt-4 text-lg text-warm-gray max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </header>

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none text-warm-gray leading-relaxed space-y-6">
          {children}
        </div>
      </div>

      {/* CTA footer */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <EmailSignup variant="card" source={`blog_${slug}`} />
        <div className="mt-8 text-center">
          <Link href="/blog" className="btn-secondary text-sm">
            More Articles
          </Link>
        </div>
      </div>
    </article>
  );
}
