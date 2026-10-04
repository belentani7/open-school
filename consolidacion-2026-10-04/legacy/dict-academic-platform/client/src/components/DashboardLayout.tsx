import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { startLogin } from "@/const";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/useMobile";
import { BookOpen, BrainCircuit, FileBadge, FolderGit2, LayoutDashboard, LogOut, PanelLeft, UserRound } from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';
import { Button } from "./ui/button";

const studentCopy = {
  es: { area: "Estudiante", panel: "Panel", tutor: "Tutor académico", path: "Mi itinerario", projects: "Proyectos", record: "Transcript interno", profile: "Perfil y portfolio", accessTitle: "Accede al área del estudiante", accessBody: "El progreso, portfolio y documentación académica interna requieren autenticación segura.", access: "Acceder", notice: "D.I.C.T. es formación académica independiente: no otorga títulos universitarios oficiales, equivalencias ni ECTS. Sus créditos se denominan", signOut: "Cerrar sesión", toggle: "Alternar navegación", menu: "Menú" },
  pt: { area: "Estudante", panel: "Painel", tutor: "Tutor académico", path: "O meu percurso", projects: "Projetos", record: "Transcript interno", profile: "Perfil e portfólio", accessTitle: "Acede à área do estudante", accessBody: "O progresso, portfólio e documentação académica interna exigem autenticação segura.", access: "Aceder", notice: "A D.I.C.T. é formação académica independente: não atribui diplomas universitários oficiais, equivalências ou ECTS. Os seus créditos são denominados", signOut: "Terminar sessão", toggle: "Alternar navegação", menu: "Menu" },
  en: { area: "Student", panel: "Dashboard", tutor: "Academic tutor", path: "My pathway", projects: "Projects", record: "Internal transcript", profile: "Profile & portfolio", accessTitle: "Access the student area", accessBody: "Progress, portfolio and internal academic documentation require secure authentication.", access: "Access", notice: "D.I.C.T. is independent academic education: it does not award official university degrees, equivalencies or ECTS. Its credits are named", signOut: "Sign out", toggle: "Toggle navigation", menu: "Menu" },
};

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();
  const { locale } = useLanguage();
  const text = studentCopy[locale];

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) {
    return <DashboardLayoutSkeleton />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold tracking-tight text-center">
              {text.accessTitle}
            </h1>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              {text.accessBody}
            </p>
            <p className="border-l-2 border-primary bg-accent/35 px-3 py-2 text-xs leading-relaxed text-muted-foreground text-left max-w-sm">
              {text.notice} <strong className="text-primary">Créditos Académicos Internos (CA)</strong>.
            </p>
          </div>
          <Button
            onClick={() => startLogin()}
            size="lg"
            className="w-full shadow-lg hover:shadow-xl transition-all"
          >
            {text.access}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth} locale={locale}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
  locale: "es" | "pt" | "en";
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
  locale,
}: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const text = studentCopy[locale];
  const menuItems = [
    { icon: LayoutDashboard, label: text.panel, path: "/student" }, { icon: BrainCircuit, label: text.tutor, path: "/student/tutor" }, { icon: BookOpen, label: text.path, path: "/curriculum" }, { icon: FolderGit2, label: text.projects, path: "/student/projects" }, { icon: FileBadge, label: text.record, path: "/student/record" }, { icon: UserRound, label: text.profile, path: "/student/profile" },
  ];
  const activeMenuItem = menuItems.find(item => item.path === location);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          className="border-r-0"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-16 justify-center">
            <div className="flex items-center gap-3 px-2 transition-all w-full">
              <button
                onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
                aria-label={text.toggle}
              >
                <PanelLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              {!isCollapsed ? (
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-semibold tracking-tight truncate">
                    D.I.C.T. · {text.area}
                  </span>
                </div>
              ) : null}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0">
            <SidebarMenu className="px-2 py-1">
              {menuItems.map(item => {
                const isActive = location === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setLocation(item.path)}
                      tooltip={item.label}
                      className={`h-10 transition-all font-normal`}
                    >
                      <item.icon
                        className={`h-4 w-4 ${isActive ? "text-primary" : ""}`}
                      />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-accent/50 transition-colors w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-9 w-9 border shrink-0">
                    <AvatarFallback className="text-xs font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium truncate leading-none">
                      {user?.name || "-"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-1.5">
                      {user?.email || "-"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{text.signOut}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
        />
      </div>

      <SidebarInset>
        {isMobile && (
          <div className="flex border-b h-14 items-center justify-between bg-background/95 px-2 backdrop-blur supports-[backdrop-filter]:backdrop-blur sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 rounded-lg bg-background" />
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <span className="tracking-tight text-foreground">
                    {activeMenuItem?.label ?? text.menu}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        <main className="flex-1 p-4">
          <aside className="mx-auto max-w-[1120px] border-l-2 border-primary bg-accent/35 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            <strong className="text-primary">D.I.C.T. · {text.record}.</strong> {text.notice} <strong className="text-primary">Créditos Académicos Internos (CA)</strong>.
          </aside>
          {children}
        </main>
      </SidebarInset>
    </>
  );
}
