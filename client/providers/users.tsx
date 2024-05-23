'use client';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

type User = {
	user_id: string;
	username: string;
	image: string;
	created_at: string;
};

export type UserContextType = {
	selectedUser: User | null;
	handleSelectUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType>({
	selectedUser: null,
	handleSelectUser: () => {},
});

export function UserContextProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	const handleSelectUser = useCallback((user: User | null)=> {
		if (user) {
			localStorage.setItem(user.user_id, JSON.stringify(user));
		}
		setUser(user);
	}, [])

	return (
		<UserContext.Provider value={{ selectedUser: user, handleSelectUser }}>
			{children}
		</UserContext.Provider>
	);
}

export const useUserContext = (): UserContextType => useContext(UserContext);
