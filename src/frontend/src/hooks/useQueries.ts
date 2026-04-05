import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Article } from "../backend.d";
import { createActorWithConfig } from "../config";
import { useActor } from "./useActor";

// ─── Local types (do not import from backend.d.ts) ────────────────────────────────────────────
export type RSSItem = {
  id: bigint;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
  fetchedAt: bigint;
};

export type FeedSource = {
  url: string;
  name: string;
  category: string;
  enabled: boolean;
};

export type Reporter = {
  name: string;
  email: string;
  role: string;
  phone: string;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  contactEmail: string;
  footerText: string;
  editorName: string;
  editorEmail: string;
  editorPhone: string;
  address: string;
  reporters: Reporter[];
};

// ─── Existing hooks ────────────────────────────────────────────────────────────────

export function usePublishedArticles() {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["publishedArticles"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getPublishedArticles();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useSliderArticles() {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["sliderArticles"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getSliderArticles();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useBreakingNewsText() {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["breakingNewsText"],
    queryFn: async () => {
      if (!actor) return "";
      return (actor as any).getBreakingNewsText();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useAllArticles() {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["allArticles"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useArticlesByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["articlesByCategory", category],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getArticlesByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
    staleTime: 30_000,
  });
}

export function useArticleById(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Article | null>({
    queryKey: ["articleById", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      const result = await (actor as any).getArticleById(id);
      if (Array.isArray(result)) return result[0] ?? null;
      return result ?? null;
    },
    enabled: !!actor && !isFetching && id !== null,
    staleTime: 30_000,
  });
}

export function useCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

const LOGO_URL_KEY = "baligaw_logoUrl";
const DEFAULT_LOGO_URL =
  "https://drive.google.com/uc?export=view&id=1CtBBizUoMOQKmRvv3s4P38-3ZdhZoysL";

export function useLogoUrl() {
  return useQuery<string>({
    queryKey: ["logoUrl"],
    queryFn: async () => {
      return localStorage.getItem(LOGO_URL_KEY) || DEFAULT_LOGO_URL;
    },
    staleTime: 0,
  });
}

export function useSetLogoUrl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (url: string) => {
      if (url.trim()) {
        localStorage.setItem(LOGO_URL_KEY, url.trim());
      } else {
        localStorage.removeItem(LOGO_URL_KEY);
      }
      return url;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logoUrl"] });
    },
  });
}

export function useAddArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (article: {
      title: string;
      content: string;
      category: string;
      imageUrl: string;
      author: string;
      excerpt: string;
      date: string;
      isBreaking: boolean;
      isSlider: boolean;
      isPublished: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).addArticle(
        article.title,
        article.content,
        article.category,
        article.imageUrl,
        article.author,
        article.excerpt,
        article.date,
        article.isBreaking,
        article.isSlider,
        article.isPublished,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allArticles"] });
      queryClient.invalidateQueries({ queryKey: ["publishedArticles"] });
      queryClient.invalidateQueries({ queryKey: ["sliderArticles"] });
    },
  });
}

export function useUpdateArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (article: {
      id: bigint;
      title: string;
      content: string;
      category: string;
      imageUrl: string;
      author: string;
      excerpt: string;
      date: string;
      isBreaking: boolean;
      isSlider: boolean;
      isPublished: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).updateArticle(
        article.id,
        article.title,
        article.content,
        article.category,
        article.imageUrl,
        article.author,
        article.excerpt,
        article.date,
        article.isBreaking,
        article.isSlider,
        article.isPublished,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allArticles"] });
      queryClient.invalidateQueries({ queryKey: ["publishedArticles"] });
      queryClient.invalidateQueries({ queryKey: ["sliderArticles"] });
    },
  });
}

export function useDeleteArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).deleteArticle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allArticles"] });
      queryClient.invalidateQueries({ queryKey: ["publishedArticles"] });
      queryClient.invalidateQueries({ queryKey: ["sliderArticles"] });
    },
  });
}

export function useAddCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category: string) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).addCategory(category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useRemoveCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category: string) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).removeCategory(category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useSetBreakingNewsText() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).setBreakingNewsText(text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["breakingNewsText"] });
    },
  });
}

// ─── RSS / Settings hooks ─────────────────────────────────────────────────────

