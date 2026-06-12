/**
 * Convenience launcher for environments without a local MongoDB.
 * Boots an in-memory MongoDB on port 27017, seeds it, then starts the API.
 * For production / normal local dev, use a real MongoDB and `npm run dev`.
 */
import { MongoMemoryServer } from 'mongodb-memory-server';
import { spawn } from 'node:child_process';

const mongod = await MongoMemoryServer.create({ instance: { port: 27017 } });
console.log('🧪 In-memory MongoDB:', mongod.getUri());

const run = (cmd, args) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true });
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });

await run('node', ['scripts/seed.js']);
const api = spawn('node', ['server.js'], { stdio: 'inherit', shell: true });

const stop = async () => {
  api.kill();
  await mongod.stop();
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
