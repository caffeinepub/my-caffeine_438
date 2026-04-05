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

export interface Reporter {
    name: string;
    email: string;
    role: string;
    phone: string;
}

export interface SiteSettings {
    siteName: string;
    tagline: string;
    contactEmail: string;
    footerText: string;
    editorName: string;
    editorEmail: string;
    editorPhone: string;
    address: string;
    reporters: Reporter[];
}

export interface RSSItem {
    id: bigint;
    title: string;
    description: string;
    link: string;
    pubDate: string;
    source: string;
    category: string;
    fetchedAt: bigint;
}

export interface FeedSource {
    url: string;
    name: string;
    category: string;
    enabled: boolean;
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
    getLogoUrl: () => Promise<string>;
    getPublishedArticles: () => Promise<Article[]>;
    getSliderArticles: () => Promise<Article[]>;
    getSiteSettings: () => Promise<SiteSettings>;
    getRSSItems: () => Promise<RSSItem[]>;
    getRSSItemsByCategory: (category: string) => Promise<RSSItem[]>;
    getLastFetchTime: () => Promise<bigint>;
    getFeedSources: () => Promise<FeedSource[]>;
    isCallerAdmin: () => Promise<boolean>;
    claimAdminIfNoneExists: () => Promise<boolean>;
    removeCategory: (category: string) => Promise<undefined>;
    refreshAllFeeds: () => Promise<bigint>;
    setBreakingNewsText: (text: string) => Promise<undefined>;
    setLogoUrl: (url: string) => Promise<undefined>;
    toggleFeedSource: (url: string, enabled: boolean) => Promise<undefined>;
    updateArticle: (id: bigint, title: string, content: string, category: string, imageUrl: string, author: string, excerpt: string, date: string, isBreaking: boolean, isSlider: boolean, isPublished: boolean) => Promise<boolean>;
    updateSiteSettings: (settings: SiteSettings) => Promise<undefined>;
    adminLoginWithPassword: (email: string, password: string) => Promise<{ ok: string } | { err: string }>;
    isAdminSessionValid: (token: string) => Promise<boolean>;
    adminSessionLogout: (token: string) => Promise<undefined>;
    changeAdminPassword: (token: string, oldPassword: string, newPassword: string) => Promise<{ ok: null } | { err: string }>;
}
