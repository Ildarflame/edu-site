"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface VoteData {
  yes: number;
  no: number;
}

function getVoteData(slug: string): VoteData {
  if (typeof window === "undefined") return { yes: 0, no: 0 };
  const raw = localStorage.getItem(`sp-vote-data-${slug}`);
  if (raw) {
    try { return JSON.parse(raw); } catch { /* ignore */ }
  }
  return { yes: 0, no: 0 };
}

function saveVoteData(slug: string, data: VoteData) {
  localStorage.setItem(`sp-vote-data-${slug}`, JSON.stringify(data));
}

function getUserVote(slug: string): "yes" | "no" | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`sp-vote-${slug}`) as "yes" | "no" | null;
}

function saveUserVote(slug: string, vote: "yes" | "no") {
  localStorage.setItem(`sp-vote-${slug}`, vote);
}

export default function DealVoting({ slug }: { slug: string }) {
  const [data, setData] = useState<VoteData>({ yes: 0, no: 0 });
  const [userVote, setUserVote] = useState<"yes" | "no" | null>(null);
  const userVoteRef = useRef(userVote);
  userVoteRef.current = userVote;

  useEffect(() => {
    setData(getVoteData(slug));
    setUserVote(getUserVote(slug));
  }, [slug]);

  const totalVotes = data.yes + data.no;
  const yesPercent = totalVotes > 0 ? Math.round((data.yes / totalVotes) * 100) : 0;

  const handleVote = useCallback((vote: "yes" | "no") => {
    if (userVoteRef.current) return;
    setData(prev => {
      const newData = { ...prev };
      if (vote === "yes") newData.yes++;
      else newData.no++;
      saveVoteData(slug, newData);
      return newData;
    });
    setUserVote(vote);
    saveUserVote(slug, vote);
  }, [slug]);

  return (
    <div className="card p-5">
      <p className="text-[12px] text-zinc-500 mb-2">Is this deal still working?</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleVote("yes")}
          disabled={userVote !== null}
          className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors border ${
            userVote === "yes"
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
              : userVote !== null
                ? "bg-white/[0.02] text-zinc-600 border-white/[0.04] cursor-default"
                : "bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:text-emerald-400 hover:border-emerald-500/20"
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => handleVote("no")}
          disabled={userVote !== null}
          className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors border ${
            userVote === "no"
              ? "bg-red-500/15 text-red-400 border-red-500/20"
              : userVote !== null
                ? "bg-white/[0.02] text-zinc-600 border-white/[0.04] cursor-default"
                : "bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:text-red-400 hover:border-red-500/20"
          }`}
        >
          No
        </button>
        {totalVotes > 0 && (
          <span className="text-[11px] text-zinc-600 ml-1">
            {yesPercent}% say yes ({totalVotes} {totalVotes === 1 ? "vote" : "votes"})
          </span>
        )}
      </div>
    </div>
  );
}
