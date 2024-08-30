'use client';

import { ThreadsByCategory } from '@/app/_components/ThreadsByCategory';
import { ThreadCategory } from '@/app/types/thread';
import { useParams } from 'next/navigation';

const CategoryPage = () => {
    const { category } = useParams();

    return <ThreadsByCategory currentCategory={category as ThreadCategory} />;
};

export default CategoryPage;
