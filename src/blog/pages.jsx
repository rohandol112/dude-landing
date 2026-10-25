import { ArticleBody, AuthorBlock, Cover } from "@/blog/components/article";
import { BlogLayout } from "@/blog/components/blog-layout";
import { Breadcrumb, CategoryNav, Pagination } from "@/blog/components/navigation";
import { FeaturedPost, PostGrid, SectionLink, SectionTitle } from "@/blog/components/post-card";
import { ShareLinks } from "@/blog/components/share-links";
import { StoryCarousel } from "@/blog/components/story-carousel";
import { Island } from "@/blog/island";
import { archivePath, categoryPath, postPath } from "@/blog/paths";
import { BLOG_DESCRIPTION } from "@/blog/seo";
import { site } from "@/content/site";

const container = "mx-auto max-w-[1200px] px-5";

function EmptyBlog() {
  return (
    <p className="card-surface px-6 py-12 text-center text-lg text-ink/65">
      No posts have been published yet. Check back soon.
    </p>
  );
}

/** The blog's front page: the lead post, stories, the latest and each section. */
function BlogIndexPage({ page }) {
  const stories = { id: "featured-stories", title: "Featured stories,", accent: "from real projects.", posts: page.stories };
  return (
    <>
      <header className={container}>
        <p className="text-[13px] font-semibold tracking-[0.14em] text-[#8a6400] uppercase">The Dudestrap Blog</p>
        <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.75rem,6.4vw,5.25rem)] leading-[1.01] tracking-[-0.018em] text-balance text-ink">
          Ideas worth making, <span className="text-ink/50">from the team that makes them.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-pretty text-ink/65 md:text-lg">{BLOG_DESCRIPTION}</p>
        <CategoryNav categories={page.categories} className="mt-10" />
      </header>

      <div className={`${container} mt-10`}>{page.hero ? <FeaturedPost post={page.hero} /> : <EmptyBlog />}</div>

      {page.stories.length > 0 ? (
        <div className="mt-24 md:mt-32">
          <Island name="stories" props={stories}>
            <StoryCarousel {...stories} />
          </Island>
        </div>
      ) : null}

      {page.latest.length > 0 ? (
        <section className={`${container} mt-24 md:mt-32`} aria-labelledby="latest-posts">
          <SectionTitle
            id="latest-posts"
            title="Latest"
            accent="posts."
            action={<SectionLink href={archivePath(1)}>View all posts</SectionLink>}
          />
          <PostGrid posts={page.latest} />
        </section>
      ) : null}

      {page.sections.map(({ category, posts }) => (
        <section key={category.slug} className={`${container} mt-24 md:mt-32`} aria-labelledby={`section-${category.slug}`}>
          <SectionTitle
            id={`section-${category.slug}`}
            title={category.label}
            action={<SectionLink href={categoryPath(category.slug)}>View all {category.label.toLowerCase()}</SectionLink>}
          />
          <PostGrid posts={posts} />
        </section>
      ))}
    </>
  );
}

/** Every post, or one category's, as numbered pages. */
function BlogArchivePage({ page }) {
  const name = page.category ? page.category.label : "All posts";
  const hrefFor = (target) => (page.category ? categoryPath(page.category.slug, target) : archivePath(target));
  return (
    <div className={container}>
      <header>
        <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: name }]} />
        <h1 className="mt-6 font-display text-[clamp(2.5rem,5.6vw,4.5rem)] leading-[1.02] tracking-[-0.018em] text-ink">
          {page.page > 1 ? `${name}, page ${page.page}` : name}
        </h1>
        <p className="mt-4 text-[16px] text-ink/55">
          {page.total} {page.total === 1 ? "post" : "posts"}
          {page.totalPages > 1 ? ` · page ${page.page} of ${page.totalPages}` : ""}
        </p>
        <CategoryNav categories={page.categories} active={page.category?.slug} className="mt-8" />
      </header>
      <div className="mt-12">{page.posts.length > 0 ? <PostGrid posts={page.posts} eagerFirst={3} /> : <EmptyBlog />}</div>
      <Pagination page={page.page} totalPages={page.totalPages} hrefFor={hrefFor} className="mt-20" />
    </div>
  );
}

/** One article: breadcrumb, title, byline, cover, body, tags, share, related. */
function BlogPostPage({ page }) {
  const { post, related } = page;
  const share = { url: new URL(postPath(post.slug), site.url).href, title: post.title };
  return (
    <>
      <article>
        <div className="mx-auto max-w-[760px] px-5">
          <Breadcrumb
            items={[
              { label: "Blog", href: "/blog" },
              { label: post.category.label, href: categoryPath(post.category.slug) },
            ]}
          />
          <header className="mt-8">
            <h1 className="font-display text-[clamp(2.5rem,5.4vw,4.25rem)] leading-[1.03] tracking-[-0.02em] text-balance text-ink">
              {post.title}
            </h1>
            <p className="mt-6 text-[19px] leading-relaxed text-pretty text-ink/65 md:text-[21px]">{post.excerpt}</p>
            <AuthorBlock
              author={post.author}
              publishedAt={post.published_at}
              updatedAt={post.updated_at}
              minutes={post.reading_minutes}
            />
          </header>
        </div>

        {post.cover ? <Cover cover={post.cover} /> : null}

        <div className="mx-auto mt-12 max-w-[760px] px-5">
          <ArticleBody markdown={post.content_markdown} media={post.media} />
          {post.tags.length > 0 ? (
            <ul aria-label="Tags" className="mt-12 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag} className="rounded-full bg-mist px-3.5 py-1.5 text-[14px] text-ink/70">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
          <Island name="share" props={share}>
            <ShareLinks {...share} />
          </Island>
        </div>
      </article>

      {related.length > 0 ? (
        <section className={`${container} mt-28`} aria-labelledby="related-posts">
          <SectionTitle
            id="related-posts"
            title="More in"
            accent={`${post.category.label.toLowerCase()}.`}
            action={
              <SectionLink href={categoryPath(post.category.slug)}>
                View all {post.category.label.toLowerCase()}
              </SectionLink>
            }
          />
          <PostGrid posts={related} />
        </section>
      ) : null}
    </>
  );
}

const PAGES = { index: BlogIndexPage, archive: BlogArchivePage, post: BlogPostPage };

/** A whole blog page, as the build and the dev server render it. */
export function BlogDocument({ page }) {
  const Page = PAGES[page.kind];
  return (
    <BlogLayout>
      <Page page={page} />
    </BlogLayout>
  );
}
