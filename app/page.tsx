"use client";

import { useEffect, useState } from "react";
import { Article } from "@/@types/Article";
import { checkIsUrl } from "@/utils/string";

import articlesData from "@/mock/articles.json";

import Header from "@/components/Header";
import Card from "@/components/Card";

export default function page() {
  const [articles, setArticles] = useState<Article[]>([]);

  const checkqueryUrl = (query: string) => {
    try {
      if (checkIsUrl(query)) {
        getRssData(query);
      } else {
        searchArticles(query);
      }
    } catch (error) {
      console.log("🚀 ~ checkqueryUrl ~ error:", error);
    }
  };
  const searchArticles = (query: string) => {
    const filteredArticles = articlesData.filter((articles) => {
      return articles.title.toLowerCase().includes(query.toLowerCase());
    });
    setArticles(filteredArticles);
  };

  const getRssData = async (url: string) => {
    try {
      if (!url) return [];
      const res = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${url}`
      );
      const data = await res.json();
      console.log("🚀 ~ getRssData ~ data:", data);
      setArticles(data.items);
    } catch (error) {
      console.log("🚀 ~ getRssData ~ error:", error)
    }
  };

  useEffect(() => {
    setArticles(articlesData);
  }, []);

  return (
    <>
      <Header onSearch={checkqueryUrl} />
      <main className="h-auto p-8 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-16 w-full">
        {articles.map((article) => (
          <Card key={article.guid} article={article} />
        ))}
      </main>
    </>
  );
}
