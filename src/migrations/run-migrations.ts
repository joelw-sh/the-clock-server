import fs from 'fs';
import path from 'path';
import { getPool, initDb } from '../db/connection';

async function run() {
    await initDb();
    const pool = getPool();
    const migrationsDir = path.resolve(__dirname, '../../migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
    for (const f of files) {
        const sql = fs.readFileSync(path.join(migrationsDir, f), 'utf8');
        console.log('Running', f);
        await pool.query(sql);
    }
    console.log('Migrations done');
    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});