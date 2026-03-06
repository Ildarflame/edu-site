"use client";

import { useState, useEffect } from "react";

const words = ["builders.", "students.", "startups.", "devs.", "creators."];

export default function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setIsExiting(false);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block relative overflow-hidden align-bottom">
      <span
        className={`inline-block text-gradient-warm transition-all duration-300 ease-out ${
          isExiting
            ? "translate-y-[110%] opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        {words[index]}
      </span>
    </span>
  );
}
