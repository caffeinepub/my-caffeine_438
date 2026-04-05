import { Toaster } from "@/components/ui/sonner";
import BreakingNewsTicker from "./components/BreakingNewsTicker";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import HomePage from "./pages/HomePage";
import { Route, RouterProvider } from "./router";

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <BreakingNewsTicker />
      <main className="flex-1">
        <Route path="/" component={HomePage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/category/:name" component={CategoryPage} />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppLayout />
    </RouterProvider>
  );
}
