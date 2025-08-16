import SiteSEO from "../components/SEO.jsx";
import ArticleList from "../components/ArticleList.jsx";
import BentoGrid from "../components/BentoGrid.jsx";
import MarketChips from "../components/MarketChips.jsx";

export default function Home() {
  return (
    <div className="container py-8">
      <SiteSEO
        title="NewsDailly — Crypto News"
        description="Fresh crypto news with a focus on Fresh Hitters, Airdrop Alerts, Scam Alerts, and Callout Projects."
        path="/"
      />
      <div className="rounded-2xl mb-16  p-3">
        <MarketChips />
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <BentoGrid />
        {/* ...rest of your sections */}
      </main>

      <ArticleList />
    </div>
  );
}
