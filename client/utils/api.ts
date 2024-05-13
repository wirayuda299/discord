import { auth } from "@clerk/nextjs";
import { cookies } from "next/headers";

export class ApiRequest {
  private readonly serverEndpoint: string = process.env.SERVER_URL!;
  private userId: string | null = null;
  headers: { Cookie: string; "content-type": string } | undefined;

  private async prepareHeaders() {
    try {
      const { getToken, userId } = auth();

      const token = await getToken();
      if (token === null) throw new Error("Unauthorized");

      const headers = {
        Cookie: cookies().toString(),
        "content-type": "application/json",
      };
      this.userId = userId;
      this.headers = headers;
    } catch (error) {
      throw error;
    }
  }

  async post<U, K extends Record<string, U>>(
    url: string,
    body: K,
    tag?: string,
  ) {
    try {
      await this.prepareHeaders();
      const res = await fetch(this.serverEndpoint + url, {
        method: "POST",
        headers: this.getHeaders!,
        credentials: "include",
        ...(tag && { next: { tags: [tag] } }),
        body: JSON.stringify(body),
      });

      if (!res.headers.get("content-type")?.includes("application/json"))
        return;

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.messages);
      }
      return data;
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
