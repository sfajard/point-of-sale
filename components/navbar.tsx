'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from './ui/navigation-menu'
import { ChevronDown, Ghost, HeartIcon, ShoppingBag, ShoppingCart } from 'lucide-react'
import { ThemeButton } from './theme-button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Category } from '@prisma/client'
import { getAllCategoties } from '@/lib/actions/category'
import { capitalizeEachWord } from '@/lib/capitalized-word'
import { signOut, useSession } from 'next-auth/react'

const Navbar = () => {
    const [categories, setCategories] = React.useState<Category[]>([])
    const { data: session } = useSession()

    const fetchCategory = async () => {
        try {
            const categories = await getAllCategoties()
            setCategories(categories ?? [])
        } catch (error) {
            console.log(error)
        }
    }

    const handleSignOut = () => {
        signOut()
    }

    useEffect(() => {
        fetchCategory()
        console.log(categories)
    }, [])

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
                            <NavigationMenuTrigger>Category</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[200px] gap-4">
                                    <li>
                                        {Array.isArray(categories) &&
                                            categories
                                                .filter((category) => category.isFeatured)
                                                .map((category) => (
                                                    <NavigationMenuLink key={category.id} asChild>
                                                        <Link href="#">{capitalizeEachWord(category.name)}</Link>
                                                    </NavigationMenuLink>
                                                ))}
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        {session && session.user?.role === 'admin' ? (
                            <NavigationMenuItem>
                                <NavigationMenuLink href='/dashboard'>
                                    Dashboard
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ) : ''}
                    </NavigationMenuList>
                </NavigationMenu>
                <div className="flex gap-5 align-center">
                    <Button variant={'ghost'} size={'icon'} className='cursor-pointer'>
                        <Link href='/cart'><ShoppingBag /></Link>
                    </Button>
                    <Button variant={'ghost'} size={'icon'} className='cursor-pointer'>
                        <HeartIcon />
                    </Button>
                    <ThemeButton />
                    {session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full flex items-center justify-center p-0">
                                    <Avatar className="h-8 w-8">
                                        {session && (
                                            <Avatar>
                                                <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? "User"} />
                                                <AvatarFallback>
                                                    {session.user.name?.charAt(0).toUpperCase() ?? "D"}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </Avatar>
                                    <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {session.user.email}
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
                                    <Button size={'sm'} variant={'ghost'} onClick={handleSignOut}>Sign Out</Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button>
                            <Link href='/signin'>Sign In</Link>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar