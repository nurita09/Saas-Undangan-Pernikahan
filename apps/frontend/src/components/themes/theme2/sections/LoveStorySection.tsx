import type { LoveStoryInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { OrnamentDivider } from '../components/ornaments';

const MAX_LOVE_STORIES = 5;

interface LoveStorySectionProps {
  stories: LoveStoryInfo[];
}

/** Section 4: Lampahing Katresnan (perjalanan cinta) -- timeline wajik emas. */
export default function LoveStorySection({ stories }: LoveStorySectionProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="px-6 py-16 bg-white">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur">
          <h2 className="text-center text-2xl font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            Lampahing Katresnan
          </h2>
          <OrnamentDivider className="mx-auto mt-3 w-44" />
        </Reveal>

        <Reveal variant="up" className="relative mt-12 pl-8">
          <div className="timeline-line absolute left-[7px] top-2 bottom-2 w-px bg-[#C9A227]/60" />

          <div className="space-y-10">
            {stories.slice(0, MAX_LOVE_STORIES).map((story, idx) => (
              <Reveal key={idx} variant="left" delay={idx * 150} className="relative">
                {/* Penanda wajik (belah ketupat), bukan bulat -- ciri ornamen Jawa */}
                <span className="absolute -left-8 top-1 h-3 w-3 rotate-45 border-2 border-[#C9A227] bg-white" />
                <p className="font-serif font-bold text-[var(--color-primary)]">{story.date}</p>
                {story.description && (
                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{story.description}</p>
                )}
                {story.photo_url && (
                  <div className="mt-4 aspect-[4/3] w-full overflow-hidden border border-[#C9A227]/40 p-1.5 bg-white">
                    <img
                      src={story.photo_url}
                      alt="Lampahing katresnan"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                )}
              </Reveal>
            ))}
          </div>

          <span className="absolute -left-8 bottom-0 h-3 w-3 rotate-45 bg-[#C9A227]" />
        </Reveal>
      </div>
    </section>
  );
}
