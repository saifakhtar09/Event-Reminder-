import webpush from 'web-push';

console.log('\n=== Generating VAPID Keys for Push Notifications ===\n');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('Add these to your .env file:\n');
console.log(`VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
console.log(`VAPID_SUBJECT=mailto:your-email@example.com`);
console.log('\nDon\'t forget to replace the email in VAPID_SUBJECT!\n');
