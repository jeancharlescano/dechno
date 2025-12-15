"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Bookmark } from "lucide-react";
import RssFeedsDrawer from "./RssFeedsDrawer";

const Header = React.memo(
  ({ onSearch }: { onSearch: (query: string) => void }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleSelectFeed = (url: string) => {
      onSearch(url);
    };

    return (
      <>
        <header className="bg-white/95 backdrop-blur-sm shadow-lg mb-8 sticky top-0 z-40 border-b-2 border-sage-300">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Logo Section */}
              <div className="flex items-center gap-3">
                <Image
                  src="/dechno.png"
                  alt="Dechno logo"
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold text-sage-900">Dechno</h1>
                  <p className="text-xs text-sage-600">Agrégateur RSS</p>
                </div>
              </div>

              {/* Search Section */}
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <input
                    id="search"
                    type="text"
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-sage-300 focus:border-sage-600 focus:outline-none transition-colors text-sage-900 placeholder-sage-500 bg-sage-50"
                    placeholder="Rechercher un article ou entrer une URL de flux RSS..."
                  />
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Drawer Button */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center gap-2 px-4 py-3 bg-sage-600 text-white rounded-xl hover:bg-sage-700 transition-all shadow-md hover:shadow-lg"
                title="Mes flux RSS"
              >
                <Bookmark className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Mes flux</span>
              </button>
            </div>
          </div>
        </header>

        <RssFeedsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSelectFeed={handleSelectFeed}
        />
      </>
    );
  }
);

Header.displayName = "Header";

export default Header;
