import { Navigation } from '../_components/Navigation';

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Navigation />
            {children}
        </>
    );
};

export default PublicLayout;
