export async function getServerById(id: string) {
	if (!id) return;

	try {
		const res = await fetch(`http://localhost:3001/api/v1/servers/${id}`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'GET',
		});
		const server = await res.json();

		return server.data;
	} catch (error) {
		throw error;
	}
}
