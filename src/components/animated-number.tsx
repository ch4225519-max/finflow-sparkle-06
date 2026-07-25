import { useEffect, useState } from "react";
import { animate } from "framer-motion";

export function useAnimatedNumber(target: number, duration = 1.2) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [target, duration]);
  return value;
}

export function AnimatedNumber({
  value,
  format = (v) => v.toFixed(0),
  className,
}: {
  value: number;
  format?: (v: number) => string;
  className?: string;
}) {
  const v = useAnimatedNumber(value);
  return <span className={className}>{format(v)}</span>;
}
