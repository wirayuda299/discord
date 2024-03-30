import { auth } from '@clerk/nextjs';

export class ApiRequest {
	private readonly serverEndpoint: string = process.env.SERVER_URL!;
	private userId: string | null = null;
	private headers: {
		Authorization: string;
		'Content-type': string;
	} | null = null;

	private async prepareHeaders() {
		try {
			const { getToken, userId } = auth();

			const token = await getToken();
			if (token === null) throw new Error('Unauthorized');

			const headers = {
				Authorization: `Bearer ${token}`,
				'Content-type': 'application/json',
			};
			this.headers = headers;
			this.userId = userId;
		} catch (error) {
			throw error;
		}
	}

	async get<T>(query: string, tag?: string) {
		await this.prepareHeaders();
		const res = await fetch(this.serverEndpoint + query, {
			method: 'GET',
			headers: this.getHeaders!,
			credentials: 'include',
			...(tag && {
				next: {
					tags: [tag],
				},
			}),
		});

		if (!res.headers.get('content-type')?.includes('application/json')) {
			return;
		}

		const data = await res.json();
		if (res.status === 400) throw new Error(data.messages);
		return data.data as T;
	}

	async post<T, U, K extends Record<string, U>>(
		url: string,
		body: K,
		tag?: string
	) {
		try {
			await this.prepareHeaders();
			const res = await fetch(this.serverEndpoint + url, {
				method: 'POST',
				headers: this.getHeaders!,
				credentials: 'include',
				...(tag && { next: { tags: [tag] } }),
				body: JSON.stringify(body),
				cache: 'no-cache',
			});

			if (!res.headers.get('content-type')?.includes('application/json')) {
				return;
			}
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.messages);
			}

			return data as T;
		} catch (error) {
			throw error;
		}
	}

	async patch<T, U, K extends Record<string, U>>(
		url: string,
		body: K,
		tag?: string
	) {
		try {
			await this.prepareHeaders();
			const res = await fetch(this.serverEndpoint + url, {
				method: 'PATCH',
				headers: this.getHeaders!,
				credentials: 'include',
				...(tag && { next: { tags: [tag] } }),
				body: JSON.stringify(body),
			});

			if (!res.headers.get('content-type')?.includes('application/json')) {
				return;
			}

			const data = await res.json();

			if (data.error) throw new Error(data.message);
			return data.data as T;
		} catch (error) {
			throw error;
		}
	}

	async delete<T, U, K extends Record<string, U>>(url: string, body: K) {
		try {
			await this.prepareHeaders();
			const res = await fetch(this.serverEndpoint + url, {
				method: 'DELETE',
				headers: this.getHeaders!,
				credentials: 'include',
				body: JSON.stringify(body),
			});

			if (!res.headers.get('content-type')?.includes('application/json')) {
				return;
			}

			const data = await res.json();

			if (data.error) throw new Error(data.message);
			return data as T;
		} catch (error) {
			throw error;
		}
	}

	get getUserId(): string {
		return this.userId as string;
	}

	get getHeaders() {
		return this.headers;
	}
}
