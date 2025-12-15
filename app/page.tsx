"use client";

import { useCallback, useEffect, useState } from "react";
import { Article } from "@/@types/Article";
import { checkIsUrl } from "@/utils/string";
import { useRssFeeds } from "@/hooks/useRssFeeds";

import Header from "@/components/Header";
import Card from "@/components/Card";

export default function Page() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedFeedInfo, setLoadedFeedInfo] = useState<string>("");
  const { addFeed, feeds } = useRssFeeds();

  const getRssData = useCallback(
    async (url: string) => {
      try {
        if (!url) return;
        setIsLoading(true);
        const res = await fetch(`/api/rss/parse?url=${url}`);
        const data = await res.json();

        if (data.items && data.items.length > 0) {
          setArticles(data.items);
          setAllArticles(data.items);
          setLoadedFeedInfo(data.feed?.title || url);
          if (data.feed?.title) {
            addFeed(url, data.feed.title);
          }
        }
      } catch (error: unknown) {
        console.log("🚀 ~ getRssData ~ error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [addFeed]
  );

  const loadSavedFeeds = useCallback(async () => {
    if (feeds.length === 0) {
      setArticles([]);
      setAllArticles([]);
      setLoadedFeedInfo("");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const feedUrls = feeds.map((feed) => feed.url);
      const res = await fetch("/api/rss/parse-multiple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: feedUrls }),
      });

      const data = await res.json();

      if (data.items && data.items.length > 0) {
        setArticles(data.items);
        setAllArticles(data.items);
        // Set feed info based on number of feeds loaded
        if (feeds.length === 1) {
          setLoadedFeedInfo(feeds[0].title || feeds[0].url);
        } else {
          setLoadedFeedInfo(`${feeds.length} flux RSS`);
        }
      } else {
        setArticles([]);
        setAllArticles([]);
        setLoadedFeedInfo("");
      }
    } catch (error) {
      console.log("🚀 ~ loadSavedFeeds ~ error:", error);
      setArticles([]);
      setAllArticles([]);
      setLoadedFeedInfo("");
    } finally {
      setIsLoading(false);
    }
  }, [feeds]);

  const checkQueryUrl = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setArticles(allArticles);
        return;
      }

      if (checkIsUrl(query)) {
        getRssData(query);
      } else {
        const filtered = allArticles.filter((article) =>
          article.title.toLowerCase().includes(query.toLowerCase())
        );
        setArticles(filtered);
      }
    },
    [getRssData, allArticles]
  );
  
  useEffect(() => {
    loadSavedFeeds();
  }, [loadSavedFeeds]);

  return (
    <div className="min-h-screen">
      <Header onSearch={checkQueryUrl} />
      <main className="max-w-7xl mx-auto px-4 pb-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-sage-900 text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border-2 border-sage-200">
              <div className="w-16 h-16 mx-auto mb-6 border-4 border-sage-300 border-t-sage-600 rounded-full animate-spin"></div>
              <h2 className="text-2xl font-bold mb-2">Chargement des articles...</h2>
              <p className="text-sage-700">
                {feeds.length > 0
                  ? `Récupération de ${feeds.length} flux RSS`
                  : "Chargement en cours"}
              </p>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-sage-900 text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border-2 border-sage-200">
              <svg
                className="w-24 h-24 mx-auto mb-6 text-sage-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <h2 className="text-2xl font-bold mb-2">Aucun article à afficher</h2>
              <p className="text-sage-700 mb-4">
                Recherchez un article ou entrez une URL de flux RSS
              </p>
              <button
                onClick={() => {
                  const drawer = document.querySelector('[title="Mes flux RSS"]');
                  if (drawer instanceof HTMLElement) drawer.click();
                }}
                className="mt-4 px-6 py-3 bg-sage-600 text-white rounded-lg font-semibold hover:bg-sage-700 transition-all shadow-md hover:shadow-lg"
              >
                Gérer mes flux RSS
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sage-900 text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md border border-sage-200">
              <p className="text-sm font-medium">
                {articles.length} article{articles.length > 1 ? "s" : ""} chargé
                {articles.length > 1 ? "s" : ""}
                {loadedFeedInfo && ` depuis ${loadedFeedInfo}`}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {articles.map((article) => (
                <Card key={article.guid} article={article} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
