const url = 'https://cqnvzlcrdhqjqjwkuick.supabase.co/rest/v1/rss_settings?id=eq.1';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxbnZ6bGNyZGhxanFqd2t1aWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NTQxODgsImV4cCI6MjA4ODMzMDE4OH0.nZKTWFmoQyCw3PEDZOWXu2IU4nraV8BpIhu-ZEIWBok';

fetch(url, {
  method: 'PATCH',
  headers: {
    'apikey': key,
    'Authorization': 'Bearer ' + key,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
  },
  body: JSON.stringify({ whatsapp_number: '5521964692374' })
}).then(res => {
  console.log('Update Status:', res.status);
}).catch(console.error);
