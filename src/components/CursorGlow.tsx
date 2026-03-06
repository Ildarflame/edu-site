"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const handler = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.opacity = "1";
      el.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
    };

    const leave = () => {
      el.style.opacity = "0";
    };

    parent.addEventListener("mousemove", handler);
    parent.addEventListener("mouseleave", leave);
    return () => {
      parent.removeEventListener("mousemove", handler);
      parent.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute w-[400px] h-[400px] rounded-full opacity-0 transition-opacity duration-500"
      style={{
        background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)",
      }}
    />
  );
}
