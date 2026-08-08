import type { ComponentProps } from "react";
import SharedReveal from "../../../shared/Reveal";

type ThemeRevealProps = Omit<ComponentProps<typeof SharedReveal>, "once">;

/** Theme 4 menurunkan konten seperti cahaya lembut dari puncak mihrab. */
export default function ThemeReveal({
  className = "",
  ...props
}: ThemeRevealProps) {
  return (
    <SharedReveal
      {...props}
      once
      className={`islamic-reveal ${className}`.trim()}
    />
  );
}
