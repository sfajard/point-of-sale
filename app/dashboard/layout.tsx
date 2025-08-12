import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

/**
 * Layout component that wraps page content with the application's sidebar and sidebar context.
 *
 * The component provides SidebarProvider context and renders the AppSidebar alongside a main
 * content area that displays the passed `children`. It is purely presentational and does not
 * perform side effects or manage state.
 *
 * @param children - React nodes to be rendered inside the main content area of the dashboard layout.
 * @returns The dashboard layout element containing the sidebar and main content region.
 */
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen min-w-screen">
                <AppSidebar />

                <main className="flex-1 flex flex-col">
                    <div className="flex-1 p-6 md:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}