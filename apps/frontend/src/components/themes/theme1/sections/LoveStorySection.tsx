import type { LoveStoryInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { FloralCorners, HeartIcon, SectionTitle } from '../components/ornaments';

const MAX_LOVE_STORIES = 5;

interface LoveStorySectionProps {
  stories: LoveStoryInfo[];
}

/** Section 4: timeline Love Story -- garis emas + penanda hati blush. */
export default function LoveStorySection({ stories }: LoveStorySectionProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="relative overflow-hidden px-6 py-20">
      <FloralCorners spots={['tl', 'br']} opacity="opacity-35" />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="bloom">
          <SectionTitle eyebrow="Our Journey" title="Love Story" />
        </Reveal>
        <ol className="mt-12 space-y-11 border-l border-[var(--fl-gold)]/40 pl-9">
          {stories.slice(0, MAX_LOVE_STORIES).map((story, idx) => (
            <li key={idx} className="relative">
              <Reveal variant="bloom" delay={idx * 120}>
                <span className="absolute -left-[2.8rem] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--fl-blush)]">
                  <HeartIcon className="h-2.5 w-2.5 text-white" />
                </span>
                {story.date && <p className="label-caps text-[var(--fl-clay)]">{story.date}</p>}
                {story.description && (
                  <p className="mt-3 font-floral-serif text-lg leading-relaxed text-[var(--fl-muted)]">
                    {story.description}
                  </p>
                )}
                {story.photo_url && (
                  <div className="card-petal mt-4 p-2">
                    <img
                      src={story.photo_url}
                      alt="Love Story"
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
