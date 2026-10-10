import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import handler from '../api/write.js';
const root=resolve('public');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
const server=createServer(async(req,res)=>{
const pathname=new URL(req.url,'http://localhost').pathname;
if(pathname==='/api/write'){
let text='';try{for await(const chunk of req){text+=chunk;if(text.length>100000){res.writeHead(413);res.end('Request too large');return;}}
req.body=text?JSON.parse(text):{};res.status=function(code){this.statusCode=code;return this;};res.json=function(data){this.setHeader('Content-Type','application/json');this.end(JSON.stringify(data));};
await handler(req,res);}catch{res.writeHead(400);res.end('Invalid request');}return;
}
const path=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
const relative=path.slice(root.length);if(!path.startsWith(root)||!(relative.startsWith('/')||relative.startsWith('\\'))){res.writeHead(403);res.end('Forbidden');return;}
try{const file=await readFile(path);res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream'});res.end(file);}catch{res.writeHead(404);res.end('Not found');}
});
server.listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('Amber Writer ready at http://127.0.0.1:'+(process.env.PORT||4173)));
