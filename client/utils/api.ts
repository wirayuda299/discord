import { prepareHeaders } from './cookies';

export class ApiRequest {
  private readonly serverEndpoint: string = process.env.SERVER_URL!;

  private async getConfig(method: string) {
    return {
      method,
      headers: await prepareHeaders(),
      credentials: 'include' as RequestCredentials,
    };
  }

  async update<U, K extends Record<string, U>>(
    url: string,
    body: K,
    method: string,
  ) {
    try {
      const config = await this.getConfig(method);
      const res = await fetch(this.serverEndpoint + url, {
        ...config,
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
  async getData<T>(query: string): Promise<T> {
    try {
      const config = await this.getConfig('GET');
      const res = await fetch(this.serverEndpoint + query, config);

      const result = await res.json();
      if (!res.ok) throw new Error(result.messages);

      return result.data;
    } catch (error) {
      throw error;
    }
  }
}
