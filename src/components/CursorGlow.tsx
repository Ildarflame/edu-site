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
      el.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
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
      className="pointer-events-none absolute w-[600px] h-[600px] rounded-full opacity-0 transition-opacity duration-500"
      style={{
        background: "radial-gradient(circle, rgba(249,115,22,0.2) 0%, rgba(249,115,22,0.08) 40%, transparent 70%)",
      }}
    />
  );
}
