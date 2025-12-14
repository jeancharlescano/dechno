import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const rssUrl = searchParams.get("url");

  if (!rssUrl) {
    return NextResponse.json({
      error: "Missing 'url' pquery param",
      status: 400,
    });
  }

  try {
    const result = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`
    );
    if (!result.ok) {
      return NextResponse.json({
        error: "Failed to fetch RSS",
        status: result.status,
      });
    }
    const data = await result.json();
    return NextResponse.json(data);

  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error);
    return NextResponse.json({
      error: "Failed to fetch RSS feed",
      status: 500,
    });
  }
};
