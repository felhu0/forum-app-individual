import { User } from './user';

type ThreadCategory =
    | 'Software Development'
    | 'Networking & Security'
    | 'Hardware & Gadgets'
    | 'Cloud Computing'
    | 'Tech News & Trends';

type ThreadStatus = 'New' | 'Hot';

type Thread = {
    id: number;
    title: string;
    category: ThreadCategory;
    status?: ThreadStatus;
    creationDate: Date;
    description: string;
    creator: User;
};
