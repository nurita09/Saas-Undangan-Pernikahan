import type { LoveStoryInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { GoldDivider, SURFACE } from '../components/ornaments';

const MAX_LOVE_STORIES = 5;

interface LoveStorySectionProps {
  stories: LoveStoryInfo[];
}

/** Section 4: Our Love Story -- timeline garis emas di latar gelap. */
export default function LoveStorySection({ stories }: LoveStorySectionProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="px-6 py-16 bg-[var(--color-secondary)]">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur">
          <h2 className="text-center text-xl font-semibold uppercase tracking-[0.35em] text-neutral-100">
            Our Love Story
          </h2>
          <GoldDivider className="mx-auto mt-3 w-48" />
        </Reveal>

        <Reveal variant="up" className="relative mt-12 pl-8">
          <div className="timeline-line absolute left-[7px] top-2 bottom-2 w-px bg-[#D4AF37]/50" />

          <div className="space-y-10">
            {stories.slice(0, MAX_LOVE_STORIES).map((story, idx) => (
              <Reveal key={idx} variant="left" delay={idx * 150} className="relative">
                <span className="absolute -left-8 top-1 h-3 w-3 rotate-45 border border-[#D4AF37] bg-[var(--color-secondary)]" />
                <p className="font-serif font-bold text-[#D4AF37]">{story.date}</p>
                {story.description && (
                  <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{story.description}</p>
                )}
                {story.photo_url && (
                  <div className="mt-4 border border-[#D4AF37]/30 p-1.5" style={{ backgroundColor: SURFACE }}>
                    <div className="aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={story.photo_url}
                        alt="Love Story"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </div>
                )}
              </Reveal>
            ))}
          </div>

          <span className="absolute -left-8 bottom-0 h-3 w-3 rotate-45 bg-[#D4AF37]" />
        </Reveal>
      </div>
    </section>
  );
}
