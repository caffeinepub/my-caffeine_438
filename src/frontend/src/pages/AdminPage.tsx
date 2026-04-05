import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Eye,
  EyeOff,
  ImageIcon,
  KeyRound,
  Loader2,
  LogIn,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Rss,
  Save,
  Settings,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Article } from "../backend.d";
import {
  type Reporter,
  type SiteSettings,
  useAddArticle,
  useAddCategory,
  useAllArticles,
  useBreakingNewsText,
  useCategories,
  useDeleteArticle,
  useFeedSources,
  useLastFetchTime,
  useLogoUrl,
  useRSSItems,
  useRefreshFeeds,
  useRemoveCategory,
  useSetBreakingNewsText,
  useSetLogoUrl,
  useSiteSettings,
  useToggleFeedSource,
  useUpdateArticle,
  useUpdateSiteSettings,
} from "../hooks/useQueries";

// ─── Frontend-only Admin Auth ──────────────────────────────────────────────────
const ADMIN_EMAIL = "baligawnews.bd@gmail.com";
const ADMIN_PW_KEY = "adminLocalPassword";
const ADMIN_SESSION_KEY = "adminLocalSession";
const DEFAULT_PASSWORD = "Baligaw@2024";

function getStoredPassword(): string {
  return localStorage.getItem(ADMIN_PW_KEY) || DEFAULT_PASSWORD;
}
function isLocalSessionValid(): boolean {
  const session = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!session) return false;
  try {
    const { expires } = JSON.parse(session);
    return Date.now() < expires;
  } catch {
    return false;
  }
}
function createLocalSession() {
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ expires }));
}
function clearLocalSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

type ArticleFormData = {
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
};

function getTodayBengali() {
  const now = new Date();
  const bengaliMonths = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];
  const bengaliNums = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const toBengali = (n: number) =>
    n
      .toString()
      .split("")
      .map((d) => bengaliNums[Number.parseInt(d)])
      .join("");
  return `${toBengali(now.getDate())} ${bengaliMonths[now.getMonth()]} ${toBengali(now.getFullYear())}`;
}

const EMPTY_FORM: ArticleFormData = {
  title: "",
  content: "",
  category: "",
  imageUrl: "",
  author: "",
  excerpt: "",
  date: getTodayBengali(),
  isBreaking: false,
  isSlider: false,
  isPublished: true,
};

function ArticleForm({
  form,
  categories,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
  isEdit,
}: {
  form: ArticleFormData;
  categories: string[];
  onChange: (field: keyof ArticleFormData, value: string | boolean) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEdit: boolean;
}) {
  return (
    <div className="space-y-4" data-ocid="admin.dialog">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-1">
          <Label htmlFor="title">শিরোনাম *</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="সংবাদের শিরোনাম লিখুন"
            data-ocid="admin.input"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="author">লেখক</Label>
          <Input
            id="author"
            value={form.author}
            onChange={(e) => onChange("author", e.target.value)}
            placeholder="লেখকের নাম"
            data-ocid="admin.input"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="date">তারিখ</Label>
          <Input
            id="date"
            value={form.date}
            onChange={(e) => onChange("date", e.target.value)}
            placeholder="৫ এপ্রিল ২০২৬"
            data-ocid="admin.input"
          />
        </div>

        <div className="space-y-1">
          <Label>ক্যাটাগরি</Label>
          <Select
            value={form.category}
            onValueChange={(v) => onChange("category", v)}
          >
            <SelectTrigger data-ocid="admin.select">
              <SelectValue placeholder="ক্যাটাগরি বেছে নিন" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">ছবির লিংক</Label>
          <Input
            id="imageUrl"
            value={form.imageUrl}
            onChange={(e) => onChange("imageUrl", e.target.value)}
            placeholder="https://example.com/image.jpg"
            data-ocid="admin.input"
          />
        </div>

        <div className="md:col-span-2 space-y-1">
          <Label htmlFor="excerpt">সংক্ষিপ্ত বিবরণ</Label>
          <Textarea
            id="excerpt"
            value={form.excerpt}
            onChange={(e) => onChange("excerpt", e.target.value)}
            placeholder="সংক্ষিপ্ত বিবরণ (২-৩ বাক্য)"
            rows={2}
            data-ocid="admin.textarea"
          />
        </div>

        <div className="md:col-span-2 space-y-1">
          <Label htmlFor="content">বিস্তারিত সংবাদ</Label>
          <Textarea
            id="content"
            value={form.content}
            onChange={(e) => onChange("content", e.target.value)}
            placeholder="সম্পূর্ণ সংবাদ লিখুন"
            rows={6}
            data-ocid="admin.textarea"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6 pt-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="isPublished"
            checked={form.isPublished}
            onCheckedChange={(v) => onChange("isPublished", !!v)}
            data-ocid="admin.checkbox"
          />
          <Label htmlFor="isPublished" className="cursor-pointer">
            প্রকাশিত
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="isSlider"
            checked={form.isSlider}
            onCheckedChange={(v) => onChange("isSlider", !!v)}
            data-ocid="admin.checkbox"
          />
          <Label htmlFor="isSlider" className="cursor-pointer">
            স্লাইডারে দেখাবে
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="isBreaking"
            checked={form.isBreaking}
            onCheckedChange={(v) => onChange("isBreaking", !!v)}
            data-ocid="admin.checkbox"
          />
          <Label htmlFor="isBreaking" className="cursor-pointer">
            ব্রেকিং নিউজ
          </Label>
        </div>
      </div>

      <DialogFooter className="gap-2 pt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          data-ocid="admin.cancel_button"
        >
          <X className="w-4 h-4 mr-1" />
          বাতিল
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || !form.title.trim()}
          className="bg-news-red hover:bg-news-red-dark text-white"
          data-ocid="admin.submit_button"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-1" />
          )}
          {isEdit ? "আপডেট করুন" : "সংরক্ষণ করুন"}
        </Button>
      </DialogFooter>
    </div>
  );
}

