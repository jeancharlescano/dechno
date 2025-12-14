import { Article } from "@/@types/Article";
import { NextResponse } from "next/server";
import articlesData from "@/mock/articles.json";

export const GET = async (request: Request) => {
  try {
    // TODO : Appel bdd pour récupérer les articles
    const articles: Article[] = articlesData;
    return NextResponse.json(articles);
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error);
    return NextResponse.json({
      error: "Failed to fetch articles",
    });
  }
};
