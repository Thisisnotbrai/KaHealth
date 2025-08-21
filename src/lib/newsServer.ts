export async function fetchHealthNews(country?: string) {
  const apiKey = import.meta.env.VITE_NEWSDATA_API_KEY;

  // If no country is passed → worldwide
  let url = `https://newsdata.io/api/1/news?apikey=${apiKey}&category=health&language=en`;

  if (country && country !== "world") {
    url += `&country=${country}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch health news: ${res.status}`);
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching health news:", error);
    return [];
  }
}
