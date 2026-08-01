import type { LoveStoryInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { HeartIcon, SectionTitle } from '../components/ornaments';
import story1 from '../../../../assets/theme6/story-1.jpg';
import story2 from '../../../../assets/theme6/story-2.jpg';
import story3 from '../../../../assets/theme6/story-3.jpg';

const MAX_LOVE_STORIES = 5;

/* Foto fallback bawaan tema, dipakai bergiliran kalau milestone belum punya
   foto sendiri -- timeline selalu tampil lengkap seperti desain asalnya. */
const FALLBACK_STORY_PHOTOS = [story1, story2, story3];

interface LoveStorySectionProps {
  stories: LoveStoryInfo[];
}

/** Section 4: timeline kisah cinta -- garis vertikal + penanda hati. */
export default function LoveStorySection({ stories }: LoveStorySectionProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="bg-[var(--sage-soft)] px-7 py-20">
      <Reveal variant="up">
        <SectionTitle kicker="Our Journey" title="Kisah Cinta" />
      </Reveal>
      <div className="relative mt-9 space-y-10 before:absolute before:top-2 before:bottom-2 before:left-[1.15rem] before:w-px before:bg-[var(--color-primary)]/30">
        {stories.slice(0, MAX_LOVE_STORIES).map((story, idx) => (
          <Reveal key={idx} variant="left" delay={idx * 90}>
            <div className="relative pl-12">
              <span className="absolute top-1 left-0 grid h-9 w-9 place-items-center rounded-full border border-[var(--color-primary)]/40 bg-[var(--t6-card)]">
                <HeartIcon className="h-4 w-4 text-[var(--color-primary)]" />
              </span>
              {story.date && (
                <p className="text-[0.6rem] tracking-[0.35em] text-[var(--color-primary)] uppercase">
                  {story.date}
                </p>
              )}
              <img
                src={story.photo_url || FALLBACK_STORY_PHOTOS[idx % FALLBACK_STORY_PHOTOS.length]}
                alt="Kisah cinta"
                loading="lazy"
                className="mt-3 aspect-[4/3] w-full border border-[var(--color-primary)]/25 object-cover shadow-md"
              />
              {story.description && (
                <p className="mt-3 text-sm leading-relaxed text-[var(--t6-muted)]">
                  {story.description}
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
