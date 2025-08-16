// FILE: src/App.jsx
import React, { Suspense, lazy } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import SiteSEO from "./components/SEO.jsx";
import { Routes, Route } from "react-router-dom";
import Navbar2 from "./components/Navbar2.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const ArticlePage = lazy(() => import("./pages/ArticlePage.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const ScamAlerts = lazy(() => import("./pages/ScamAlerts.jsx")); // ← NEW
// FILE: src/App.jsx (add these imports)
const FreshHitters = lazy(() => import("./pages/FreshHitters.jsx"));
const AirdropAlerts = lazy(() => import("./pages/AirdropAlerts.jsx"));
const CalloutProjects = lazy(() => import("./pages/CalloutProjects.jsx"));

// FILE: src/App.jsx (inside <Routes>)

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <SiteSEO />
      <div className="flex">
        <Navbar />
      </div>
      <div className="flex-1 ml-20 min-h-screen">
        <main className="container px-4 py-6">
          <Suspense
            fallback={
              <div className="container py-10 animate-pulse text-sm text-slate-500">
                Loading…
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/article/:slug" element={<ArticlePage />} />
              <Route path="/scam-alerts" element={<ScamAlerts />} />
              <Route path="/fresh-hitters" element={<FreshHitters />} />
              <Route path="/airdrop-alerts" element={<AirdropAlerts />} />
              <Route path="/callout-projects" element={<CalloutProjects />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>

      <Footer />
    </div>
  );
}
