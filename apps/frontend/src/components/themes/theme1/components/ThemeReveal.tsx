import type { ComponentProps } from "react";
import SharedReveal from "../../../shared/Reveal";

type ThemeRevealProps = Omit<ComponentProps<typeof SharedReveal>, "once">;

/** Theme 1 memakai gerak "mekar" yang lembut dan hanya dijalankan sekali. */
export default function ThemeReveal({
  className = "",
  ...props
}: ThemeRevealProps) {
  return (
    <SharedReveal
      {...props}
      once
      className={`floral-reveal ${className}`.trim()}
    />
  );
}
