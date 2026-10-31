import 'dotenv/config';
import { pathToFileURL } from 'node:url';
import { createApp } from './app.js';
import { loadConfig } from './config.js';
export function startServer() { const config=loadConfig(process.env); return createApp(config).listen(config.port,()=>console.log(JSON.stringify({timestamp:new Date().toISOString(),level:'info',code:'SERVER_STARTED',port:config.port}))); }
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) startServer();