function ArticlesTab() {
  const { data: articles, isLoading } = useAllArticles();
  const { data: categories = [] } = useCategories();
  const addArticle = useAddArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [form, setForm] = useState<ArticleFormData>(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);

  const handleChange = (
    field: keyof ArticleFormData,
    value: string | boolean,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openAdd = () => {
    setEditingArticle(null);
    setForm({ ...EMPTY_FORM, date: getTodayBengali() });
    setDialogOpen(true);
  };

  const openEdit = (article: Article) => {
    setEditingArticle(article);
    setForm({
      title: article.title,
      content: article.content,
      category: article.category,
      imageUrl: article.imageUrl,
      author: article.author,
      excerpt: article.excerpt,
      date: article.date,
      isBreaking: article.isBreaking,
      isSlider: article.isSlider,
      isPublished: article.isPublished,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingArticle) {
        await updateArticle.mutateAsync({ id: editingArticle.id, ...form });
        toast.success("সংবাদ আপডেট হয়েছে");
      } else {
        await addArticle.mutateAsync(form);
        toast.success("নতুন সংবাদ যোগ হয়েছে");
      }
      setDialogOpen(false);
    } catch {
      toast.error("কার্যটি সম্পন্ন করা যায়নি");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteArticle.mutateAsync(id);
      toast.success("সংবাদ মুছে ফেলা হয়েছে");
      setDeleteConfirmId(null);
    } catch {
      toast.error("মুছে ফেলা যায়নি");
    }
  };

  const isSubmitting = addArticle.isPending || updateArticle.isPending;

  return (
    <div data-ocid="admin.panel">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">
          সকল সংবাদ ({articles?.length ?? 0})
        </h2>
        <Button
          onClick={openAdd}
          className="bg-news-red hover:bg-news-red-dark text-white"
          data-ocid="admin.primary_button"
        >
          <Plus className="w-4 h-4 mr-1" />
          নতুন নিউজ যোগ করুন
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-2" data-ocid="admin.loading_state">
          {["a1", "a2", "a3", "a4", "a5"].map((k) => (
            <Skeleton key={k} className="h-12 w-full" />
          ))}
        </div>
      )}

      {!isLoading && articles && articles.length === 0 && (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="admin.empty_state"
        >
          কোনো সংবাদ নেই। নতুন সংবাদ যোগ করুন।
        </div>
      )}

      {!isLoading && articles && articles.length > 0 && (
        <div className="border rounded overflow-auto" data-ocid="admin.table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>শিরোনাম</TableHead>
                <TableHead>ক্যাটাগরি</TableHead>
                <TableHead>তারিখ</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead className="text-right">কার্যক্রম</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article, i) => (
                <TableRow
                  key={Number(article.id)}
                  data-ocid={`admin.row.${i + 1}`}
                >
                  <TableCell className="max-w-[200px]">
                    <span className="line-clamp-1 text-sm font-medium">
                      {article.title}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-block bg-news-red/10 text-news-red text-xs px-2 py-0.5 rounded-sm font-medium">
                      {article.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {article.date}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {article.isPublished && (
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-sm">
                          প্রকাশিত
                        </span>
                      )}
                      {article.isBreaking && (
                        <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-sm">
                          ব্রেকিং
                        </span>
                      )}
                      {article.isSlider && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-sm">
                          স্লাইডার
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(article)}
                        data-ocid={`admin.edit_button.${i + 1}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-white"
                        onClick={() => setDeleteConfirmId(article.id)}
                        data-ocid={`admin.delete_button.${i + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingArticle ? "সংবাদ সম্পাদনা" : "নতুন সংবাদ যোগ করুন"}
            </DialogTitle>
          </DialogHeader>
          <ArticleForm
            form={form}
            categories={categories}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            isSubmitting={isSubmitting}
            isEdit={!!editingArticle}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>সংবাদ মুছে ফেলবেন?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            এই সংবাদটি স্থায়ীভাবে মুছে ফেলা হবে। এই কার্যটি পূর্বাবস্থায় ফেরানো যাবে না।
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              data-ocid="admin.cancel_button"
            >
              বাতিল
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={deleteArticle.isPending}
              data-ocid="admin.confirm_button"
            >
              {deleteArticle.isPending && (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              )}
              মুছে ফেলুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CategoriesTab() {
  const { data: categories = [], isLoading } = useCategories();
  const addCategory = useAddCategory();
  const removeCategory = useRemoveCategory();
  const [newCategory, setNewCategory] = useState("");
  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null);

  const handleAdd = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    try {
      await addCategory.mutateAsync(trimmed);
      setNewCategory("");
      toast.success("ক্যাটাগরি যোগ হয়েছে");
    } catch {
      toast.error("ক্যাটাগরি যোগ করা যায়নি");
    }
  };

  const handleRemove = async (cat: string) => {
    try {
      await removeCategory.mutateAsync(cat);
      toast.success("ক্যাটাগরি মুছে ফেলা হয়েছে");
      setRemoveConfirm(null);
    } catch {
      toast.error("ক্যাটাগরি মুছে ফেলা যায়নি");
    }
  };

  return (
    <div className="max-w-lg" data-ocid="admin.panel">
      <h2 className="text-lg font-bold mb-4">ক্যাটাগরি ব্যবস্থাপনা</h2>

      {/* Add new */}
      <div className="flex gap-2 mb-6">
        <Input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="নতুন ক্যাটাগরির নাম"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          data-ocid="admin.input"
        />
        <Button
          onClick={handleAdd}
          disabled={!newCategory.trim() || addCategory.isPending}
          className="bg-news-red hover:bg-news-red-dark text-white whitespace-nowrap"
          data-ocid="admin.primary_button"
        >
          {addCategory.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          যোগ করুন
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-2" data-ocid="admin.loading_state">
          {["b1", "b2", "b3", "b4", "b5"].map((k) => (
            <Skeleton key={k} className="h-10 w-full" />
          ))}
        </div>
      )}

      {/* Category list */}
      <ul className="space-y-2" data-ocid="admin.list">
        {categories.map((cat, i) => (
          <li
            key={cat}
            className="flex items-center justify-between p-3 bg-secondary rounded border border-border"
            data-ocid={`admin.item.${i + 1}`}
          >
            <span className="font-medium">{cat}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => setRemoveConfirm(cat)}
              data-ocid={`admin.delete_button.${i + 1}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </li>
        ))}
      </ul>

      {/* Confirm remove dialog */}
      <Dialog
        open={removeConfirm !== null}
        onOpenChange={(open) => !open && setRemoveConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ক্যাটাগরি মুছে ফেলবেন?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            <strong>{removeConfirm}</strong> ক্যাটাগরিটি মুছে ফেলা হবে।
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setRemoveConfirm(null)}
              data-ocid="admin.cancel_button"
            >
              বাতিল
            </Button>
            <Button
              variant="destructive"
              onClick={() => removeConfirm && handleRemove(removeConfirm)}
              disabled={removeCategory.isPending}
              data-ocid="admin.confirm_button"
            >
              {removeCategory.isPending && (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              )}
              মুছে ফেলুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LogoTab() {
  const { data: currentLogoUrl = "", isLoading } = useLogoUrl();
  const setLogoUrl = useSetLogoUrl();
  const [url, setUrl] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  if (!initialized && !isLoading) {
    setUrl(currentLogoUrl);
    setInitialized(true);
  }

  const handleSave = async () => {
    try {
      await setLogoUrl.mutateAsync(url.trim());
      toast.success("লোগো আপডেট হয়েছে");
      setPreviewError(false);
    } catch {
      toast.error("লোগো আপডেট করা যায়নি");
    }
  };

  const handleRemove = async () => {
    try {
      await setLogoUrl.mutateAsync("");
      setUrl("");
      toast.success("লোগো মুছে ফেলা হয়েছে");
    } catch {
      toast.error("লোগো মুছে ফেলা যায়নি");
    }
  };

  return (
    <div className="max-w-2xl" data-ocid="admin.panel">
      <h2 className="text-lg font-bold mb-1">লোগো ব্যবস্থাপনা</h2>
      <p className="text-sm text-muted-foreground mb-6">
        পোর্টালের হেডারে প্রদর্শিত লোগোর URL দিন। লোগো না থাকলে ডিফল্ট আইকন দেখাবে।
      </p>

      {isLoading ? (
        <div className="space-y-4" data-ocid="admin.loading_state">
          <Skeleton className="h-32 w-48 rounded" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Current logo preview */}
          <div>
            <Label className="text-sm font-medium mb-2 block">বর্তমান লোগো</Label>
            <div className="border rounded-lg p-4 bg-muted/30 flex items-center justify-center min-h-[120px] w-48">
              {currentLogoUrl && !previewError ? (
                <img
                  src={currentLogoUrl}
                  alt="লোগো প্রিভিউ"
                  className="max-h-20 max-w-full object-contain"
                  onError={() => setPreviewError(true)}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-xs">লোগো নেই</span>
                </div>
              )}
            </div>
            {currentLogoUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={setLogoUrl.isPending}
                className="mt-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                data-ocid="admin.secondary_button"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                লোগো মুছুন
              </Button>
            )}
          </div>

          {/* Logo URL input */}
          <div className="space-y-2">
            <Label htmlFor="logoUrl">লোগোর URL</Label>
            <Input
              id="logoUrl"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setPreviewError(false);
              }}
              placeholder="https://example.com/logo.png"
              data-ocid="admin.input"
            />
            <p className="text-xs text-muted-foreground">
              লোগোর ছবির সরাসরি লিংক দিন (PNG, JPG, SVG সমর্থিত)
            </p>
          </div>

          {/* Live preview of entered URL */}
          {url && url !== currentLogoUrl && (
            <div>
              <Label className="text-sm font-medium mb-2 block">প্রিভিউ</Label>
              <div className="border rounded-lg p-4 bg-muted/30 flex items-center justify-center w-48 min-h-[80px]">
                <img
                  src={url}
                  alt="নতুন লোগো প্রিভিউ"
                  className="max-h-16 max-w-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              </div>
            </div>
          )}

          <Button
            onClick={handleSave}
            disabled={setLogoUrl.isPending || isLoading}
            className="bg-news-red hover:bg-news-red-dark text-white"
            data-ocid="admin.save_button"
          >
            {setLogoUrl.isPending ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            লোগো সংরক্ষণ করুন
          </Button>
        </div>
      )}
    </div>
  );
}

function BreakingNewsTab() {
  const { data: currentText = "", isLoading } = useBreakingNewsText();
  const setBreakingNewsText = useSetBreakingNewsText();
  const [text, setText] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (!initialized && !isLoading && currentText) {
    setText(currentText);
    setInitialized(true);
  }

  const handleSave = async () => {
    try {
      await setBreakingNewsText.mutateAsync(text);
      toast.success("ব্রেকিং নিউজ আপডেট হয়েছে");
    } catch {
      toast.error("আপডেট করা যায়নি");
    }
  };

  return (
    <div className="max-w-2xl" data-ocid="admin.panel">
      <h2 className="text-lg font-bold mb-4">ব্রেকিং নিউজ টেক্সট</h2>
      <p className="text-sm text-muted-foreground mb-4">
        হেডারের নিচে স্ক্রলিং ব্রেকিং নিউজ বারে যে টেক্সট দেখাবে তা এখানে লিখুন।
      </p>

      {isLoading ? (
        <Skeleton className="h-24 w-full" data-ocid="admin.loading_state" />
      ) : (
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ব্রেকিং নিউজ টেক্সট লিখুন, •••  দিয়ে আলাদা করুন"
          rows={4}
          className="mb-4"
          data-ocid="admin.textarea"
        />
      )}

      <Button
        onClick={handleSave}
        disabled={setBreakingNewsText.isPending || isLoading}
        className="bg-news-red hover:bg-news-red-dark text-white"
        data-ocid="admin.save_button"
      >
        {setBreakingNewsText.isPending ? (
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
        ) : (
          <Save className="w-4 h-4 mr-1" />
        )}
        সংরক্ষণ করুন
      </Button>
    </div>
  );
}

// ─── RSS Feed Tab ─────────────────────────────────────────────────────────────

function formatNanoTime(nanos: number): string {
  if (!nanos) return "কখনো করা হয়নি";
  const ms = nanos / 1_000_000;
  const date = new Date(ms);
  const bengaliNums: Record<string, string> = {
    "0": "০",
    "1": "১",
    "2": "২",
    "3": "৩",
    "4": "৪",
    "5": "৫",
    "6": "৬",
    "7": "৭",
    "8": "৮",
    "9": "৯",
  };
  const toBn = (n: number) =>
    n
      .toString()
      .split("")
      .map((d) => bengaliNums[d] ?? d)
      .join("");
  const months = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];
  return `${toBn(date.getDate())} ${months[date.getMonth()]} ${toBn(date.getFullYear())}, ${toBn(date.getHours())}:${date.getMinutes().toString().padStart(2, "0")}`;
}

function RSSTab() {
  const { data: sources = [], isLoading: sourcesLoading } = useFeedSources();
  const { data: rssItems = [], isLoading: itemsLoading } = useRSSItems();
  const { data: lastFetch = 0 } = useLastFetchTime();
  const refreshFeeds = useRefreshFeeds();
  const toggleFeed = useToggleFeedSource();

  const handleRefresh = async () => {
    try {
      const count = await refreshFeeds.mutateAsync();
      toast.success(`${count} টি সংবাদ সংগ্রহ করা হয়েছে`);
    } catch {
      toast.error("নিউজ ফিড রিফ্রেশ করা যায়নি");
    }
  };

  const handleToggle = async (url: string, enabled: boolean) => {
    try {
      await toggleFeed.mutateAsync({ url, enabled });
      toast.success(enabled ? "ফিড সক্রিয় করা হয়েছে" : "ফিড নিষ্ক্রিয় করা হয়েছে");
    } catch {
      toast.error("পরিবর্তন করা যায়নি");
    }
  };

  return (
    <div data-ocid="admin.panel">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Rss className="w-5 h-5 text-news-red" />
            নিউজ ফিড ব্যবস্থাপনা
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            সর্বশেষ আপডেট:{" "}
            <span className="font-medium text-foreground">
              {formatNanoTime(lastFetch)}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {itemsLoading ? "..." : `${rssItems.length} টি সংবাদ লোড হয়েছে`}
          </span>
          <Button
            onClick={handleRefresh}
            disabled={refreshFeeds.isPending}
            className="bg-news-red hover:bg-news-red-dark text-white"
            data-ocid="admin.primary_button"
          >
            {refreshFeeds.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            নিউজ ফিড রিফ্রেশ করুন
          </Button>
        </div>
      </div>

      {refreshFeeds.isPending && (
        <div
          className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded mb-6 text-sm text-blue-700"
          data-ocid="admin.loading_state"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          বিবিসি বাংলা, প্রথম আলো, ইত্তেফাক ও অন্যান্য উৎস থেকে সংবাদ সংগ্রহ হচ্ছে...
        </div>
      )}

      {/* Feed sources */}
      <div className="mb-8">
        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
          সংবাদ উৎসমূহ
        </h3>
        {sourcesLoading ? (
          <div className="space-y-2" data-ocid="admin.loading_state">
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <Skeleton key={k} className="h-14 w-full" />
            ))}
          </div>
        ) : sources.length === 0 ? (
          <div
            className="text-center py-8 text-muted-foreground border border-dashed rounded"
            data-ocid="admin.empty_state"
          >
            <p className="text-sm">কোনো ফিড উৎস কনফিগার করা নেই।</p>
            <p className="text-xs mt-1">ব্যাকএন্ডে ডিফল্ট ফিড উৎস যোগ করুন।</p>
          </div>
        ) : (
          <div className="border rounded overflow-auto" data-ocid="admin.table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>সংবাদ মাধ্যম</TableHead>
                  <TableHead>ক্যাটাগরি</TableHead>
                  <TableHead>RSS URL</TableHead>
                  <TableHead className="text-center">সক্রিয়</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sources.map((source, i) => (
                  <TableRow key={source.url} data-ocid={`admin.row.${i + 1}`}>
                    <TableCell className="font-medium">{source.name}</TableCell>
                    <TableCell>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">
                        {source.category}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <span className="text-xs text-muted-foreground truncate block">
                        {source.url}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={source.enabled}
                        onCheckedChange={(checked) =>
                          handleToggle(source.url, checked)
                        }
                        disabled={toggleFeed.isPending}
                        data-ocid={`admin.switch.${i + 1}`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* RSS items preview */}
      {!itemsLoading && rssItems.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
            সংগৃহীত সংবাদ (সর্বশেষ {Math.min(rssItems.length, 5)} টি)
          </h3>
          <div className="space-y-2" data-ocid="admin.list">
            {rssItems.slice(0, 5).map((item, i) => (
              <div
                key={Number(item.id)}
                className="flex items-start gap-3 p-3 border border-border rounded text-sm"
                data-ocid={`admin.item.${i + 1}`}
              >
                <span className="text-xs font-bold bg-news-red/10 text-news-red px-2 py-0.5 rounded-sm shrink-0 mt-0.5">
                  {item.source}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-news-charcoal line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.category} • {item.pubDate}
                  </p>
                </div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline shrink-0"
                  data-ocid={`admin.link.${i + 1}`}
                >
                  দেখুন
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
// ─── Settings Tab ─────────────────────────────────────────────────────────────

type ReporterWithId = Reporter & { _key: number };
let _reporterKeyCounter = 0;

function withKey(r: Reporter): ReporterWithId {
  return { ...r, _key: ++_reporterKeyCounter };
}

function SettingsTab() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const [form, setForm] = useState<SiteSettings>({
    siteName: "",
    tagline: "",
    contactEmail: "",
    footerText: "",
    editorName: "",
    editorEmail: "",
    editorPhone: "",
    address: "",
    reporters: [],
  });
  const [reporterKeys, setReporterKeys] = useState<number[]>([]);

  useEffect(() => {
    if (settings) {
      const reporters = (settings.reporters ?? []).map(withKey);
      setReporterKeys(reporters.map((r) => r._key));
      setForm({
        ...settings,
        reporters: reporters.map(({ _key: _, ...r }) => r),
      });
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(form);
      toast.success("সেটিংস সংরক্ষণ করা হয়েছে");
    } catch {
      toast.error("সেটিংস সংরক্ষণ করা যায়নি");
    }
  };

  const addReporter = () => {
    setForm((p) => ({
      ...p,
      reporters: [...p.reporters, { name: "", email: "", role: "", phone: "" }],
    }));
  };

  const removeReporter = (idx: number) => {
    setReporterKeys((k) => k.filter((_, i) => i !== idx));
    setForm((p) => ({
      ...p,
      reporters: p.reporters.filter((_, i) => i !== idx),
    }));
  };

  const updateReporter = (
    idx: number,
    field: keyof Reporter,
    value: string,
  ) => {
    setForm((p) => {
      const reporters = [...p.reporters];
      reporters[idx] = { ...reporters[idx], [field]: value };
      return { ...p, reporters };
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-6" data-ocid="admin.loading_state">
        {[1, 2, 3, 4, 5].map((k) => (
          <div key={k} className="space-y-3 p-4 border rounded-lg">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl" data-ocid="admin.panel">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-news-red/10 p-2 rounded-lg">
          <Settings className="w-5 h-5 text-news-red" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-news-charcoal">সাইট সেটিংস</h2>
          <p className="text-sm text-muted-foreground">
            পোর্টালের সব তথ্য এখান থেকে আপডেট করুন
          </p>
        </div>
      </div>

      <div className="space-y-6 mt-6">
        {/* ── Section 1: প্রতিষ্ঠানের তথ্য ── */}
        <div className="border rounded-xl overflow-hidden shadow-sm">
          <div className="bg-muted/40 px-4 py-3 border-b flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs font-semibold text-news-red border-news-red/40 bg-news-red/5"
            >
              ০১
            </Badge>
            <h3 className="font-semibold text-sm">প্রতিষ্ঠানের তথ্য</h3>
          </div>
          <div className="p-5 space-y-4">
            {/* Logo info */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-dashed">
              <ImageIcon className="w-5 h-5 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground">
                লোগো পরিবর্তনের জন্য উপরের{" "}
                <strong className="text-foreground">"লোগো"</strong> ট্যাব ব্যবহার
                করুন।
              </p>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="siteName">সাইটের নাম</Label>
                <Input
                  id="siteName"
                  value={form.siteName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, siteName: e.target.value }))
                  }
                  placeholder="বালিগাঁও নিউজ"
                  data-ocid="settings.site_name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tagline">ট্যাগলাইন</Label>
                <Input
                  id="tagline"
                  value={form.tagline}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tagline: e.target.value }))
                  }
                  placeholder="বালিগাঁওয়ের বিশ্বস্ত সংবাদ"
                  data-ocid="settings.tagline.input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 2: সম্পাদকীয় তথ্য ── */}
        <div className="border rounded-xl overflow-hidden shadow-sm">
          <div className="bg-muted/40 px-4 py-3 border-b flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs font-semibold text-news-red border-news-red/40 bg-news-red/5"
            >
              ০২
            </Badge>
            <h3 className="font-semibold text-sm">সম্পাদকীয় তথ্য</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="editorName">সম্পাদকের নাম</Label>
                <Input
                  id="editorName"
                  value={form.editorName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, editorName: e.target.value }))
                  }
                  placeholder="মোঃ রহিম উদ্দিন"
                  data-ocid="settings.editor_name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editorPhone">সম্পাদকের ফোন নম্বর</Label>
                <Input
                  id="editorPhone"
                  type="tel"
                  value={form.editorPhone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, editorPhone: e.target.value }))
                  }
                  placeholder="+880 1XXXXXXXXX"
                  data-ocid="settings.editor_phone.input"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="editorEmail">সম্পাদকের ইমেইল</Label>
              <Input
                id="editorEmail"
                type="email"
                value={form.editorEmail}
                onChange={(e) =>
                  setForm((p) => ({ ...p, editorEmail: e.target.value }))
                }
                placeholder="editor@baligawnews.com"
                data-ocid="settings.editor_email.input"
              />
            </div>
          </div>
        </div>

        {/* ── Section 3: প্রতিষ্ঠানের ঠিকানা ── */}
        <div className="border rounded-xl overflow-hidden shadow-sm">
          <div className="bg-muted/40 px-4 py-3 border-b flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs font-semibold text-news-red border-news-red/40 bg-news-red/5"
            >
              ০৩
            </Badge>
            <h3 className="font-semibold text-sm">প্রতিষ্ঠানের ঠিকানা</h3>
          </div>
          <div className="p-5">
            <div className="space-y-1.5">
              <Label htmlFor="address">সম্পূর্ণ ঠিকানা</Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
                placeholder="বালিগাঁও, পশ্চিমবঙ্গ, ভারত&#10;পিন: XXXXXX"
                rows={3}
                data-ocid="settings.address.textarea"
              />
              <p className="text-xs text-muted-foreground">
                এই ঠিকানা ওয়েবসাইটের ফুটারে প্রদর্শিত হবে।
              </p>
            </div>
          </div>
        </div>

        {/* ── Section 4: সংবাদকর্মী/রিপোর্টার তালিকা ── */}
        <div className="border rounded-xl overflow-hidden shadow-sm">
          <div className="bg-muted/40 px-4 py-3 border-b flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-xs font-semibold text-news-red border-news-red/40 bg-news-red/5"
              >
                ০৪
              </Badge>
              <h3 className="font-semibold text-sm">সংবাদকর্মী ও রিপোর্টার</h3>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addReporter}
              className="text-xs border-news-red/30 text-news-red hover:bg-news-red/5"
              data-ocid="settings.reporter.add_button"
            >
              <UserPlus className="w-3.5 h-3.5 mr-1" />
              নতুন সাংবাদিক যোগ করুন
            </Button>
          </div>
          <div className="p-5">
            {form.reporters.length === 0 ? (
              <div
                className="text-center py-8 text-muted-foreground"
                data-ocid="settings.reporters.empty_state"
              >
                <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">কোনো সাংবাদিক যোগ করা হয়নি।</p>
                <p className="text-xs mt-1">
                  উপরের বাটনে ক্লিক করে সাংবাদিক যোগ করুন।
                </p>
              </div>
            ) : (
              <div className="space-y-4" data-ocid="settings.reporters.list">
                {form.reporters.map((reporter, idx) => (
                  <div
                    key={reporterKeys[idx] ?? idx}
                    className="relative border rounded-lg p-4 bg-muted/20"
                    data-ocid={`settings.reporter.item.${idx + 1}`}
                  >
                    <button
                      type="button"
                      onClick={() => removeReporter(idx)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors p-1 rounded hover:bg-destructive/10"
                      aria-label="সরান"
                      data-ocid={`settings.reporter.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                      <div className="space-y-1">
                        <Label className="text-xs">নাম</Label>
                        <Input
                          value={reporter.name}
                          onChange={(e) =>
                            updateReporter(idx, "name", e.target.value)
                          }
                          placeholder="সাংবাদিকের নাম"
                          className="h-9 text-sm"
                          data-ocid={`settings.reporter.name.input.${idx + 1}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">ভূমিকা / পদবি</Label>
                        <Input
                          value={reporter.role}
                          onChange={(e) =>
                            updateReporter(idx, "role", e.target.value)
                          }
                          placeholder="সিনিয়র রিপোর্টার"
                          className="h-9 text-sm"
                          data-ocid={`settings.reporter.role.input.${idx + 1}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">ইমেইল</Label>
                        <Input
                          type="email"
                          value={reporter.email}
                          onChange={(e) =>
                            updateReporter(idx, "email", e.target.value)
                          }
                          placeholder="reporter@baligawnews.com"
                          className="h-9 text-sm"
                          data-ocid={`settings.reporter.email.input.${idx + 1}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">ফোন নম্বর</Label>
                        <Input
                          type="tel"
                          value={reporter.phone}
                          onChange={(e) =>
                            updateReporter(idx, "phone", e.target.value)
                          }
                          placeholder="+880 1XXXXXXXXX"
                          className="h-9 text-sm"
                          data-ocid={`settings.reporter.phone.input.${idx + 1}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Section 5: যোগাযোগ তথ্য ── */}
        <div className="border rounded-xl overflow-hidden shadow-sm">
          <div className="bg-muted/40 px-4 py-3 border-b flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs font-semibold text-news-red border-news-red/40 bg-news-red/5"
            >
              ০৫
            </Badge>
            <h3 className="font-semibold text-sm">যোগাযোগ তথ্য</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="contactEmail">যোগাযোগ ইমেইল</Label>
              <Input
                id="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={(e) =>
                  setForm((p) => ({ ...p, contactEmail: e.target.value }))
                }
                placeholder="baligawnews.bd@gmail.com"
                data-ocid="settings.contact_email.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="footerText">ফুটার টেক্সট</Label>
              <Textarea
                id="footerText"
                value={form.footerText}
                onChange={(e) =>
                  setForm((p) => ({ ...p, footerText: e.target.value }))
                }
                placeholder="© বালিগাঁও নিউজ। সর্বস্বত্ব সংরক্ষিত।"
                rows={2}
                data-ocid="settings.footer_text.textarea"
              />
            </div>
          </div>
        </div>

        {/* ── Section 6: পাসওয়ার্ড পরিবর্তন ── */}
        <PasswordChangeSection />

        {/* ── Save Button ── */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="bg-news-red hover:bg-news-red-dark text-white px-8"
            data-ocid="settings.save_button"
          >
            {updateSettings.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            সেটিংস সংরক্ষণ করুন
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Password Change Section ─────────────────────────────────────────────────

function PasswordChangeSection() {
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleChange = async () => {
    if (newPw !== confirmPw) {
      toast.error("নতুন পাসওয়ার্ড দুটি মিলছে না");
      return;
    }
    if (newPw.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }
    const currentPw = getStoredPassword();
    if (oldPw !== currentPw) {
      toast.error("পুরনো পাসওয়ার্ড সঠিক নয়");
      return;
    }
    setIsPending(true);
    localStorage.setItem(ADMIN_PW_KEY, newPw);
    setIsPending(false);
    toast.success("পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে");
    setOldPw("");
    setNewPw("");
    setConfirmPw("");
  };

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm">
      <div className="bg-muted/40 px-4 py-3 border-b flex items-center gap-2">
        <Badge
          variant="outline"
          className="text-xs font-semibold text-news-red border-news-red/40 bg-news-red/5"
        >
          ০৬
        </Badge>
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <KeyRound className="w-4 h-4" /> অ্যাডমিন পাসওয়ার্ড পরিবর্তন
        </h3>
      </div>
      <div className="p-5 space-y-4">
        <div className="space-y-1.5">
          <Label>পুরনো পাসওয়ার্ড</Label>
          <div className="relative">
            <Input
              type={showOld ? "text" : "password"}
              value={oldPw}
              onChange={(e) => setOldPw(e.target.value)}
              placeholder="বর্তমান পাসওয়ার্ড দিন"
              data-ocid="settings.old_password.input"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showOld ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>নতুন পাসওয়ার্ড</Label>
          <div className="relative">
            <Input
              type={showNew ? "text" : "password"}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
              data-ocid="settings.new_password.input"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showNew ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>নতুন পাসওয়ার্ড নিশ্চিত করুন</Label>
          <Input
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="পাসওয়ার্ড আবার দিন"
            data-ocid="settings.confirm_password.input"
          />
        </div>
        <Button
          onClick={handleChange}
          disabled={isPending || !oldPw || !newPw || !confirmPw}
          className="bg-news-red hover:bg-news-red-dark text-white"
          data-ocid="settings.change_password.submit_button"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          পাসওয়ার্ড পরিবর্তন করুন
        </Button>
      </div>
    </div>
  );
}

// ─── Main AdminPage ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() =>
    isLocalSessionValid(),
  );
  const [email, setEmail] = useState("baligawnews.bd@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      toast.error("ইমেইল ও পাসওয়ার্ড দিন");
      return;
    }
    const correctPassword = getStoredPassword();
    if (
      email.trim().toLowerCase() !== ADMIN_EMAIL ||
      password !== correctPassword
    ) {
      toast.error("ইমেইল বা পাসওয়ার্ড সঠিক নয়");
      return;
    }
    createLocalSession();
    setIsLoggedIn(true);
    toast.success("লগইন সফল হয়েছে");
  };

  const handleLogout = () => {
    clearLocalSession();
    setIsLoggedIn(false);
    setPassword("");
    toast.success("লগআউট হয়েছে");
  };

  // Show login form if no valid session
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4 py-12">
        <div className="w-full max-w-md" data-ocid="admin.card">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-news-red/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-10 h-10 text-news-red" />
            </div>
            <h1 className="text-2xl font-bold text-news-charcoal">
              অ্যাডমিন প্যানেল লগইন
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              বালিগাঁও নিউজ — কন্টেন্ট ম্যানেজমেন্ট সিস্টেম
            </p>
          </div>

          {/* Login Card */}
          <div className="border rounded-2xl shadow-md bg-card p-6 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="adminEmail">ইমেইল</Label>
              <Input
                id="adminEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="baligawnews.bd@gmail.com"
                data-ocid="admin.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="adminPassword">পাসওয়ার্ড</Label>
              <div className="relative">
                <Input
                  id="adminPassword"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড দিন"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  data-ocid="admin.input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={!email.trim() || !password.trim()}
              className="w-full bg-news-red hover:bg-news-red-dark text-white text-base py-5"
              data-ocid="admin.submit_button"
            >
              <LogIn className="w-5 h-5 mr-2" />
              লগইন করুন
            </Button>

            {/* Default password hint */}
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
              <p className="font-semibold mb-1">
                ডিফল্ট পাসওয়ার্ড:{" "}
                <code className="font-mono bg-amber-100 px-1 rounded">
                  Baligaw@2024
                </code>
              </p>
              <p className="text-xs text-amber-700">
                প্রথমবার লগইনের জন্য উপরের ডিফল্ট পাসওয়ার্ড ব্যবহার করুন। লগইনের পরে
                Settings &gt; পাসওয়ার্ড পরিবর্তন থেকে পাসওয়ার্ড বদলান।
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated admin panel
  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-ocid="admin.page">
      {/* Admin header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-news-charcoal">
            অ্যাডমিন প্যানেল
          </h1>
          <p className="text-sm text-muted-foreground">
            বালিগাঁও নিউজ কন্টেন্ট ম্যানেজমেন্ট সিস্টেম
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          data-ocid="admin.secondary_button"
        >
          <LogOut className="w-4 h-4 mr-2" />
          লগআউট
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="articles">
        <TabsList className="mb-6 flex-wrap h-auto" data-ocid="admin.tab">
          <TabsTrigger value="articles" data-ocid="admin.tab">
            নিউজ ব্যবস্থাপনা
          </TabsTrigger>
          <TabsTrigger value="categories" data-ocid="admin.tab">
            ক্যাটাগরি
          </TabsTrigger>
          <TabsTrigger value="breaking" data-ocid="admin.tab">
            ব্রেকিং নিউজ
          </TabsTrigger>
          <TabsTrigger value="logo" data-ocid="admin.tab">
            লোগো
          </TabsTrigger>
          <TabsTrigger value="rss" data-ocid="admin.tab">
            <Rss className="w-3.5 h-3.5 mr-1" />
            নিউজ ফিড
          </TabsTrigger>
          <TabsTrigger value="settings" data-ocid="admin.tab">
            <Settings className="w-3.5 h-3.5 mr-1" />
            সেটিংস
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          <ArticlesTab />
        </TabsContent>
        <TabsContent value="categories">
          <CategoriesTab />
        </TabsContent>
        <TabsContent value="breaking">
          <BreakingNewsTab />
        </TabsContent>
        <TabsContent value="logo">
          <LogoTab />
        </TabsContent>
        <TabsContent value="rss">
          <RSSTab />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
