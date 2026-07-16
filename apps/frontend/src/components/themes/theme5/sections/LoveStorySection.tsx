import type { LoveStoryInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { COCOA, Daisy, GroovyDivider } from '../components/ornaments';

const MAX_LOVE_STORIES = 5;

interface LoveStorySectionProps {
  stories: LoveStoryInfo[];
}

/** Section 4: perjalanan kita -- timeline berpenanda daisy. */
export default function LoveStorySection({ stories }: LoveStorySectionProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="px-6 py-16 bg-[var(--color-secondary)]">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur">
          <h2 className="text-center font-retro text-3xl" style={{ color: COCOA }}>
            Perjalanan Kita
          </h2>
          <GroovyDivider className="mx-auto mt-3 w-48" />
        </Reveal>

        <Reveal variant="up" className="relative mt-12 pl-9">
          <div className="timeline-line absolute left-[9px] top-2 bottom-2 w-[3px] rounded bg-[var(--color-primary)]/50" />

          <div className="space-y-10">
            {stories.slice(0, MAX_LOVE_STORIES).map((story, idx) => (
              <Reveal key={idx} variant="left" delay={idx * 150} className="relative">
                <Daisy
                  className={`absolute -left-[42px] top-0 h-6 w-6 ${
                    idx % 2 === 0 ? 'text-[#C75B39]' : 'text-[#E3B23C]'
                  }`}
                />
                <p className="font-retro text-lg" style={{ color: COCOA }}>
                  {story.date}
                </p>
                {story.description && (
                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{story.description}</p>
                )}
                {story.photo_url && (
                  <div
                    className={`mt-4 w-fit ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'} rounded-[1.5rem] border-4 bg-white p-1.5 shadow-[5px_5px_0_#5C4033] transition-transform duration-500 hover:rotate-0`}
                    style={{ borderColor: COCOA }}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-[1rem]">
                      <img
                        src={story.photo_url}
                        alt="Perjalanan kita"
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
