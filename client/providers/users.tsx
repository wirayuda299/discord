'use client';
import {
	Dispatch,
	SetStateAction,
	createContext,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from 'react';

type User = {
	user_id: string;
	username: string;
	image: string;
	created_at: string;
};

type UserContextType = {
	user: User | null;
	setUser: Dispatch<SetStateAction<User | null>>;
};

const initialValues: UserContextType = {
	user: null,
	setUser: () => {},
};

const UserContext = createContext<UserContextType>(initialValues);

export function UserContextProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	const memoizedvalue = useMemo(() => user, [user]);

	return (
		<UserContext.Provider value={{ user: memoizedvalue, setUser }}>
			{children}
		</UserContext.Provider>
	);
}

export const useUser = () => useContext(UserContext);
