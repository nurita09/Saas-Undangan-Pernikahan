import type { LoveStoryInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import { GoldDivider } from "../components/ornaments";

const MAX_LOVE_STORIES = 5;

interface LoveStorySectionProps {
  stories: LoveStoryInfo[];
}

/** Timeline editorial dengan penanda geometris khas art-deco. */
export default function LoveStorySection({ stories }: LoveStorySectionProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="noir-section px-6 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur" className="text-center">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-[var(--color-primary)]">
            Chapters Of Us
          </p>
          <h2 className="mt-4 font-script text-[4rem] leading-none text-[var(--dk-ivory)]">
            Our Love Story
          </h2>
          <GoldDivider className="mx-auto mt-5 w-48" />
        </Reveal>

        <div className="relative mt-14 pl-9">
          <div
            className="absolute bottom-2 left-[7px] top-2 w-px bg-[var(--dk-line)]"
            aria-hidden="true"
          />

          <div className="space-y-12">
            {stories.slice(0, MAX_LOVE_STORIES).map((story, idx) => (
              <Reveal
                key={`${story.date}-${idx}`}
                variant="left"
                delay={idx * 100}
                className="relative"
              >
                <span
                  className="absolute -left-9 top-1 h-4 w-4 rotate-45 border border-[var(--color-primary)] bg-[var(--dk-wine)] shadow-[0_0_0_5px_var(--color-secondary)]"
                  aria-hidden="true"
                />
                <article>
                  <p className="font-serif text-xl text-[var(--color-primary)]">
                    {story.date || "Our Story"}
                  </p>
                  {story.description && (
                    <p className="mt-3 text-sm leading-relaxed text-[var(--dk-muted)]">
                      {story.description}
                    </p>
                  )}
                  {story.photo_url && (
                    <figure className="noir-card mt-5 overflow-hidden p-1.5">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={story.photo_url}
                          alt={`Momen ${story.date || idx + 1}`}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-[1000ms] hover:scale-105"
                        />
                      </div>
                    </figure>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
