(function(){
const TYPES=['半年点検','1年点検','1年半点検','2年点検','2年半点検','3年点検','3年半点検','4年点検','4年半点検','5年点検','5年半点検','6年点検','6年半点検','7年点検','7年半点検','8年点検','8年半点検'];
const YEARLY=['1年点検','2年点検','3年点検','4年点検','5年点検','6年点検','7年点検','8年点検'];

const XT_FULL_RULES=[
  { no:'27313', types: TYPES },
  { no:'44548', types:['1年半点検','3年点検','4年半点検','6年点検','7年半点検'] },
  { no:'44549', types:['2年半点検','4年半点検','6年半点検','8年半点検'] },
  { no:'44550', types:['2年半点検','5年点検','7年半点検'] },
  { no:'48841', types: YEARLY },
  { no:'580300', altNo:'580301', types: YEARLY },
  { no:'33344', types:['5年点検'] },
  { no:'2503033', types:['5年点検'] },
  { no:'22345', types:['2年半点検','5年点検','8年点検'] },
  { no:'22346', types:['2年半点検','5年点検','8年点検'] },
];
const XT_BLACK_RULES=[
  { no:'27313', types: TYPES },
  { no:'48841', types: YEARLY },
  { no:'580300', altNo:'580301', types: YEARLY },
  { no:'44552', types:['1年半点検','3年点検','4年半点検','6年点検','7年半点検'] },
  { no:'44553', types:['2年点検','4年点検','6年点検','8年点検'] },
  { no:'22345', types:['2年半点検','5年点検','8年点検'] },
  { no:'22346', types:['2年半点検','5年点検','8年点検'] },
];

function expand(machine, rules){
  let id=0;
  return TYPES.map((t)=>{
    const parts=rules.filter((r)=>r.types.includes(t)).map((r)=>({no:r.no,qty:1,altNo:r.altNo}));
    return parts.length ? { id: machine+'-'+(id++), machine, inspType:t, parts } : null;
  }).filter(Boolean);
}

const LNG_FULL_PLACEHOLDER=[
  { id:'lngf-1', machine:'LNGフル', inspType:'半年点検', parts:[{no:'43220',qty:1},{no:'48791',qty:1},{no:'27313',qty:1}] },
];
const LNG_BLACK_PLACEHOLDER=[
  { id:'lngb-1', machine:'LNGブラック', inspType:'半年点検', parts:[{no:'43220',qty:1},{no:'48791',qty:1},{no:'27313',qty:1}] },
];

const DEFAULT_TEMPLATES=[...expand('XTフル',XT_FULL_RULES),...expand('XTブラック',XT_BLACK_RULES),...LNG_FULL_PLACEHOLDER,...LNG_BLACK_PLACEHOLDER];

function normalizeTemplates(list){
  let changed=false;
  const RENAME={'半年':'半年点検','1年':'1年点検','1年半':'1年半点検','2年':'2年点検','2年半':'2年半点検','3年':'3年点検','3年半':'3年半点検','4年':'4年点検','4年半':'4年半点検','5年':'5年点検','5年半':'5年半点検','6年':'6年点検','6年半':'6年半点検','7年':'7年点検','7年半':'7年半点検','8年':'8年点検','8年半':'8年半点検'};
  let next=list.map((t)=>{
    if(RENAME[t.inspType]){changed=true;return {...t, inspType:RENAME[t.inspType]};}
    return t;
  });
  next=next.map((t)=>{
    const cleanParts=t.parts.filter((p)=>p.no || p.name);
    if(cleanParts.length!==t.parts.length){changed=true;return {...t, parts:cleanParts};}
    return t;
  });
  const merged=[];
  const seen=new Map();
  for(const t of next){
    const k=t.machine+'|'+t.inspType;
    if(seen.has(k)){
      changed=true;
      const existing=merged[seen.get(k)];
      const partKeys=new Set(existing.parts.map((p)=>p.no||p.name));
      const extra=t.parts.filter((p)=>!partKeys.has(p.no||p.name));
      existing.parts=[...existing.parts, ...extra];
    } else {
      seen.set(k, merged.length);
      merged.push({...t});
    }
  }
  return changed ? merged : null;
}
function patchXtBlack27313(list){
  let changed=false;
  const next=list.map((t)=>{
    if(t.machine!=='XTブラック')return t;
    if(t.parts.some((p)=>p.no==='27313'))return t;
    changed=true;
    return {...t, parts:[{no:'27313',qty:1}, ...t.parts]};
  });
  return changed ? next : null;
}
function patchXtOrder(list){
  const MACHINE_ORDER=['XTフル','XTブラック','LNGフル','LNGブラック'];
  const grouped=MACHINE_ORDER.flatMap((m)=>list.filter((t)=>t.machine===m).slice().sort((a,b)=>TYPES.indexOf(a.inspType)-TYPES.indexOf(b.inspType)));
  const rest=list.filter((t)=>!MACHINE_ORDER.includes(t.machine));
  const next=[...grouped, ...rest];
  const changed=JSON.stringify(next.map((t)=>t.id))!==JSON.stringify(list.map((t)=>t.id));
  return changed ? next : null;
}
function loadTemplates(){
  try{ const saved=JSON.parse(localStorage.getItem('inspTemplates')); return saved && saved.length ? saved : DEFAULT_TEMPLATES; }catch(e){ return DEFAULT_TEMPLATES; }
}
function persistTemplates(t){
  localStorage.setItem('inspTemplates', JSON.stringify(t));
  if(window.ZaikoDB && window.ZaikoDB.isReady()){ window.ZaikoDB.saveInspTemplates(t).catch(()=>{}); }
}
function resetTemplates(){
  localStorage.removeItem('inspTemplates');
  if(window.ZaikoDB && window.ZaikoDB.isReady()){ window.ZaikoDB.saveInspTemplates(DEFAULT_TEMPLATES).catch(()=>{}); }
}
function subscribeTemplates(cb){
  function handle(list){
    const patchedNorm=normalizeTemplates(list);
    const afterNorm=patchedNorm || list;
    const patchedParts=patchXtBlack27313(afterNorm);
    const afterParts=patchedParts || afterNorm;
    const patchedOrder=patchXtOrder(afterParts);
    const final=patchedOrder || afterParts;
    if(patchedNorm || patchedParts || patchedOrder){ persistTemplates(final); }
    cb(final);
  }
  if(!(window.ZaikoDB && window.ZaikoDB.subscribeInspTemplates)){ handle(loadTemplates()); return Promise.resolve(()=>{}); }
  return window.ZaikoDB.subscribeInspTemplates((list)=>{
    if(list && list.length){ localStorage.setItem('inspTemplates', JSON.stringify(list)); handle(list); }
    else {
      window.ZaikoDB.seedInspTemplatesIfEmpty(loadTemplates()).catch(()=>{});
      handle(loadTemplates());
    }
  });
}

window.InspData={ TYPES, DEFAULT_TEMPLATES, loadTemplates, persistTemplates, resetTemplates, subscribeTemplates };
})();
