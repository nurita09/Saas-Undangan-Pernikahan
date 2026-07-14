import type { LoveStoryInfo } from '../../../../types/wedding';
import Reveal from '../components/Reveal';
import section4TopLeft from '../../../../assets/theme1/section4/th1-section4-ataskiri.png';
import section4TopRight from '../../../../assets/theme1/section4/th1-section4-ataskanan.png';

const MAX_LOVE_STORIES = 5;

interface LoveStorySectionProps {
  stories: LoveStoryInfo[];
}

/** Section 4: timeline Love Story. Garis timeline "menggambar dirinya" saat
 *  masuk viewport (lihat .timeline-line di index.css), lalu tiap milestone
 *  muncul bergantian dari kiri. */
export default function LoveStorySection({ stories }: LoveStorySectionProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="relative px-6 py-16 bg-white overflow-hidden">
      <img
        src={section4TopLeft}
        alt=""
        aria-hidden="true"
        className="deco-float pointer-events-none select-none absolute top-4 left-0 w-[24%] h-auto z-0"
        style={{ animationDuration: '9s' }}
      />
      <img
        src={section4TopRight}
        alt=""
        aria-hidden="true"
        className="deco-float pointer-events-none select-none absolute top-4 right-0 w-[18%] h-auto z-0"
        style={{ animationDuration: '11s', animationDelay: '0.6s' }}
      />

      <div className="relative z-10 mx-auto max-w-md">
        <Reveal variant="blur">
          <h2 className="text-center text-3xl font-bold uppercase tracking-wide text-neutral-800">
            Love Story
          </h2>
        </Reveal>

        <Reveal variant="up" className="relative mt-12 pl-8">
          <div className="timeline-line absolute left-[7px] top-2 bottom-2 w-px bg-neutral-300" />

          <div className="space-y-10">
            {stories.slice(0, MAX_LOVE_STORIES).map((story, idx) => (
              <Reveal key={idx} variant="left" delay={idx * 150} className="relative">
                <span className="absolute -left-8 top-1 h-3.5 w-3.5 rounded-full border-2 border-[var(--color-primary)] bg-white" />
                <p className="font-bold text-neutral-800">{story.date}</p>
                {story.description && (
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{story.description}</p>
                )}
                {story.photo_url && (
                  <div className="mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl">
                    <img
                      src={story.photo_url}
                      alt="Love Story"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                )}
              </Reveal>
            ))}
          </div>

          <span className="absolute -left-8 bottom-0 h-3.5 w-3.5 rounded-full bg-[var(--color-primary)]" />
        </Reveal>
      </div>
    </section>
  );
}
