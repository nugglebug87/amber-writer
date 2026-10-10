export const MOODS = ['Reflective','Warm','Bold','Vulnerable','Playful','Hopeful','Melancholic','Poetic','Grounded','Fierce','Tender','Witty'];
export const STYLES = {
Reflective:'Explore the feeling, then find the meaning.',
Storyteller:'Begin with a moment. Let the point emerge.',
Analytical:'Build a clear argument, one thought at a time.',
Intuitive:'Follow associations, images, and instinct.'
};
export const defaults = () => ({version:1,samples:[],drafts:[],dna:{tone:'Warm and candid',rhythm:'Mixed, natural rhythm',signature:'',avoid:''},thinking:{style:'Reflective',notes:''},workspace:{brief:'',format:'Personal reflection',length:'Medium',moods:['Reflective','Warm'],instructions:'',output:'',source:'YOUR WRITING',draftId:null}});
const str=(x,max)=>typeof x==='string'&&x.length<=max;
const formats=['Personal reflection','Social post','Email','Letter','Story','Journal entry','Essay'];
export function validState(s){
return !!s && s.version===1 && Array.isArray(s.samples) && s.samples.length<=100 && s.samples.every(x=>str(x.id,100)&&str(x.title,120)&&str(x.text,12000)&&str(x.created,100))
&& Array.isArray(s.drafts) && s.drafts.length<=500 && s.drafts.every(x=>str(x.id,100)&&str(x.title,120)&&str(x.text,30000)&&str(x.updated,100)&&validWorkspace(x.workspace))
&& s.dna && ['tone','rhythm','signature','avoid'].every(k=>str(s.dna[k],2000))
&& s.thinking && Object.hasOwn(STYLES,s.thinking.style) && str(s.thinking.notes,2000) && validWorkspace(s.workspace);
}
export function validWorkspace(w){return !!w && str(w.brief,12000)&&formats.includes(w.format)&&['Short','Medium','Long'].includes(w.length)&&Array.isArray(w.moods)&&w.moods.length<=MOODS.length&&w.moods.every(m=>MOODS.includes(m))&&new Set(w.moods).size===w.moods.length&&str(w.instructions,2000)&&str(w.output,30000)&&str(w.source,100)&&(w.draftId===null||str(w.draftId,100));}
export function demoDraft(w){
const notes=w.brief.trim();
const mood=w.moods.length?w.moods.join(' + '):'Unspecified';
const header='[DEMO TEMPLATE · '+mood+' · '+w.length+']';
if(w.format==='Email')return header+'\n\nSubject: '+notes.split(/[\n.!?]/)[0].slice(0,80)+'\n\nHi [name],\n\n'+notes+'\n\n[Add the next step you want the reader to take.]\n\nBest,\n[Your name]';
if(w.format==='Letter')return header+'\n\nDear [name],\n\n'+notes+'\n\n[Add what you want them to understand.]\n\nWith care,\n[Your name]';
if(w.format==='Social post')return header+'\n\n'+notes+'\n\n[Add a closing thought or a question for your readers.]';
if(w.format==='Story')return header+'\n\n'+notes+'\n\n[Set the scene. What changed? What happened next?]\n\n[Close with the detail that stays with you.]';
return header+'\n\n'+notes+'\n\n[What is underneath this thought?]\n\n[What do you want to carry forward?]';
}
export function makePayload(state){
let remaining=12000;
const samples=state.samples.map(s=>{const text=s.text.slice(0,remaining);remaining-=text.length;return text;}).filter(Boolean);
return {brief:state.workspace.brief,format:state.workspace.format,length:state.workspace.length,moods:state.workspace.moods,instructions:state.workspace.instructions,dna:state.dna,thinking:state.thinking,samples};
}
export const countWords = text => text.trim()?text.trim().split(/\s+/).length:0;