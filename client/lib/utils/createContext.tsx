import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useRef,
	useSyncExternalStore,
} from 'react';

export default function createFastContext<Store>(initialValues: Store) {
	const useStoreData = () => {
		const store = useRef(initialValues);

		const subscribers = useRef(new Set<() => void>());

		const get = useCallback(() => store.current, []);

		const set = useCallback((value: any) => {
			store.current = { ...store.current, ...value };
			subscribers.current.forEach((callback) => callback());
		}, []);

		const subscribe = useCallback((callback: () => void) => {
			subscribers.current.add(callback);
			return () => subscribers.current.delete(callback);
		}, []);

		return { get, set, subscribe };
	};
	type UseStoreDataReturnType = ReturnType<typeof useStoreData>;
	const StoreContext = createContext<UseStoreDataReturnType | null>(null);

	function Provider({ children }: { children: ReactNode }) {
	
		return (
			<StoreContext.Provider value={useStoreData()}>
				{children}
			</StoreContext.Provider>
		);
	}

	function useStore<SelectorOutput>(
		selector: (store: Store) => SelectorOutput
	): [SelectorOutput, (value: Partial<Store>) => void] {
		const store = useContext(StoreContext);
		if (store === null) {
			throw new Error('Store not found');
		}

		const state = useSyncExternalStore(
			store.subscribe,
			() => selector(store.get()),
			() => selector(initialValues)
		);

		return [state, store.set];
	}

	return {
		Provider,
		useStore,
	};
}
