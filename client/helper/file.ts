import { getCookies } from "./cookies";

const prepareHeaders = async () => {
  return {
    "content-type": "application/json",
    Cookie: await getCookies(),
  };
};
const serverUrl = process.env.SERVER_URL;

export async function uploadFile(file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${serverUrl}/file/upload-image`, {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        Cookie: (await prepareHeaders()).Cookie,
      },
    });

    const { publicId, url } = await res.json();

    return {
      publicId,
      url,
    };
  } catch (error) {
    throw error;
  }
}

export async function deleteImage(id: string) {
  try {
    await fetch(`${serverUrl}/file/delete-image`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Cookie: (await prepareHeaders()).Cookie,
      },
      credentials: "include",
      body: JSON.stringify({
        id,
      }),
    });
  } catch (error) {
    throw error;
  }
}
