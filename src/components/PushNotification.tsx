"use client";

import { useState, useSyncExternalStore } from "react";

function getSupported() {
  return "Notification" in window && "serviceWorker" in navigator;
}

function getPermission() {
  if (!("Notification" in window)) return "denied" as NotificationPermission;
  return Notification.permission;
}

const noop = () => () => {};

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export default function PushNotification() {
  const supported = useSyncExternalStore(noop, getSupported, () => false);
  const permission = useSyncExternalStore(noop, getPermission, () => "denied" as NotificationPermission);
  const [subscribed, setSubscribed] = useState(false);

  if (!VAPID_PUBLIC_KEY) return null;
  if (!supported || permission === "denied" || subscribed) return null;

  const handleSubscribe = async () => {
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") return;

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY,
      });

      fetch("/api/push-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      }).catch(() => {});

      setSubscribed(true);
    } catch {
      // User declined or browser error
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-white/[0.03] text-zinc-500 border border-white/[0.06] hover:border-white/[0.12] hover:text-zinc-300 transition-all"
      title="Get notified about new deals"
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
      Get deal alerts
    </button>
  );
}
