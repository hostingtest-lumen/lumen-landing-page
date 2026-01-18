const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Read .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

const env = {};
envContent.split('\n').forEach(line => {
    if (line.includes('=')) {
        const [key, val] = line.split('=');
        env[key.trim()] = val.trim();
    }
});

const URL = env.ERPNEXT_URL;
const KEY = env.ERPNEXT_API_KEY;
const SECRET = env.ERPNEXT_API_SECRET;

console.log(`Testing Connection to: ${URL}`);
console.log(`API Key: ${KEY.substring(0, 5)}...`);
console.log(`API Secret: ${SECRET.substring(0, 5)}... (Updated: ${SECRET.startsWith('5a29')})`); // Check if it matches user input

async function testConnection() {
    try {
        // Dynamic import because node fetch might not be available in old node, but usually is in v18+
        // If fails, use native https/http module or assumes fetch (Node 18+)

        const headers = {
            'Authorization': `token ${KEY}:${SECRET}`,
            'Content-Type': 'application/json'
        };

        console.log('\n--- 1. Check Current User ---');
        const resUser = await fetch(`${URL}/api/method/frappe.auth.get_logged_user`, { headers });
        console.log(`Status: ${resUser.status}`);
        if (resUser.ok) {
            console.log('User:', await resUser.json());
        } else {
            console.log('Error:', await resUser.text());
        }

        console.log('\n--- 2. Check Customer Doctype Permissions ---');
        // Retrieve 1 customer
        const resCust = await fetch(`${URL}/api/resource/Customer?limit_page_length=1`, { headers });
        console.log(`Status: ${resCust.status}`);
        if (resCust.ok) {
            console.log('Success. Data:', await resCust.json());
        } else {
            console.log('Error:', await resCust.text());
        }

    } catch (e) {
        console.error("Fetch Exception:", e);
    }
}

testConnection();
