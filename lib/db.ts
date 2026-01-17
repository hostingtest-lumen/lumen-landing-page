import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'users.json');

export async function getUsers() {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
}

export async function addUser(user: any) {
    const users = await getUsers();
    users.push(user);
    await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2));
}
