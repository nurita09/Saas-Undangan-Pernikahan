import type { LoveStoryInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { ArchDivider, KhatamStar } from '../components/ornaments';

const MAX_LOVE_STORIES = 5;

interface LoveStorySectionProps {
  stories: LoveStoryInfo[];
}

/** Section 4: Kisah Perjalanan -- timeline berpenanda bintang khatam. */
export default function LoveStorySection({ stories }: LoveStorySectionProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="px-6 py-16 bg-[var(--color-secondary)]">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur">
          <h2 className="text-center font-serif text-2xl font-semibold text-neutral-800">
            Kisah Perjalanan
          </h2>
          <ArchDivider className="mx-auto mt-3 w-44" />
        </Reveal>

        <Reveal variant="up" className="relative mt-12 pl-8">
          <div className="timeline-line absolute left-[7px] top-2 bottom-2 w-px bg-[var(--color-primary)]/40" />

          <div className="space-y-10">
            {stories.slice(0, MAX_LOVE_STORIES).map((story, idx) => (
              <Reveal key={idx} variant="left" delay={idx * 150} className="relative">
                <KhatamStar className="absolute -left-[38px] top-0 h-5 w-5 text-[var(--color-primary)] bg-[var(--color-secondary)]" />
                <p className="font-serif font-bold text-[var(--color-primary)]">{story.date}</p>
                {story.description && (
                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{story.description}</p>
                )}
                {story.photo_url && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-primary)]/30 bg-white p-1.5">
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
                      <img
                        src={story.photo_url}
                        alt="Kisah perjalanan"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
