import React, { useSyncExternalStore } from "react";

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

async function loadDefaultFeeds(): Promise<RssFeed[]> {
  try {
    const response = await fetch('/default-feeds.json');
    if (!response.ok) {
      console.error("Failed to load default feeds");
      return [];
    }
    const defaultFeeds: RssFeed[] = await response.json();
    return defaultFeeds;
  } catch (error) {
    console.error("Error loading default feeds:", error);
    return [];
  }
}

function loadFeeds(): RssFeed[] {
  if (typeof window === "undefined") return [];
  try {
    const storedFeeds = localStorage.getItem(STORAGE_KEY);
    return storedFeeds ? JSON.parse(storedFeeds) : [];
  } catch (error) {
    console.error("Error loading feeds from localStorage:", error);
    return [];
  }
}

async function initializeDefaultFeeds(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const isInitialized = localStorage.getItem(DEFAULT_FEEDS_INITIALIZED_KEY);
    const storedFeeds = localStorage.getItem(STORAGE_KEY);

    if (!isInitialized && !storedFeeds) {
      const defaultFeeds = await loadDefaultFeeds();
      if (defaultFeeds.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultFeeds));
        localStorage.setItem(DEFAULT_FEEDS_INITIALIZED_KEY, "true");
        cachedFeeds = defaultFeeds;
        emitChange();
      }
    }
  } catch (error) {
    console.error("Error initializing default feeds:", error);
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

  React.useEffect(() => {
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
