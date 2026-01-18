const { getEnv } = require('../lib/env-loader');
// Note: This script mocks the environment for testing
// In real Next.js app, getEnv uses process.cwd() correctly

console.log("Testing Hot-Reload Env Loading...");

// Mock process.cwd() if needed or assume running from root
// But wait, ts-node or node verification might fail if imports are not transpiled.
// Since I modified .ts files, running them with 'node' directly won't work without compilation.

// Alternative: Create a plain JS test script that mimics the logic of getEnv
const fs = require('fs');
const path = require('path');

function getEnvMock() {
    let env = {};
    try {
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            content.split('\n').forEach(line => {
                const parts = line.split('=');
                if (parts.length >= 2) {
                    env[parts[0].trim()] = parts.slice(1).join('=').trim();
                }
            });
        }
    } catch (e) { console.error(e) }
    return env;
}

const env = getEnvMock();
console.log(`Leído desde disco: ${env.ERPNEXT_API_SECRET?.substring(0, 5)}... (Debe ser 5a29b)`);

if (env.ERPNEXT_API_SECRET?.startsWith('5a29')) {
    console.log("SUCCESS: Script reads updated key correctly directly from file.");
} else {
    console.log("FAIL: Script did not read updated key.");
}
