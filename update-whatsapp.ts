import { updateSettings, getSettings } from './src/services/settings.ts';

async function updateWhatsApp() {
  console.log('Fetching current settings...');
  const settings = await getSettings();
  console.log('Current settings:', settings);
  
  settings.whatsapp_number = '5521964692374';
  
  console.log('Updating settings to new WhatsApp number...');
  await updateSettings(settings);
  
  console.log('Successfully updated WhatsApp number in Supabase.');
}

updateWhatsApp().catch(console.error);
