import type { ComponentProps } from "react";
import SharedReveal from "../../../shared/Reveal";

type ThemeRevealProps = Omit<ComponentProps<typeof SharedReveal>, "once">;

export default function ThemeReveal(props: ThemeRevealProps) {
  return <SharedReveal {...props} once />;
}
