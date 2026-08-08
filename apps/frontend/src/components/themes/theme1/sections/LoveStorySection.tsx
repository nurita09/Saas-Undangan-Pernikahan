import type { LoveStoryInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import {
  FloralCorners,
  HeartIcon,
  SectionTitle,
} from "../components/ornaments";

const MAX_LOVE_STORIES = 5;

interface LoveStorySectionProps {
  stories: LoveStoryInfo[];
}

/** Section 4: timeline Love Story -- garis emas + penanda hati blush. */
export default function LoveStorySection({ stories }: LoveStorySectionProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="floral-section relative overflow-hidden px-6 py-24">
      <FloralCorners spots={["bl"]} size="w-28" opacity="opacity-25" />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="bloom">
          <SectionTitle eyebrow="Our Journey" title="Love Story" />
        </Reveal>
        <ol className="mt-12 space-y-14 border-l border-[var(--fl-gold)]/45 pl-9">
          {stories.slice(0, MAX_LOVE_STORIES).map((story, idx) => (
            <li key={idx} className="relative">
              <Reveal variant="bloom" delay={idx * 120}>
                <span className="absolute -left-[2.9rem] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-white/70 bg-[var(--fl-blush)] shadow-[0_8px_20px_-10px_rgba(74,66,56,0.8)]">
                  <HeartIcon className="h-2.5 w-2.5 text-white" />
                </span>
                <p className="font-floral-sans text-[0.65rem] font-medium uppercase tracking-[0.14em] text-[var(--fl-clay)]">
                  {String(idx + 1).padStart(2, "0")}
                  {story.date ? `  /  ${story.date}` : ""}
                </p>
                {story.description && (
                  <p className="mt-4 font-floral-serif text-xl leading-[1.65] text-[var(--fl-muted)]">
                    {story.description}
                  </p>
                )}
                {story.photo_url && (
                  <figure className="mt-5 overflow-hidden rounded-[6px] border border-[var(--fl-gold)]/30 bg-white/50 p-1.5 shadow-[0_20px_45px_-32px_rgba(74,66,56,0.65)]">
                    <img
                      src={story.photo_url}
                      alt="Love Story"
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </figure>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
