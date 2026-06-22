import { AppHeader } from "@/components/app/app-header";
import { AppSidebar } from "@/components/app/app-sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar />
      <AppHeader />
      <div className="ml-64 mt-16">{children}</div>
    </div>
  );
}
