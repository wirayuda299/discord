export async function getGifs() {
  try {
    return await fetch(
      "https://g.tenor.com/v1/random?key=LIVDSRZULELA&limit=20&locale=id&contentfilter=high&media_filter=basic&ar_range=standard",
      {
        headers: { "content-type": "application/json" },
      },
    ).then((c) => c.json());
  } catch (error) {
    throw error;
  }
}
