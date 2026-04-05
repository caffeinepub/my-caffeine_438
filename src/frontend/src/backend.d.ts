import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;

export type UserRole = { __kind__: "admin" } | { __kind__: "user" } | { __kind__: "guest" };

export interface Article {
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
}

export interface backendInterface {
    _initializeAccessControlWithSecret: (userSecret: string) => Promise<undefined>;
    addArticle: (title: string, content: string, category: string, imageUrl: string, author: string, excerpt: string, date: string, isBreaking: boolean, isSlider: boolean, isPublished: boolean) => Promise<bigint>;
    addCategory: (category: string) => Promise<undefined>;
    assignCallerUserRole: (user: Principal, role: UserRole) => Promise<undefined>;
    deleteArticle: (id: bigint) => Promise<boolean>;
    getAllArticles: () => Promise<Article[]>;
    getArticleById: (id: bigint) => Promise<Article | undefined>;
    getArticlesByCategory: (category: string) => Promise<Article[]>;
    getBreakingArticles: () => Promise<Article[]>;
    getBreakingNewsText: () => Promise<string>;
    getCallerUserRole: () => Promise<UserRole>;
    getCategories: () => Promise<string[]>;
    getPublishedArticles: () => Promise<Article[]>;
    getSliderArticles: () => Promise<Article[]>;
    isCallerAdmin: () => Promise<boolean>;
    removeCategory: (category: string) => Promise<undefined>;
    setBreakingNewsText: (text: string) => Promise<undefined>;
    updateArticle: (id: bigint, title: string, content: string, category: string, imageUrl: string, author: string, excerpt: string, date: string, isBreaking: boolean, isSlider: boolean, isPublished: boolean) => Promise<boolean>;
}
