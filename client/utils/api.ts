import { prepareHeaders } from '@/helper/cookies';

export class ApiRequest {
	private readonly serverEndpoint: string = process.env.SERVER_URL!;

	async post<U, K extends Record<string, U>>(url: string, body: K) {
		try {
			const res = await fetch(this.serverEndpoint + url, {
				method: 'POST',
				headers: await prepareHeaders(),
				credentials: 'include',
				body: JSON.stringify(body),
			});

			if (!res.headers.get('content-type')?.includes('application/json'))
				return;

      const data = await res.json();
      
			if (!res.ok) throw new Error(data.messages);
			
			return data;
		} catch (error) {
			throw error;
		}
	}
}
