import type { ComponentProps } from "react";
import SharedReveal from "../../../shared/Reveal";

type ThemeRevealProps = Omit<ComponentProps<typeof SharedReveal>, "once">;

/** Theme 3 memakai aperture geometris yang tajam seperti title sequence noir. */
export default function ThemeReveal({
  className = "",
  ...props
}: ThemeRevealProps) {
  return (
    <SharedReveal
      {...props}
      once
      className={`noir-reveal ${className}`.trim()}
    />
  );
}
