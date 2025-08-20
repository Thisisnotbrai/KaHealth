export async function fetchHealthNews() {
  const apiKey = import.meta.env.VITE_NEWSDATA_API_KEY;
  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=ph&category=health&language=en`;


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
