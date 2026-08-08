import type { ComponentProps } from "react";
import SharedReveal from "../../../shared/Reveal";

type ThemeRevealProps = Omit<ComponentProps<typeof SharedReveal>, "once">;

/** Theme 2 membuka konten dari garis tengah seperti sepasang daun gebyok. */
export default function ThemeReveal({
  className = "",
  ...props
}: ThemeRevealProps) {
  return (
    <SharedReveal
      {...props}
      once
      className={`javanese-reveal ${className}`.trim()}
    />
  );
}
