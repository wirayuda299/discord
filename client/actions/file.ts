export async function uploadFile(file: File) {
	try {
		const formData = new FormData();
		formData.append('file', file);
		const res = await fetch('http://localhost:3001/api/v1/file/upload-image', {
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
		await fetch('http://localhost:3001/api/v1/file/delete-image', {
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
