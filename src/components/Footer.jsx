import React from "react";

export default function Footer() {
  return (
    <footer className="mt-16 py-10 text-sm text-slate-500">
      <div className="container flex items-center justify-between">
        <p>© {new Date().getFullYear()} NewsDailly</p>
        <div className="flex items-center gap-4">
          <a href="https://twitter.com/" target="_blank" rel="noreferrer" className="hover:underline">
            Twitter
          </a>
          <a href="https://t.me/" target="_blank" rel="noreferrer" className="hover:underline">
            Telegram
          </a>
        </div>
      </div>
    </footer>
  );
}
