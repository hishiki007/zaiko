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

function loadTemplates(){
  try{ const saved=JSON.parse(localStorage.getItem('inspTemplates')); return saved && saved.length ? saved : DEFAULT_TEMPLATES; }catch(e){ return DEFAULT_TEMPLATES; }
}
function persistTemplates(t){ localStorage.setItem('inspTemplates', JSON.stringify(t)); }
function resetTemplates(){ localStorage.removeItem('inspTemplates'); }

window.InspData={ TYPES, DEFAULT_TEMPLATES, loadTemplates, persistTemplates, resetTemplates };
})();
