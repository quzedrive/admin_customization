// posting form data to db via /api
import type { UserForm } from '@/types/user'

export default async function sendData( formData : UserForm ) {

  try {
    const res = await fetch('/api/sendUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error('Failed to submit');

    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    console.error(err);
    return { success: false, error: err };
  }
}


