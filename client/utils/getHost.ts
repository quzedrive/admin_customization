// data fetch from db via /api
export default async function getUser() {
  try {
    const res = await fetch('/api/getHost', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error('Failed to fetch data');

    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    console.error(err);
    return { success: false, error: err };
  }
}