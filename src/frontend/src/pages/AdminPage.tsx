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
import { Skeleton } from "@/components/ui/skeleton";
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
  Loader2,
  LogIn,
  LogOut,
  Pencil,
  Plus,
  Save,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Article } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddArticle,
  useAddCategory,
  useAllArticles,
  useBreakingNewsText,
  useCategories,
  useDeleteArticle,
  useIsAdmin,
  useRemoveCategory,
  useSetBreakingNewsText,
  useUpdateArticle,
} from "../hooks/useQueries";

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

export default function AdminPage() {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  const isLoggedIn = !!identity;

  if (isInitializing || isAdminLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="admin.loading_state"
      >
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-news-red mx-auto mb-3" />
          <p className="text-muted-foreground">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-sm w-full" data-ocid="admin.card">
          <div className="bg-news-red/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-10 h-10 text-news-red" />
          </div>
          <h1 className="text-2xl font-bold text-news-charcoal mb-2">
            অ্যাডমিন প্যানেল
          </h1>
          <p className="text-muted-foreground mb-8">
            এই পেজে প্রবেশ করতে লগইন করা আবশ্যক।
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-news-red hover:bg-news-red-dark text-white text-base py-5"
            data-ocid="admin.primary_button"
          >
            {isLoggingIn ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <LogIn className="w-5 h-5 mr-2" />
            )}
            লগইন করুন
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-sm w-full" data-ocid="admin.card">
          <div className="bg-destructive/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-news-charcoal mb-2">
            অ্যাক্সেস নেই
          </h1>
          <p className="text-muted-foreground mb-8">
            আপনার অ্যাক্সেস নেই। শুধুমাত্র অ্যাডমিনরা এই প্যানেল ব্যবহার করতে পারবেন।
          </p>
          <Button
            variant="outline"
            onClick={clear}
            className="w-full"
            data-ocid="admin.secondary_button"
          >
            <LogOut className="w-4 h-4 mr-2" />
            লগআউট
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-ocid="admin.page">
      {/* Admin header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-news-charcoal">
            অ্যাডমিন প্যানেল
          </h1>
          <p className="text-sm text-muted-foreground">
            দেশের খবর কন্টেন্ট ম্যানেজমেন্ট সিস্টেম
          </p>
        </div>
        <Button
          variant="outline"
          onClick={clear}
          data-ocid="admin.secondary_button"
        >
          <LogOut className="w-4 h-4 mr-2" />
          লগআউট
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="articles">
        <TabsList className="mb-6" data-ocid="admin.tab">
          <TabsTrigger value="articles" data-ocid="admin.tab">
            নিউজ ব্যবস্থাপনা
          </TabsTrigger>
          <TabsTrigger value="categories" data-ocid="admin.tab">
            ক্যাটাগরি
          </TabsTrigger>
          <TabsTrigger value="breaking" data-ocid="admin.tab">
            ব্রেকিং নিউজ
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
      </Tabs>
    </div>
  );
}
