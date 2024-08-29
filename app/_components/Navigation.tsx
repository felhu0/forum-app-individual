'use client';

import * as React from 'react';
import Link from 'next/link';
import { FaFire } from 'react-icons/fa';
import { MdOutlineNewReleases } from 'react-icons/md';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const threadCategories: { title: string; href: string; description: string }[] =
    [
        {
            title: 'Software Development',
            href: '#',
            description:
                'Discussions on programming languages, development tools, and best practices.',
        },
        {
            title: 'Networking & Security',
            href: '#',
            description:
                'Topics related to network configuration and protection strategies.',
        },
        {
            title: 'Hardware & Gadgets',
            href: '#',
            description:
                'A space for sharing advice on building, upgrading, and troubleshooting hardware.',
        },
        {
            title: 'Cloud Computing',
            href: '#',
            description:
                'Conversations about cloud platforms, services, and architecture.',
        },
        {
            title: 'Tech News & Trends',
            href: '#',
            description:
                'Updates and discussions on the latest trends in the technology world.',
        },
    ];

export const Navigation = () => {
    return (
        <NavigationMenu className='w-full'>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>
                        Threads by Category
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
                            {threadCategories.map((threadCategory) => (
                                <ListItem
                                    key={threadCategory.title}
                                    title={threadCategory.title}
                                    href={threadCategory.href}>
                                    {threadCategory.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link
                        href='#'
                        legacyBehavior
                        passHref>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}>
                            <FaFire className='size-4 mr-2' />
                            Most Popular
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link
                        href='#'
                        legacyBehavior
                        passHref>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}>
                            <MdOutlineNewReleases className='size-5 mr-2' />
                            New & Trending
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
            <div className='flex gap-4'>
                <Link href='/log-in'>
                    <Button variant='outline'>Log in</Button>
                </Link>
                <Link href='/sign-up'>
                    <Button>Sign up</Button>
                </Link>
            </div>
        </NavigationMenu>
    );
};

const ListItem = React.forwardRef<
    React.ElementRef<'a'>,
    React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        className
                    )}
                    {...props}>
                    <div className='text-sm font-medium leading-none'>
                        {title}
                    </div>
                    <p className='line-clamp-2 text-xs leading-snug text-muted-foreground'>
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = 'ListItem';
