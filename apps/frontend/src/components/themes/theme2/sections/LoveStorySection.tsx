import type { LoveStoryInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import { SectionTitle } from "../components/ornaments";

const MAX_LOVE_STORIES = 5;

interface LoveStorySectionProps {
  stories: LoveStoryInfo[];
}

/** Section 4: Lampahing Katresnan -- timeline dengan penanda wajik emas. */
export default function LoveStorySection({ stories }: LoveStorySectionProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="jw-paper-section px-6 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="bloom">
          <SectionTitle kicker="Lelampahan" title="Lampahing Katresnan" />
        </Reveal>
        <div className="relative mt-14 pl-8">
          <span className="absolute top-2 bottom-2 left-1.5 w-px bg-gradient-to-b from-transparent via-[var(--jw-gold)]/50 to-transparent" />
          <div className="space-y-10">
            {stories.slice(0, MAX_LOVE_STORIES).map((story, idx) => (
              <Reveal key={idx} variant="bloom" delay={idx * 110}>
                <div className="relative">
                  <span className="absolute top-1.5 -left-[1.72rem] size-3 rotate-45 border border-[var(--jw-russet)] bg-[var(--color-secondary)]" />
                  {story.date && (
                    <p className="font-jawa-serif text-xl font-semibold tracking-wide text-[var(--color-primary)]">
                      {story.date}
                    </p>
                  )}
                  {story.description && (
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--jw-muted)]">
                      {story.description}
                    </p>
                  )}
                  {story.photo_url && (
                    <div className="mt-5 aspect-[4/3] w-full overflow-hidden rounded-[4px] border border-[var(--jw-gold)]/40 bg-[var(--jw-card)] p-1.5 shadow-[var(--jw-shadow)]">
                      <img
                        src={story.photo_url}
                        alt="Lampahing katresnan"
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
