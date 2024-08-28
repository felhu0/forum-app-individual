import { ThreadTable } from './_components/ThreadTable';

const LandingPage = () => {
    return (
        <>
            <header className='bg-slate-300'>
                <div className='pl-12 py-8 max-w-6xl mx-auto'>
                    <h1 className='text-base font-medium'>
                        Welcome to Threads
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        A community of developers
                    </p>
                </div>
            </header>
            <main className='px-6 my-8 max-w-6xl mx-auto'>
                <ThreadTable />
            </main>
        </>
    );
};

export default LandingPage;
