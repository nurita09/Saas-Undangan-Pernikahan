import type { ComponentProps } from "react";
import SharedReveal from "../../../shared/Reveal";

type ThemeRevealProps = Omit<ComponentProps<typeof SharedReveal>, "once">;

/** Theme 2 memakai reveal sekali agar alur baca tetap tenang saat scroll balik. */
export default function ThemeReveal(props: ThemeRevealProps) {
  return <SharedReveal {...props} once />;
}