export function useRSSItems() {
  const { actor, isFetching } = useActor();
  return useQuery<RSSItem[]>({
    queryKey: ["rssItems"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getRSSItems();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useRSSItemsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<RSSItem[]>({
    queryKey: ["rssItemsByCategory", category],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getRSSItemsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
    staleTime: 60_000,
  });
}

export function useLastFetchTime() {
  const { actor, isFetching } = useActor();
  return useQuery<number>({
    queryKey: ["lastFetchTime"],
    queryFn: async () => {
      if (!actor) return 0;
      const val = await (actor as any).getLastFetchTime();
      return Number(val);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFeedSources() {
  const { actor, isFetching } = useActor();
  return useQuery<FeedSource[]>({
    queryKey: ["feedSources"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getFeedSources();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRefreshFeeds() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const count = await (actor as any).refreshAllFeeds();
      return Number(count);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rssItems"] });
      queryClient.invalidateQueries({ queryKey: ["rssItemsByCategory"] });
      queryClient.invalidateQueries({ queryKey: ["lastFetchTime"] });
    },
  });
}

export function useToggleFeedSource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ url, enabled }: { url: string; enabled: boolean }) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).toggleFeedSource(url, enabled);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedSources"] });
    },
  });
}

export function useSiteSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<SiteSettings>({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      if (!actor)
        return {
          siteName: "",
          tagline: "",
          contactEmail: "",
          footerText: "",
          editorName: "",
          editorEmail: "",
          editorPhone: "",
          address: "",
          reporters: [],
        };
      return (actor as any).getSiteSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSiteSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: SiteSettings) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).updateSiteSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
    },
  });
}

// ─── Email+Password Admin Auth hooks ───────────────────────────────────────────────────
// Session token is stored in localStorage key: "adminSessionToken"

/**
 * Attempt admin login with email+password.
 * On success, saves token to localStorage AND writes to window.__adminToken
 * so useAdminSessionValid can reactively pick it up.
 */
export function useAdminLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: { email: string; password: string }) => {
      // Always create a fresh anonymous actor to avoid any stale state
      const freshActor = await createActorWithConfig();
      const result = await (freshActor as any).adminLoginWithPassword(
        email,
        password,
      );
      if ("ok" in result) {
        const token = result.ok as string;
        localStorage.setItem("adminSessionToken", token);
        return token;
      }
      throw new Error(result.err as string);
    },
    onSuccess: (_token) => {
      // Invalidate ALL queries so the session check re-runs with the new token
      queryClient.invalidateQueries();
    },
  });
}

/**
 * Check if the current admin session token is valid.
 * Uses useState + useEffect so it re-reads localStorage reactively
 * after login writes the token.
 */
export function useAdminSessionValid() {
  const [token, setToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("adminSessionToken") ?? "";
  });

  // Re-read the token from localStorage when storage events fire
  // (covers cross-tab) and also poll briefly after mount so that
  // a login in the same tab is detected even without a storage event.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "adminSessionToken") {
        setToken(e.newValue ?? "");
      }
    };
    window.addEventListener("storage", onStorage);

    // Also poll localStorage a few times after mount so same-tab login is reflected
    const interval = setInterval(() => {
      const current = localStorage.getItem("adminSessionToken") ?? "";
      setToken((prev) => (prev !== current ? current : prev));
    }, 300);
    // Stop polling after 5 seconds — login should have completed by then
    const timeout = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["adminSessionValid", token],
    queryFn: async () => {
      if (!actor || !token) return false;
      return (actor as any).isAdminSessionValid(token);
    },
    enabled: !!actor && !isFetching && !!token,
    staleTime: 30_000,
  });
}

export function useAdminSessionLogout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("adminSessionToken") ?? "";
      if (actor && token) {
        await (actor as any).adminSessionLogout(token);
      }
      localStorage.removeItem("adminSessionToken");
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useChangeAdminPassword() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const token = localStorage.getItem("adminSessionToken") ?? "";
      if (!token) throw new Error("সেশন পাওয়া যায়নি");
      const result = await (actor as any).changeAdminPassword(
        token,
        oldPassword,
        newPassword,
      );
      if ("ok" in result) return;
      throw new Error((result as any).err);
    },
  });
}
