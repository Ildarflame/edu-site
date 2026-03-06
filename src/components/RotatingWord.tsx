"use client";

import { useState, useEffect } from "react";

const words = [
  { text: "builders.", color: "#f97316" },
  { text: "students.", color: "#3b82f6" },
  { text: "startups.", color: "#a855f7" },
  { text: "devs.", color: "#10b981" },
  { text: "creators.", color: "#f43f5e" },
];

export default function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setShow(true);
      }, 350);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const word = words[index];

  return (
    <span
      className="inline-block transition-all duration-350 ease-out"
      style={{
        color: word.color,
        textShadow: `0 0 40px ${word.color}40, 0 0 80px ${word.color}20`,
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(30px)",
        filter: show ? "blur(0px)" : "blur(4px)",
      }}
    >
      {word.text}
    </span>
  );
}
