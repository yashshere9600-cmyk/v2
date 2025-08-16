import React from "react";
import SiteSEO from "../components/SEO.jsx";

export default function NotFound() {
  return (
    <div className="container py-16">
      <SiteSEO title="404 — NewsDailly" path="/404" description="Page not found." />
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-2 text-slate-500">The page you’re looking for doesn’t exist.</p>
    </div>
  );
}
