import type { LoveStoryInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import { KhatamStar, SectionHeading } from "../components/ornaments";

const MAX_LOVE_STORIES = 5;

interface LoveStorySectionProps {
  stories: LoveStoryInfo[];
}

/** Kisah pasangan disajikan sebagai bab editorial, bukan timeline panjang. */
export default function LoveStorySection({ stories }: LoveStorySectionProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="im-section-tint px-6 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur">
          <SectionHeading
            arabic="وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"
            eyebrow="Jejak Yang Disatukan"
            title="Kisah Perjalanan"
          />
        </Reveal>

        <div className="mt-11 space-y-6">
          {stories.slice(0, MAX_LOVE_STORIES).map((story, index) => (
            <Reveal
              key={`${story.date}-${index}`}
              variant="up"
              delay={(index % 3) * 80}
            >
              <article className="im-card overflow-hidden">
                {story.photo_url && (
                  <figure className="aspect-[16/10] overflow-hidden">
                    <img
                      src={story.photo_url}
                      alt={`Kisah ${story.date || index + 1}`}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-[1000ms] hover:scale-105"
                    />
                  </figure>
                )}
                <div className="relative p-6 text-left">
                  <KhatamStar className="absolute right-5 top-5 h-6 w-6 text-[var(--im-clay)]/60" />
                  <p className="text-[0.52rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
                    Chapter {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 pr-8 font-serif text-xl text-[var(--im-ink)]">
                    {story.date || "Our Story"}
                  </h3>
                  {story.description && (
                    <p className="mt-3 text-sm leading-relaxed text-[var(--im-muted)]">
                      {story.description}
                    </p>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
