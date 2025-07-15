import Link from 'next/link'
import React from 'react'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from './ui/navigation-menu'
import { ChevronDown, CircleCheckIcon, CircleHelpIcon, CircleIcon, HeartIcon, ShoppingCart } from 'lucide-react'
import { ThemeButton } from './theme-button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'

interface NavbarProps {
    userEmail: string;
    userName?: string;
    userAvatarUrl?: string;
}

const Navbar = ({ userEmail, userName = "User", userAvatarUrl }: NavbarProps) => {
    return (
        <nav className="sticky top-0 z-40 w-full bg-background px-4 py-3 shadow-sm border-b">
            <div className="flex items-center justify-between h-10 px-4">
                <Link href="/" className="text-xl font-bold text-primary">
                    <span className='text-2xl font-bold'>sfaMart.</span>
                </Link>
                <NavigationMenu viewport={false}>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Home</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <li className="row-span-3">
                                        <NavigationMenuLink asChild>
                                            <a
                                                className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                                                href="/"
                                            >
                                                <div className="mt-4 mb-2 text-lg font-medium">
                                                    shadcn/ui
                                                </div>
                                                <p className="text-muted-foreground text-sm leading-tight">
                                                    Beautifully designed components built with Tailwind CSS.
                                                </p>
                                            </a>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">

                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Pages</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[300px] gap-4">
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link href="#">
                                                <div className="font-medium">Components</div>
                                                <div className="text-muted-foreground">
                                                    Browse all components in the library.
                                                </div>
                                            </Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink asChild>
                                            <Link href="#">
                                                <div className="font-medium">Documentation</div>
                                                <div className="text-muted-foreground">
                                                    Learn how to use the library.
                                                </div>
                                            </Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink asChild>
                                            <Link href="#">
                                                <div className="font-medium">Blog</div>
                                                <div className="text-muted-foreground">
                                                    Read our latest blog posts.
                                                </div>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Blog</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[200px] gap-4">
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link href="#">Components</Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink asChild>
                                            <Link href="#">Documentation</Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink asChild>
                                            <Link href="#">Blocks</Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink>
                                Buy
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink href='/dashboard'>
                                Dashboard
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <div className="flex gap-5 align-center">
                    <Button variant={'ghost'} size={'icon'} className='cursor-pointer'>
                        <ShoppingCart />
                    </Button>
                    <Button variant={'ghost'} size={'icon'} className='cursor-pointer'>
                        <HeartIcon />
                    </Button>
                    <ThemeButton />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full flex items-center justify-center p-0">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={userAvatarUrl} alt={userName} />
                                    <AvatarFallback>
                                        {userName ? userName.charAt(0).toUpperCase() : "DU"}
                                    </AvatarFallback>
                                </Avatar>
                                <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{userName}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {userEmail}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                Pengaturan Profil
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Bantuan
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    )
}

export default Navbar