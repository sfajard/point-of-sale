'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from './ui/navigation-menu'
import { HeartIcon, Search, ShoppingBag } from 'lucide-react'
import { ThemeButton } from './theme-button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Category } from '@prisma/client'
import { getAllCategoties } from '@/lib/actions/category'
import { capitalizeEachWord } from '@/lib/capitalized-word'
import { signOut, useSession } from 'next-auth/react'
import { Input } from './ui/input'
import { useRouter } from 'next/navigation'

const Navbar = () => {
    const [categories, setCategories] = React.useState<Category[]>([])
    const [searchQuery, setSearchQuery] = useState<string>('')
    const { data: session } = useSession()
    const router = useRouter()

    const fetchCategory = async () => {
        try {
            const categories = await getAllCategoties()
            setCategories(categories ?? [])
        } catch (error) {
            console.error('Failed to fetch categories:', error)
        }
    }

    const handleSignOut = () => {
        signOut()
    }

    const handleSearch = () => {
        if (searchQuery) {
            router.push(`/products?search=${searchQuery}`)
        }
    }

    useEffect(() => {
        fetchCategory()
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
                            <NavigationMenuLink asChild>
                                <Link href="/">Home</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[200px] gap-2 p-4">
                                    {Array.isArray(categories) && categories.map((category) => (
                                        <li key={category.id}>
                                            <NavigationMenuLink asChild>
                                                <Link href={`/category/${category.id}`}>{capitalizeEachWord(category.name)}</Link>
                                            </NavigationMenuLink>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        {session && session.user?.role === 'admin' && (
                            <NavigationMenuItem>
                                <NavigationMenuLink href='/dashboard'>
                                    Dashboard
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        )}
                    </NavigationMenuList>
                </NavigationMenu>
                <div className="flex w-full max-w-sm items-center gap-2">
                    <Input
                        type="text"
                        placeholder="Search product..."
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch()
                            }
                        }}
                    />
                    <Button type="submit" variant="ghost" onClick={handleSearch}>
                        <Search />
                    </Button>
                </div>
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
                                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                                <DropdownMenuItem>Help</DropdownMenuItem>
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
