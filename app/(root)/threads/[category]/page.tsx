'use client'

import { ThreadsByCategory } from '@/app/_components/ThreadsByCategory';
import { ThreadCategory } from '@/app/types/thread';
import { useParams } from 'next/navigation';

const page = () => {
    const { category } = useParams();

    return <ThreadsByCategory currentCategory={category as ThreadCategory} />;
};

export default page;
