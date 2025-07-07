import { ChevronDown, Home, List, Plus } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import Link from "next/link"

const homeItems = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    }
]

const productItems = [
    {
        title: "Product List",
        url: "/dashboard/products",
        icon: List
    },
    {
        title: "Add Product",
        url: "/dashboard/products/add",
        icon: Plus
    }
]
export const AppSidebar = () => {
    return (
        <Sidebar variant="sidebar" className="bg-sidebar-primary">
            <SidebarHeader>
                <h1 className="m-3 text-2xl bg-tertiary">Point of Sale</h1>
            </SidebarHeader>
            <Collapsible defaultOpen className="group/collapsible">
                <SidebarGroup>
                    <SidebarGroupLabel asChild>
                        <CollapsibleTrigger>
                            <h1>Home</h1>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </CollapsibleTrigger>
                    </SidebarGroupLabel>
                    <CollapsibleContent>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {homeItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </CollapsibleContent>
                </SidebarGroup>
            </Collapsible>
            <Collapsible defaultOpen className="group/collapsible">
                <SidebarGroup>
                    <SidebarGroupLabel asChild>
                        <CollapsibleTrigger>
                            <h1>Product</h1>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </CollapsibleTrigger>
                    </SidebarGroupLabel>
                    <CollapsibleContent>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {productItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </CollapsibleContent>
                </SidebarGroup>
            </Collapsible>
            <SidebarFooter>

            </SidebarFooter>
        </Sidebar>
    )
}