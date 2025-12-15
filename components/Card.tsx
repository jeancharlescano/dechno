import { Article } from "@/@types/Article";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User } from "lucide-react";

const Card = ({ article }: { article: Article }) => {
  const imageUrl = article.attachements?.articleImg || article.enclosure?.link;
  const hasImage = imageUrl && imageUrl.trim() !== "";

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date inconnue";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Link
      href={article.link}
      target="_blank"
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-sage-200 hover:border-sage-500"
    >
      {/* Image Section */}
      <div className="relative w-full h-48 overflow-hidden">
        {hasImage ? (
          <img
            alt={article.title}
            src={imageUrl}
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-sage-600 via-sage-500 to-sage-700 flex items-center justify-center">
            <span className="text-6xl text-white/80">📰</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5 bg-sage-50">
        {/* Title */}
        <h2 className="text-xl font-bold text-sage-900 mb-3 line-clamp-2 leading-snug group-hover:text-sage-600 transition-colors">
          {article.title}
        </h2>

        {/* Description */}
        {article.content?.summary && (
          <p className="text-sage-700 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
            {article.content.summary}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between pt-4 border-t border-sage-200 text-sm text-sage-600">
          {/* Author */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="truncate max-w-37.5">{article.author}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(article.pubDate)}</span>
          </div>
        </div>

        {/* Read More Button */}
        <div className="mt-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-sage-600 text-white text-sm font-semibold rounded-lg group-hover:bg-sage-700 transition-all">
            Lire l&apos;article
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Card;
