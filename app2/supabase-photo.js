(function(){
const URL='https://zgrnbrlwkvhgrcupxbcw.supabase.co',KEY='sb_publishable_Txr0WEvedrqOXo_jtQGzaA_1xzsc2K4',BUCKET='parts-photos';
async function uploadPhoto(key,file){
  const path=`${key}/${Date.now()}_${file.name}`;
  const res=await fetch(`${URL}/storage/v1/object/${BUCKET}/${path}`,{
    method:'POST',
    headers:{'Authorization':`Bearer ${KEY}`,'apikey':KEY,'Content-Type':file.type||'application/octet-stream','x-upsert':'true'},
    body:file,
  });
  if(!res.ok){const t=await res.text();throw new Error('アップロード失敗: '+t);}
  return `${URL}/storage/v1/object/public/${BUCKET}/${path}`;
}
async function listFolder(prefix){
  const res=await fetch(`${URL}/storage/v1/object/list/${BUCKET}`,{
    method:'POST',
    headers:{'Authorization':`Bearer ${KEY}`,'apikey':KEY,'Content-Type':'application/json'},
    body:JSON.stringify({prefix,limit:1000,sortBy:{column:'name',order:'asc'}}),
  });
  if(!res.ok){const t=await res.text();throw new Error('一覧取得失敗: '+t);}
  return res.json();
}
async function listAllFiles(prefix){
  const entries=await listFolder(prefix);
  let files=[];
  for(const e of entries){
    const full=prefix?`${prefix}/${e.name}`:e.name;
    if(e.id===null){files=files.concat(await listAllFiles(full));}
    else{files.push(full);}
  }
  return files;
}
function baseName(path){
  const file=path.split('/').pop();
  return file.replace(/\.[^.]+$/,'');
}
async function syncPhotosByPartNo(){
  const files=await listAllFiles('');
  const parts=await new Promise((resolve)=>{window.ZaikoDB.subscribeParts((data)=>resolve(data||{})).then((unsub)=>unsub());});
  const byNo={};
  for(const [key,p] of Object.entries(parts)){if(p.no)byNo[p.no]=key;}
  let matched=0;
  for(const path of files){
    const no=baseName(path);
    const key=byNo[no];
    if(key){
      await window.ZaikoDB.setPhoto(key,`${URL}/storage/v1/object/public/${BUCKET}/${path}`);
      matched++;
    }
  }
  return {total:files.length,matched};
}
window.SupaPhoto={uploadPhoto,listAllFiles,syncPhotosByPartNo};
})();

