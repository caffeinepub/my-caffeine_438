import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Article } from "../backend.d";
import { useActor } from "./useActor";

// ─── Local types (do not import from backend.d.ts) ────────────────────────────
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

export type SiteSettings = {
  siteName: string;
  tagline: string;
  contactEmail: string;
  footerText: string;
};

// ─── Existing hooks ───────────────────────────────────────────────────────────

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
      // Motoko returns ?Article as [] | [Article]
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

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return (actor as any).isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogoUrl() {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["logoUrl"],
    queryFn: async () => {
      if (!actor) return "";
      return (actor as any).getLogoUrl();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useSetLogoUrl() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (url: string) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).setLogoUrl(url);
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

// ─── New RSS / Settings hooks ─────────────────────────────────────────────────

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
        return { siteName: "", tagline: "", contactEmail: "", footerText: "" };
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
