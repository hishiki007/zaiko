(function(){
const CFG_KEY='firebaseConfig',OP_KEY='currentOperator';
let db=null,ready=false,sdkP=null;
function loadSDK(){
  if(sdkP)return sdkP;
  sdkP=new Promise((resolve,reject)=>{
    const s1=document.createElement('script');
    s1.src='https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js';
    s1.onload=()=>{
      const s2=document.createElement('script');
      s2.src='https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js';
      s2.onload=resolve;s2.onerror=reject;document.head.appendChild(s2);
    };
    s1.onerror=reject;document.head.appendChild(s1);
  });
  return sdkP;
}
function getConfig(){try{return JSON.parse(localStorage.getItem(CFG_KEY));}catch(e){return null;}}
function saveConfig(cfg){localStorage.setItem(CFG_KEY,JSON.stringify(cfg));db=null;ready=false;}
function clearConfig(){localStorage.removeItem(CFG_KEY);db=null;ready=false;}
async function init(){
  const cfg=getConfig();
  if(!cfg||!cfg.apiKey||!cfg.databaseURL)return null;
  if(db)return db;
  await loadSDK();
  const app=window.firebase.apps&&window.firebase.apps.length?window.firebase.apps[0]:window.firebase.initializeApp(cfg);
  db=window.firebase.database();
  ready=true;
  return db;
}
function isReady(){return ready;}
function getOperator(){return localStorage.getItem(OP_KEY)||'不明';}
function setOperator(name){localStorage.setItem(OP_KEY,name);}
async function subscribeParts(cb){
  const d=await init();if(!d){cb(null);return ()=>{};}
  const ref=d.ref('parts');const h=(s)=>cb(s.val()||{});ref.on('value',h);return ()=>ref.off('value',h);
}
async function subscribePart(key,cb){
  const d=await init();if(!d){cb(null);return ()=>{};}
  const ref=d.ref('parts/'+key);const h=(s)=>cb(s.val());ref.on('value',h);return ()=>ref.off('value',h);
}
async function addPart({no,name,locs}){
  const d=await init();if(!d)throw new Error('not connected');
  const ref=d.ref('parts').push();
  await ref.set({no:no||'',name,locs:locs||{},updatedAt:Date.now()});
  await addHistory({type:'add',key:ref.key,name,detail:'新規追加'});
  return ref.key;
}
async function updatePart(key,{no,name}){
  const d=await init();if(!d)throw new Error('not connected');
  await d.ref('parts/'+key).update({no,name,updatedAt:Date.now()});
  await addHistory({type:'edit',key,name,detail:'情報を更新'});
}
async function setPhoto(key,url){
  const d=await init();if(!d)throw new Error('not connected');
  await d.ref('parts/'+key+'/photo').set(url);
}
async function deletePart(key,name){
  const d=await init();if(!d)throw new Error('not connected');
  await d.ref('parts/'+key).remove();
  await addHistory({type:'del',key,name,detail:'削除'});
}
async function adjustStock(key,name,loc,mode,qty){
  const d=await init();if(!d)throw new Error('not connected');
  const snap=await d.ref(`parts/${key}/locs/${loc}`).once('value');
  const cur=snap.val()||0;
  const next=mode==='in'?cur+qty:mode==='out'?cur-qty:qty;
  await d.ref(`parts/${key}/locs/${loc}`).set(next);
  await d.ref(`parts/${key}/updatedAt`).set(Date.now());
  const label=mode==='in'?'入庫':mode==='out'?'出庫':'直接指定';
  await addHistory({type:mode,key,name,detail:`${label} ${loc}: ${cur}→${next}`});
  return next;
}
async function transferPart(key,name,from,to,qty){
  const d=await init();if(!d)throw new Error('not connected');
  const fSnap=await d.ref(`parts/${key}/locs/${from}`).once('value');
  const tSnap=await d.ref(`parts/${key}/locs/${to}`).once('value');
  const fq=fSnap.val()||0,tq=tSnap.val()||0;
  if(qty>fq)throw new Error('移動元の在庫数が不足しています');
  const upd={};
  upd[`parts/${key}/locs/${from}`]=fq-qty;
  upd[`parts/${key}/locs/${to}`]=tq+qty;
  upd[`parts/${key}/updatedAt`]=Date.now();
  await d.ref().update(upd);
  await addHistory({type:'move',key,name,detail:`${from}→${to} ${qty}個移動`});
}
async function addHistory({type,key,name,detail}){
  const d=await init();if(!d)return;
  let no='';
  if(key){try{const s=await d.ref('parts/'+key+'/no').once('value');no=s.val()||'';}catch(e){}}
  const ref=d.ref('history').push();
  await ref.set({type,key:key||null,name,no,detail,operator:getOperator(),time:Date.now()});
}
async function subscribeHistory(cb,limit){
  const d=await init();if(!d){cb([]);return ()=>{};}
  const ref=d.ref('history').limitToLast(limit||50);
  const h=(s)=>{const v=s.val()||{};cb(Object.values(v).sort((a,b)=>b.time-a.time));};
  ref.on('value',h);return ()=>ref.off('value',h);
}
async function dedupeParts(){
  const d=await init();if(!d)throw new Error('not connected');
  const snap=await d.ref('parts').once('value');
  const val=snap.val()||{};
  const groups={};
  for(const [key,p] of Object.entries(val)){
    const sig=(p.no||'')||('name:'+p.name);
    if(!groups[sig])groups[sig]=[];
    groups[sig].push(key);
  }
  const toRemove=[];
  for(const keys of Object.values(groups)){
    if(keys.length>1)toRemove.push(...keys.slice(1));
  }
  for(const key of toRemove){await d.ref('parts/'+key).remove();}
  return toRemove.length;
}
window.ZaikoDB={LOCS:['シンワ倉庫','アラン','ゆーや','しゅん','たくや'],getConfig,saveConfig,clearConfig,init,isReady,getOperator,setOperator,subscribeParts,subscribePart,addPart,updatePart,deletePart,adjustStock,transferPart,addHistory,subscribeHistory,dedupeParts,setPhoto};
})();
