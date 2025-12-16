import { useSyncExternalStore, useEffect } from "react";

export interface RssFeed {
  id: string;
  url: string;
  title: string;
  addedAt: string;
}

const STORAGE_KEY = "dechno_rss_feeds";
const DEFAULT_FEEDS_INITIALIZED_KEY = "dechno_default_feeds_initialized";

let listeners: Array<() => void> = [];
let cachedFeeds: RssFeed[] | null = null;

const emptyFeeds: RssFeed[] = [];

// Variable to track if we're currently loading default feeds
let isLoadingDefaultFeeds = false;

function getSnapshot(): RssFeed[] {
  if (cachedFeeds === null) {
    cachedFeeds = loadFeeds();
  }
  return cachedFeeds;
}

function getServerSnapshot(): RssFeed[] {
  return emptyFeeds;
}

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function emitChange() {
  cachedFeeds = null;
  for (const listener of listeners) {
    listener();
  }
}

async function loadDefaultFeedsFromJson(): Promise<RssFeed[]> {
  try {
    console.log("[loadDefaultFeedsFromJson] Fetching default feeds from JSON...");
    const response = await fetch('/default-feeds.json');
    if (!response.ok) {
      console.error("[loadDefaultFeedsFromJson] Failed to fetch default feeds");
      return [];
    }
    const feeds: RssFeed[] = await response.json();
    console.log("[loadDefaultFeedsFromJson] Loaded", feeds.length, "default feeds from JSON");
    return feeds;
  } catch (error) {
    console.error("[loadDefaultFeedsFromJson] Error loading default feeds:", error);
    return [];
  }
}

async function initializeDefaultFeeds(): Promise<void> {
  if (typeof window === "undefined") return;
  if (isLoadingDefaultFeeds) {
    console.log("[initializeDefaultFeeds] Already loading, skipping...");
    return;
  }

  try {
    const storedFeeds = localStorage.getItem(STORAGE_KEY);
    const isInitialized = localStorage.getItem(DEFAULT_FEEDS_INITIALIZED_KEY);

    // Only initialize if we have no feeds and haven't initialized yet
    if ((!storedFeeds || JSON.parse(storedFeeds).length === 0) && !isInitialized) {
      isLoadingDefaultFeeds = true;
      console.log("[initializeDefaultFeeds] Loading default feeds...");

      const defaultFeeds = await loadDefaultFeedsFromJson();

      if (defaultFeeds.length > 0) {
        console.log("[initializeDefaultFeeds] Saving", defaultFeeds.length, "default feeds to localStorage");
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultFeeds));
        localStorage.setItem(DEFAULT_FEEDS_INITIALIZED_KEY, "true");
        cachedFeeds = defaultFeeds;
        emitChange();
      }

      isLoadingDefaultFeeds = false;
    }
  } catch (error) {
    console.error("[initializeDefaultFeeds] Error:", error);
    isLoadingDefaultFeeds = false;
  }
}

function loadFeeds(): RssFeed[] {
  if (typeof window === "undefined") {
    console.log("[loadFeeds] Running on server, returning empty array");
    return [];
  }

  try {
    const storedFeeds = localStorage.getItem(STORAGE_KEY);
    console.log("[loadFeeds] storedFeeds from localStorage:", storedFeeds);

    if (storedFeeds) {
      const parsed = JSON.parse(storedFeeds);
      console.log("[loadFeeds] Parsed feeds:", parsed.length, "feeds");

      // If we have stored feeds and they're not empty, return them
      if (parsed.length > 0) {
        console.log("[loadFeeds] Returning stored feeds:", parsed.length, "feeds");
        return parsed;
      }
    }

    console.log("[loadFeeds] No feeds found, returning empty array");
    return [];
  } catch (error) {
    console.error("Error loading feeds from localStorage:", error);
    return [];
  }
}

function saveFeeds(feeds: RssFeed[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feeds));
    cachedFeeds = feeds;
    emitChange();
  } catch (error) {
    console.error("Error saving feeds to localStorage:", error);
  }
}

export function useRssFeeds() {
  const feeds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Initialize default feeds from JSON on first load
  useEffect(() => {
    initializeDefaultFeeds();
  }, []);

  const addFeed = (url: string, title?: string) => {
    const newFeed: RssFeed = {
      id: Date.now().toString(),
      url,
      title: title || url,
      addedAt: new Date().toISOString(),
    };

    const currentFeeds = getSnapshot();
    if (currentFeeds.some((feed) => feed.url === url)) {
      return newFeed;
    }

    const updatedFeeds = [...currentFeeds, newFeed];
    saveFeeds(updatedFeeds);
    return newFeed;
  };

  const removeFeed = (id: string) => {
    const currentFeeds = getSnapshot();
    const updatedFeeds = currentFeeds.filter((feed) => feed.id !== id);
    saveFeeds(updatedFeeds);
  };

  const updateFeedTitle = (id: string, title: string) => {
    const currentFeeds = getSnapshot();
    const updatedFeeds = currentFeeds.map((feed) =>
      feed.id === id ? { ...feed, title } : feed
    );
    saveFeeds(updatedFeeds);
  };

  const clearAllFeeds = () => {
    saveFeeds([]);
  };

  return {
    feeds,
    addFeed,
    removeFeed,
    updateFeedTitle,
    clearAllFeeds,
  };
}
