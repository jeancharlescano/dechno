"use client";

import { useCallback, useEffect, useState } from "react";
import { Article } from "@/@types/Article";
import { checkIsUrl } from "@/utils/string";

import articlesData from "@/mock/articles.json";

import Header from "@/components/Header";
import Card from "@/components/Card";

export default function Page() {
  const [articles, setArticles] = useState<Article[]>([]);

  const searchArticles = useCallback((query: string) => {
    try {
      const filteredArticles = articlesData.filter((articles) => {
        return articles.title.toLowerCase().includes(query.toLowerCase());
      });
      setArticles(filteredArticles);
    } catch (error: any) {
      console.log("🚀 ~ searchArticles ~ error:", error);
    }
  }, []);

  const getRssData = useCallback(async (url: string) => {
    try {
      if (!url) return [];
      const res = await fetch(`/api/rss?url=${url}`);
      const data = await res.json();
      setArticles(data.items);
    } catch (error: any) {
      console.log("🚀 ~ getRssData ~ error:", error);
    }
  }, []);

  const checkQueryUrl = useCallback(
    (query: string) => {
      if (checkIsUrl(query)) {
        getRssData(query);
      } else {
        searchArticles(query);
      }
    },
    [getRssData, searchArticles]
  );

  useEffect(() => {
    const getArticles = async () => {
      const res = await fetch("/api/article");
      const data = await res.json();
      setArticles(data);
    };
    getArticles();
  }, []);

  return (
    <>
      <Header onSearch={checkQueryUrl} />
      <main className="h-auto p-8  w-full grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-16">
        {articles.map((article) => (
          <Card key={article.guid} article={article} />
        ))}
      </main>
    </>
  );
}
