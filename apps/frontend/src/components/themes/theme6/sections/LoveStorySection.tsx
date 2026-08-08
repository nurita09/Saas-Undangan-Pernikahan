import type { LoveStoryInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import { SectionTitle } from "../components/ornaments";
import story1 from "../../../../assets/theme6/story-1.jpg";
import story2 from "../../../../assets/theme6/story-2.jpg";
import story3 from "../../../../assets/theme6/story-3.jpg";

const MAX_LOVE_STORIES = 5;
const FALLBACK_STORY_PHOTOS = [story1, story2, story3];

interface LoveStorySectionProps {
  stories: LoveStoryInfo[];
}

/** Rangkaian kisah sebagai lembar katalog, bukan timeline generik. */
export default function LoveStorySection({ stories }: LoveStorySectionProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[var(--va-forest)] px-6 py-24 text-[var(--va-vellum)]">
      <span className="pointer-events-none absolute -left-5 top-28 font-vintage text-[9rem] text-white/[0.035]">
        &amp;
      </span>
      <Reveal variant="up">
        <SectionTitle
          kicker="Chronicle of Us"
          title="Catatan Perjalanan"
          inverse
          description="Beberapa halaman kecil yang membawa kami sampai pada hari ini."
        />
      </Reveal>

      <div className="mt-11 space-y-11">
        {stories.slice(0, MAX_LOVE_STORIES).map((story, index) => (
          <Reveal
            key={`${story.date}-${index}`}
            variant={index % 2 === 0 ? "left" : "right"}
          >
            <article>
              <div
                className={`va-photo-frame ${index % 2 === 0 ? "rotate-[-0.8deg]" : "rotate-[0.8deg]"}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      story.photo_url ||
                      FALLBACK_STORY_PHOTOS[
                        index % FALLBACK_STORY_PHOTOS.length
                      ]
                    }
                    alt={`Catatan perjalanan ${index + 1}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover saturate-[0.76]"
                  />
                  <span className="absolute left-3 top-3 grid h-10 w-10 place-items-center bg-[var(--va-oxblood)] font-vintage text-lg text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-center justify-between px-1 pb-1 pt-2 text-[0.5rem] tracking-[0.16em] text-[var(--va-muted)] uppercase">
                  <span>Archive entry</span>
                  <span>{story.date || "Undated"}</span>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-[auto_minmax(0,1fr)] gap-4">
                <span className="font-vintage text-4xl leading-none text-[var(--va-brass-soft)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="border-l border-[var(--va-brass-soft)]/35 pl-4">
                  {story.date && (
                    <p className="text-[0.57rem] tracking-[0.24em] text-[var(--va-brass-soft)] uppercase">
                      {story.date}
                    </p>
                  )}
                  {story.description && (
                    <p className="mt-2 text-sm leading-7 text-[var(--va-vellum)]/75">
                      {story.description}
                    </p>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
