"use client";
import { useScroll, useVelocity, useSpring } from "framer-motion";
import { useEffect, useRef, useMemo, useState } from "react";

interface ScrollTickerProps {
  items: React.ReactNode[];
  speedFactor?: number; // ปรับความไว ticker
}

export default function ScrollTicker({ items, speedFactor = 1 }: ScrollTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 20, stiffness: 120 });

  const animationRef = useRef<number | null>(null);
  const x = useRef(0);
  const totalWidth = useRef(0);
  const dir = useRef(1);
  const [repeatCount, setRepeatCount] = useState(3);

  // ✅ คำนวณจำนวนซ้ำให้พอดีกับขนาดจอ
  useEffect(() => {
    const calcRepeat = () => {
      if (!containerRef.current || !contentRef.current) return;
      const visible = containerRef.current.offsetWidth;
      const singleSet = contentRef.current.scrollWidth / repeatCount;
      const needed = Math.ceil(visible / singleSet) + 2; // +2 เพื่อกันช่องว่าง
      setRepeatCount(needed);
    };
    calcRepeat();
    window.addEventListener("resize", calcRepeat);
    return () => window.removeEventListener("resize", calcRepeat);
  }, []);

  // ✅ render item ซ้ำตาม repeatCount
  const repeatedItems = useMemo(
    () => Array(repeatCount).fill(items).flat(),
    [items, repeatCount]
  );

  useEffect(() => {
    const el = contentRef.current;
    if (!el || !containerRef.current) return;

    totalWidth.current = el.scrollWidth / repeatCount;
    let last = performance.now();

    const animate = (t: number) => {
      const delta = t - last;
      last = t;

      const v = smoothVelocity.get();
      const abs = Math.abs(v);

      // หยุดนิ่งถ้าไม่ scroll จริง
      if (abs < 25 || totalWidth.current === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // scroll ลง = ซ้าย / scroll ขึ้น = ขวา
      dir.current = v > 0 ? -1 : 1;

      // จำกัดความเร็วสูงสุดไม่ให้กระโดดข้าม frame
      const moveRaw = dir.current * (abs / 1000) * speedFactor * (delta / 16);
      const move = Math.min(Math.abs(moveRaw), totalWidth.current * 0.1) * Math.sign(moveRaw);

      // ทำให้เลื่อนแบบวนลูป
      x.current = (x.current + move) % totalWidth.current;
      if (x.current < 0) x.current += totalWidth.current;

      el.style.transform = `translate3d(${-x.current}px,0,0)`;

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // ✅ cleanup
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [smoothVelocity, speedFactor, repeatCount]);

  return (
    <div ref={containerRef} className="overflow-hidden w-full py-4 select-none">
      <div
        ref={contentRef}
        className="flex whitespace-nowrap will-change-transform"
        style={{
          transform: "translate3d(0,0,0)",
          backfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
        }}
      >
        {repeatedItems.map((n, i) => (
          <div key={i} className="shrink-0">
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}
