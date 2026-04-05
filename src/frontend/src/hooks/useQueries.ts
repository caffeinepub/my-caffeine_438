import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Article } from "../backend.d";
import { useActor } from "./useActor";

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
