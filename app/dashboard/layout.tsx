import { DashboardNavbar } from "@/components/dashboard-navbar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const currentUser = {
        email: "user@example.com",
        name: "John Doe",
        avatar: "https://github.com/shadcn.png",
    };

    return (
        <SidebarProvider>
            <div className="flex min-h-screen min-w-screen">
                <AppSidebar />

                <main className="flex-1 flex flex-col">
                    <DashboardNavbar
                        userEmail={currentUser.email}
                        userName={currentUser.name}
                        userAvatarUrl={currentUser.avatar}
                    />
                    <div className="flex-1 p-6 md:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}