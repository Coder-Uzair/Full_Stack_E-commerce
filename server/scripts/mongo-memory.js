// Starts an in-memory MongoDB and writes its URI to a file so other
// processes (seed, server) can connect to the SAME instance.
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'node:fs';

const mongod = await MongoMemoryServer.create({ instance: { port: 27017 } });
const uri = mongod.getUri();
fs.writeFileSync('/tmp/aurora-mongo-uri.txt', uri);
console.log('IN-MEMORY MONGO URI:', uri);
console.log('READY');

process.on('SIGTERM', async () => { await mongod.stop(); process.exit(0); });
process.on('SIGINT', async () => { await mongod.stop(); process.exit(0); });
// keep alive
setInterval(() => {}, 1 << 30);
