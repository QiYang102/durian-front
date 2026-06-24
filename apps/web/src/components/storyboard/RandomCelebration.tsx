import { useMemo } from "react";
import CelebrationMessage from "./CelebrationMessage";
import SuccessCelebration from "./SuccessCelebration";

export default function RandomCelebration({
  variant,
}: {
  variant?: "empty" | "banner";
}) {
  // Decide ONE TIME which celebration to show
  const celebrationType = useMemo(() => {
    const list = ["simple", "fireworks"];
    return list[Math.floor(Math.random() * list.length)];
  }, []);

  if (celebrationType === "fireworks") {
    return <SuccessCelebration />;
  }

  return <CelebrationMessage variant={variant} />;
}
