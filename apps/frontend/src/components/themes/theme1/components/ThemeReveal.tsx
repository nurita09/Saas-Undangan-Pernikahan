import type { ComponentProps } from "react";
import SharedReveal from "../../../shared/Reveal";

type ThemeRevealProps = Omit<ComponentProps<typeof SharedReveal>, "once">;

/** Theme 1 memakai reveal sekali agar konten tidak menghilang saat scroll balik. */
export default function ThemeReveal(props: ThemeRevealProps) {
  return <SharedReveal {...props} once />;
}
