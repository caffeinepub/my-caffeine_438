import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type RouterContextType = {
  pathname: string;
  params: Record<string, string>;
  navigate: (to: string) => void;
};

const RouterContext = createContext<RouterContextType>({
  pathname: "/",
  params: {},
  navigate: () => {},
});

function matchPath(
  pattern: string,
  pathname: string,
): Record<string, string> | null {
  const patternParts = pattern.split("/");
  const pathParts = pathname.split("/");

  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    const p = patternParts[i];
    const v = pathParts[i];
    if (p.startsWith(":")) {
      params[p.slice(1)] = decodeURIComponent(v);
    } else if (p !== v) {
      return null;
    }
  }
  return params;
}

const PATTERNS = ["/", "/admin", "/category/:name", "/news/:id"];

export function RouterProvider({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePop = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const navigate = useCallback((to: string) => {
    window.history.pushState(null, "", to);
    setPathname(to);
  }, []);

  let params: Record<string, string> = {};
  for (const pattern of PATTERNS) {
    const match = matchPath(pattern, pathname);
    if (match !== null) {
      params = match;
      break;
    }
  }

  return (
    <RouterContext.Provider value={{ pathname, params, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

export function useParams<T extends Record<string, string>>(): T {
  return useContext(RouterContext).params as T;
}

export function useNavigate() {
  return useContext(RouterContext).navigate;
}

export function Link({
  to,
  children,
  className,
  onClick,
  "data-ocid": dataOcid,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  "data-ocid"?: string;
}) {
  const navigate = useNavigate();
  return (
    <a
      href={to}
      className={className}
      data-ocid={dataOcid}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

export function Outlet() {
  return null;
}

export function Route({
  path,
  component: Component,
}: {
  path: string;
  component: React.ComponentType;
}) {
  const { pathname } = useRouter();
  for (const p of [path]) {
    if (matchPath(p, pathname) !== null) {
      return <Component />;
    }
  }
  return null;
}
