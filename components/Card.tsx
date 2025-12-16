"use client";

import { Article } from "@/@types/Article";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Send } from "lucide-react";
import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";

const Card = ({ article }: { article: Article }) => {
  const { settings } = useSettings();
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">("idle");

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

  const handleSendToN8n = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!settings.n8nWebhookUrl) {
      alert("⚠️ Veuillez configurer l'URL du webhook n8n dans les Paramètres");
      return;
    }

    setIsSending(true);
    setSendStatus("idle");

    try {
      const response = await fetch("/api/n8n/send-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          article,
          webhookUrl: settings.n8nWebhookUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send article");
      }

      setSendStatus("success");
      setTimeout(() => setSendStatus("idle"), 3000);
    } catch (error) {
      console.error("Error sending article to n8n:", error);
      setSendStatus("error");
      setTimeout(() => setSendStatus("idle"), 3000);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-sage-200 hover:border-sage-500 relative">
      {/* Send to n8n button - positioned absolutely */}
      <button
        onClick={handleSendToN8n}
        disabled={isSending}
        className={`absolute top-3 right-3 z-10 p-2 rounded-lg transition-all ${
          sendStatus === "success"
            ? "bg-green-500 text-white"
            : sendStatus === "error"
            ? "bg-red-500 text-white"
            : "bg-white/90 text-sage-700 hover:bg-sage-600 hover:text-white"
        } shadow-lg backdrop-blur-sm disabled:opacity-50`}
        title={
          sendStatus === "success"
            ? "Envoyé avec succès!"
            : sendStatus === "error"
            ? "Erreur d'envoi"
            : "Envoyer vers Notion et Discord"
        }
      >
        {isSending ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : sendStatus === "success" ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : sendStatus === "error" ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>

      <Link
        href={article.link}
        target="_blank"
        className="flex flex-col flex-1"
      >
        {/* Image Section */}
        <div className="relative w-full h-48 overflow-hidden">
        {hasImage ? (
          <img
            alt={article.title}
            src={imageUrl}
            className="object-cover transition-transform duration-300 group-hover:scale-110 aspect-square w-full h-full"
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
    </div>
  );
};

export default Card;
