import type { LoveStoryInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import { SectionHeading, halftoneBackground } from "../components/ornaments";

const MAX_LOVE_STORIES = 5;
interface LoveStorySectionProps {
  stories: LoveStoryInfo[];
}

/** Bab perjalanan ala zine dengan nomor editorial besar. */
export default function LoveStorySection({ stories }: LoveStorySectionProps) {
  if (!stories || stories.length === 0) return null;
  return (
    <section className="rp-section-ink relative overflow-hidden px-6 py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={halftoneBackground(0.12)}
      />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="blur">
          <SectionHeading
            eyebrow="How It All Started"
            title="Our Story So Far"
            inverse
            align="left"
          />
        </Reveal>
        <div className="mt-11 space-y-7">
          {stories.slice(0, MAX_LOVE_STORIES).map((story, index) => (
            <Reveal
              key={`${story.date}-${index}`}
              variant="up"
              delay={(index % 3) * 80}
            >
              <article className="rp-card overflow-hidden">
                {story.photo_url && (
                  <figure className="aspect-[16/10] overflow-hidden">
                    <img
                      src={story.photo_url}
                      alt={`Cerita ${story.date || index + 1}`}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-[1000ms] hover:scale-105"
                    />
                  </figure>
                )}
                <div
                  className={`grid grid-cols-[58px_1fr] gap-4 p-5 ${index % 2 === 0 ? "bg-[var(--rp-yellow)]" : "bg-[var(--rp-blue)]"}`}
                >
                  <span className="font-retro text-[2.7rem] leading-none text-[var(--color-primary)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-retro text-lg text-[var(--rp-ink)]">
                      {story.date || "Our Story"}
                    </p>
                    {story.description && (
                      <p className="mt-2 text-sm leading-relaxed text-[var(--rp-ink)]/75">
                        {story.description}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
