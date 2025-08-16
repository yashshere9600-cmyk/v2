// FILE: src/components/QuickActions.jsx
import React from "react";

const Icon = {
  Share: () => (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5 15.4 17.5" />
      <path d="M15.4 6.5 8.6 10.5" />
    </svg>
  ),
  Copy: () => (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Save: () => (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </svg>
  ),
  Print: () => (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 9V2h12v7" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v8H6z" />
    </svg>
  ),
};

export default function QuickActions() {
  const copy = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
    } catch {}
  };
  const share = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = "TON Ecosystem Sees Surge in Payments Apps; Fees Stay Low";
    const href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
    window.open(href, "_blank");
  };
  const save = () => {}; // hook up to your store later
  const print = () => window.print();

  return (
    <aside className="sticky top-28 space-y-3 hidden lg:block">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <div className="text-xs font-semibold text-slate-400 mb-2">
          Quick actions
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={share}
            className="px-2.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 inline-flex items-center gap-2 text-sm"
          >
            <Icon.Share /> Share
          </button>
          <button
            onClick={copy}
            className="px-2.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 inline-flex items-center gap-2 text-sm"
          >
            <Icon.Copy /> Copy
          </button>
          <button
            onClick={save}
            className="px-2.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 inline-flex items-center gap-2 text-sm"
          >
            <Icon.Save /> Save
          </button>
          <button
            onClick={print}
            className="px-2.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 inline-flex items-center gap-2 text-sm"
          >
            <Icon.Print /> Print
          </button>
        </div>
      </div>
     
    </aside>
  );
}
