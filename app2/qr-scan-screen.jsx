const { Header, Card, Button, Badge } = window.MelittaZaikoDesignSystem_3f29a9;

const LOCS = window.ZaikoDB.LOCS;

function loadJsQR() {
  return new Promise((resolve, reject) => {
    if (window.jsQR) return resolve();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
    s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

function QRScanScreen() {
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const streamRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const lastCodeRef = React.useRef('');
  const lastCodeTimeRef = React.useRef(0);
  const [camState, setCamState] = React.useState('idle'); // idle | starting | live | error
  const [camError, setCamError] = React.useState('');
  const [manualCode, setManualCode] = React.useState('');
  const [flash, setFlash] = React.useState('');
  const [notFound, setNotFound] = React.useState('');
  const [loc, setLoc] = React.useState(window.ZaikoDB.getOperator());
  const [cart, setCart] = React.useState([]); // {key,no,name,locs,mode,qty,toLoc}
  const [saving, setSaving] = React.useState(false);
  const [connected, setConnected] = React.useState(window.ZaikoDB.isReady());
  const [allParts, setAllParts] = React.useState([]);

  React.useEffect(() => {
    let unsub = () => {};
    window.ZaikoDB.subscribeParts((data) => {
      setConnected(window.ZaikoDB.isReady());
      if (data) setAllParts(Object.entries(data).map(([key, p]) => ({ key, no: p.no || '', name: p.name, locs: p.locs || {} })));
    }).then((u) => { unsub = u; });
    return () => unsub();
  }, []);

  React.useEffect(() => {
    return () => stopCamera();
  }, []);

  function stopCamera() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
  }

  async function startCamera() {
    setCamState('starting'); setCamError('');
    try {
      await loadJsQR();
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setCamState('live');
      tick();
    } catch (e) {
      setCamState('error');
      setCamError(e.message || 'カメラにアクセスできませんでした');
    }
  }

  function tick() {
    const video = videoRef.current, canvas = canvasRef.current;
    if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) { rafRef.current = requestAnimationFrame(tick); return; }
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = window.jsQR(img.data, img.width, img.height);
    const now = Date.now();
    if (code && code.data && (code.data !== lastCodeRef.current || now - lastCodeTimeRef.current > 2000)) {
      lastCodeRef.current = code.data;
      lastCodeTimeRef.current = now;
      handleDecoded(code.data);
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function handleDecoded(text) {
    resolvePart(text.trim());
  }

  function resolvePart(code) {
    const found = allParts.find((p) => p.no === code || p.key === code);
    if (found) {
      addToCart(found);
      setNotFound('');
      setManualCode('');
    } else {
      setNotFound(code);
    }
  }

  function addToCart(found) {
    setCart((prev) => {
      if (prev.some((it) => it.key === found.key)) {
        setFlash(`${found.name} は既に追加されています`);
        setTimeout(() => setFlash(''), 1500);
        return prev;
      }
      setFlash(`✅ ${found.name} を追加しました`);
      setTimeout(() => setFlash(''), 1500);
      return [...prev, { ...found, mode: 'in', qty: 1, toLoc: '' }];
    });
  }

  function updateItem(key, patch) {
    setCart((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));
  }
  function removeItem(key) {
    setCart((prev) => prev.filter((it) => it.key !== key));
  }

  const allValid = cart.length > 0 && cart.every((it) => it.mode !== 'move' || (it.toLoc && it.toLoc !== loc));

  async function completeAll() {
    if (!allValid) return;
    setSaving(true);
    if (connected) {
      for (const it of cart) {
        if (it.mode === 'move') {
          await window.ZaikoDB.transferPart(it.key, it.name, loc, it.toLoc, it.qty);
        } else {
          await window.ZaikoDB.adjustStock(it.key, it.name, loc, it.mode, it.qty);
        }
      }
    }
    window.location.href = '在庫管理 ホーム画面.html';
  }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected={connected} title="QRスキャン" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card padding={12}>
          <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4 }}>作業場所（出庫元・入庫先）</label>
          <select value={loc} onChange={(e) => setLoc(e.target.value)} style={{
            width: '100%', height: 40, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
            fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', color: 'var(--color-text)', background: '#fff', padding: '0 8px',
          }}>
            {LOCS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </Card>

        <div style={{
          position: 'relative', width: '100%', aspectRatio: '4 / 3', borderRadius: 'var(--radius-xl)',
          background: 'var(--color-dark-panel)', overflow: 'hidden', flexShrink: 0,
        }}>
          <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: camState === 'live' ? 'block' : 'none' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {[
            { top: 20, left: 20, borderWidth: '4px 0 0 4px' }, { top: 20, right: 20, borderWidth: '4px 4px 0 0' },
            { bottom: 20, left: 20, borderWidth: '0 0 4px 4px' }, { bottom: 20, right: 20, borderWidth: '0 4px 4px 0' },
          ].map((pos, i) => (
            <div key={i} style={{ position: 'absolute', width: 40, height: 40, borderStyle: 'solid', borderColor: flash ? 'var(--color-success)' : '#fff', borderRadius: 6, ...pos }} />
          ))}
          {camState !== 'live' && (
            <button onClick={startCamera} style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 10, background: 'none', border: 'none', cursor: 'pointer', width: '100%',
            }}>
              <span style={{ fontSize: 34 }}>{camState === 'error' ? '⚠️' : '📷'}</span>
              <span style={{ color: '#fff', fontSize: 'var(--text-sm)', fontWeight: 600, textAlign: 'center', padding: '0 24px' }}>
                {camState === 'starting' ? 'カメラを起動しています…' : camState === 'error' ? (camError + '（タップで再試行）') : 'タップしてQRコードをスキャン（複数OK）'}
              </span>
            </button>
          )}
          {camState === 'live' && flash && (
            <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, background: 'rgba(22,163,74,0.9)', color: '#fff', borderRadius: 'var(--radius-md)', padding: '8px 12px', textAlign: 'center', fontSize: 'var(--text-sm)', fontWeight: 700 }}>
              {flash}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            value={manualCode} onChange={(e) => setManualCode(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && manualCode.trim()) resolvePart(manualCode.trim()); }}
            placeholder="部品番号を手入力（複数追加できます）"
            style={{
              flex: 1, height: 44, borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
              padding: '0 14px', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', color: 'var(--color-text)', background: '#fff',
            }}
          />
          <Button variant="outline" onClick={() => manualCode.trim() && resolvePart(manualCode.trim())}>追加</Button>
        </div>

        {notFound && (
          <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
            「{notFound}」に一致する部品が見つかりませんでした
          </div>
        )}

        {cart.length > 0 && (
          <React.Fragment>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)' }}>
              処理する部品（{cart.length}件）
            </div>
            {cart.map((it) => {
              const cur = it.locs[loc] || 0;
              const after = it.mode === 'in' ? cur + it.qty : cur - it.qty;
              const toCur = it.toLoc ? (it.locs[it.toLoc] || 0) : 0;
              return (
                <Card key={it.key} padding={12}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{it.no}</div>
                      <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</div>
                      <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)' }}>{loc}: 残り{cur}個</div>
                    </div>
                    <button onClick={() => removeItem(it.key)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: 18, cursor: 'pointer', flexShrink: 0 }}>✕</button>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <Button variant={it.mode === 'in' ? 'success' : 'outline'} size="sm" style={{ flex: 1, height: 44 }} onClick={() => updateItem(it.key, { mode: 'in' })}>📥 入庫</Button>
                    <Button variant={it.mode === 'out' ? 'danger' : 'outline'} size="sm" style={{ flex: 1, height: 44 }} onClick={() => updateItem(it.key, { mode: 'out' })}>📤 出庫</Button>
                    <Button style={{
                      flex: 1, height: 44, fontSize: 'var(--text-sm)', fontWeight: 700, border: `2px solid ${it.mode === 'move' ? 'var(--color-warning)' : 'var(--color-border)'}`,
                      background: it.mode === 'move' ? '#fff7ed' : '#fff', color: it.mode === 'move' ? 'var(--color-warning)' : 'var(--color-text)',
                      cursor: 'pointer', borderRadius: 'var(--radius-lg)', fontFamily: 'var(--font-sans)',
                    }} onClick={() => updateItem(it.key, { mode: 'move' })}>↔ 移動</Button>
                  </div>

                  {it.mode === 'move' && (
                    <select value={it.toLoc} onChange={(e) => updateItem(it.key, { toLoc: e.target.value })} style={{
                      width: '100%', height: 38, marginTop: 8, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                      fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', color: 'var(--color-text)', background: '#fff', padding: '0 8px',
                    }}>
                      <option value="">移動先を選択してください</option>
                      {LOCS.filter((l) => l !== loc).map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 10 }}>
                    <button onClick={() => updateItem(it.key, { qty: Math.max(1, it.qty - 1) })} style={{
                      width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)', fontSize: 18, fontWeight: 700, color: 'var(--color-primary)', cursor: 'pointer',
                    }}>−</button>
                    <span style={{ fontSize: 24, fontWeight: 700, minWidth: 36, textAlign: 'center' }}>{it.qty}</span>
                    <button onClick={() => updateItem(it.key, { qty: it.qty + 1 })} style={{
                      width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)', fontSize: 18, fontWeight: 700, color: 'var(--color-primary)', cursor: 'pointer',
                    }}>＋</button>
                  </div>

                  <div style={{ marginTop: 10, background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: 10, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                    {it.mode === 'move' && it.toLoc ? (
                      <React.Fragment>{loc}: {cur} → {cur - it.qty}　│　{it.toLoc}: {toCur} → {toCur + it.qty}</React.Fragment>
                    ) : (
                      <React.Fragment>{loc}: {cur} → {after}</React.Fragment>
                    )}
                  </div>
                </Card>
              );
            })}
          </React.Fragment>
        )}
      </div>

      <div style={{
        flex: '0 0 auto', padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
      }}>
        <Button variant="primary" disabled={!allValid || saving} style={{ width: '100%', height: 56, fontSize: 'var(--text-md)', opacity: allValid ? 1 : 0.5 }} onClick={completeAll}>
          {saving ? '処理中…' : cart.length > 0 ? `${cart.length}件をまとめて処理する` : '部品を追加してください'}
        </Button>
      </div>
    </div>
  );
}

window.QRScanScreen = QRScanScreen;
