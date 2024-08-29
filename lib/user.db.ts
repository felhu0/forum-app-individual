import { db } from '@/firebase.config';
import { setDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import bcrypt from 'bcryptjs';
import { User } from '@/app/types/user';



export const addNewUser = async (user: User): Promise<void> => {
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        await setDoc(doc(db, 'users', user.id.toString()), {
            ...user,
            password: hashedPassword
        });
        
        toast.success('User added successfully!')

    } catch (error) {
        toast.error('Failed to add user: ' + (error as Error).message)
    }
}