import React from "react";

export default function Prose({ children }) {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-3xl mx-auto mt-8">
      {children}
    </article>
  );
}
