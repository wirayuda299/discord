export async function uploadFile(file: File) {
	try {
		const formData = new FormData();
		formData.append('file', file);
		const res = await fetch('http://localhost:3001/api/v1/upload/image', {
			method: 'POST',
			body: formData,
		});

		const data = await res.json();
		return data as {
			publicId: string;
			url: string;
		};
	} catch (error) {
		throw error;
	}
}
export async function deleteImage(id: string) {
	try {
		await fetch('http://localhost:3001/api/v1/upload/delete', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify({
				id,
			}),
		});
	} catch (error) {
		throw error;
	}
}
