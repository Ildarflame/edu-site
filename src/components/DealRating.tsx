"use client";

import { useState, useEffect, useCallback } from "react";

interface RatingData {
  helpful: number;
  notHelpful: number;
  stars: number[];
}

function getStorageKey(slug: string) {
  return `sp-rating-${slug}`;
}

function getRatingData(slug: string): RatingData {
  if (typeof window === "undefined") return { helpful: 0, notHelpful: 0, stars: [0, 0, 0, 0, 0] };
  const raw = localStorage.getItem(`sp-ratings-data-${slug}`);
  if (raw) {
    try { return JSON.parse(raw); } catch { /* ignore */ }
  }
  return { helpful: 0, notHelpful: 0, stars: [0, 0, 0, 0, 0] };
}

function saveRatingData(slug: string, data: RatingData) {
  localStorage.setItem(`sp-ratings-data-${slug}`, JSON.stringify(data));
}

function getUserVote(slug: string): { helpful?: boolean; star?: number } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(getStorageKey(slug));
  if (raw) {
    try { return JSON.parse(raw); } catch { /* ignore */ }
  }
  return null;
}

function saveUserVote(slug: string, vote: { helpful?: boolean; star?: number }) {
  localStorage.setItem(getStorageKey(slug), JSON.stringify(vote));
}

export default function DealRating({ slug }: { slug: string }) {
  const [data, setData] = useState<RatingData>({ helpful: 0, notHelpful: 0, stars: [0, 0, 0, 0, 0] });
  const [userVote, setUserVote] = useState<{ helpful?: boolean; star?: number } | null>(null);
  const [hoverStar, setHoverStar] = useState(0);

  useEffect(() => {
    setData(getRatingData(slug));
    setUserVote(getUserVote(slug));
  }, [slug]);

  const totalVotes = data.helpful + data.notHelpful;
  const helpfulPercent = totalVotes > 0 ? Math.round((data.helpful / totalVotes) * 100) : 0;

  const totalStars = data.stars.reduce((a, b) => a + b, 0);
  const avgStars = totalStars > 0
    ? data.stars.reduce((sum, count, i) => sum + count * (i + 1), 0) / totalStars
    : 0;

  const handleHelpful = useCallback((isHelpful: boolean) => {
    if (userVote?.helpful !== undefined) return;
    setData(prev => {
      const newData = { ...prev };
      if (isHelpful) newData.helpful++;
      else newData.notHelpful++;
      saveRatingData(slug, newData);
      return newData;
    });
    const vote = { ...userVote, helpful: isHelpful };
    setUserVote(vote);
    saveUserVote(slug, vote);
  }, [slug, userVote]);

  const handleStar = useCallback((star: number) => {
    if (userVote?.star !== undefined) return;
    setData(prev => {
      const newData = { ...prev, stars: [...prev.stars] };
      newData.stars[star - 1]++;
      saveRatingData(slug, newData);
      return newData;
    });
    const vote = { ...userVote, star };
    setUserVote(vote);
    saveUserVote(slug, vote);
  }, [slug, userVote]);

  return (
    <div className="card p-5 space-y-4">
      <h3 className="text-[13px] font-semibold text-zinc-300">Rate this deal</h3>

      {/* Stars */}
      <div className="flex items-center gap-3">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => {
            const filled = userVote?.star ? star <= userVote.star : star <= hoverStar;
            return (
              <button
                key={star}
                type="button"
                disabled={userVote?.star !== undefined}
                onClick={() => handleStar(star)}
                onMouseEnter={() => setHoverStar(star)}
                onMouseLeave={() => setHoverStar(0)}
                className={`p-0.5 transition-colors ${userVote?.star !== undefined ? "cursor-default" : "cursor-pointer"}`}
                aria-label={`${star} stars`}
              >
                <svg
                  className={`w-5 h-5 ${filled ? "text-orange-400" : "text-zinc-700"} transition-colors`}
                  fill={filled ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </button>
            );
          })}
        </div>
        {totalStars > 0 && (
          <span className="text-[12px] text-zinc-500">
            {avgStars.toFixed(1)} avg ({totalStars} {totalStars === 1 ? "rating" : "ratings"})
          </span>
        )}
      </div>

      {/* Helpful */}
      <div>
        <p className="text-[12px] text-zinc-500 mb-2">Was this deal helpful?</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleHelpful(true)}
            disabled={userVote?.helpful !== undefined}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors border ${
              userVote?.helpful === true
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                : userVote?.helpful !== undefined
                  ? "bg-white/[0.02] text-zinc-600 border-white/[0.04] cursor-default"
                  : "bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:text-emerald-400 hover:border-emerald-500/20"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => handleHelpful(false)}
            disabled={userVote?.helpful !== undefined}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors border ${
              userVote?.helpful === false
                ? "bg-red-500/15 text-red-400 border-red-500/20"
                : userVote?.helpful !== undefined
                  ? "bg-white/[0.02] text-zinc-600 border-white/[0.04] cursor-default"
                  : "bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:text-red-400 hover:border-red-500/20"
            }`}
          >
            No
          </button>
          {totalVotes > 0 && (
            <span className="text-[11px] text-zinc-600 ml-1">
              {helpfulPercent}% found this helpful ({totalVotes} {totalVotes === 1 ? "vote" : "votes"})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
