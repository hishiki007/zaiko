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

function StepperButton({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: 56, height: 56, borderRadius: '50%', border: '1px solid var(--color-border)',
      background: 'var(--color-surface)', fontSize: 26, fontWeight: 700,
      color: disabled ? 'var(--color-text-faint)' : 'var(--color-primary)',
      cursor: disabled ? 'default' : 'pointer', fontFamily: 'var(--font-sans)',
      boxShadow: 'var(--shadow-card)', flexShrink: 0,
    }}>{children}</button>
  );
}

function QRScanScreen() {
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const streamRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const [camState, setCamState] = React.useState('idle'); // idle | starting | live | error
  const [camError, setCamError] = React.useState('');
  const [manualCode, setManualCode] = React.useState('');
  const [scanned, setScanned] = React.useState(false);
  const [part, setPart] = React.useState(null);
  const [notFound, setNotFound] = React.useState('');
  const [loc, setLoc] = React.useState(window.ZaikoDB.getOperator());
  const [mode, setMode] = React.useState('in');
  const [qty, setQty] = React.useState(1);
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
    if (code && code.data) {
      handleDecoded(code.data);
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function handleDecoded(text) {
    stopCamera();
    setCamState('idle');
    resolvePart(text.trim());
  }

  function resolvePart(code) {
    const found = allParts.find((p) => p.no === code || p.key === code);
    if (found) {
      setPart(found); setNotFound(''); setScanned(true);
    } else {
      setNotFound(code);
      setScanned(false); setPart(null);
    }
  }

  var cur = part ? (part.locs[loc] || 0) : 0;
  const after = mode === 'in' ? cur + qty : cur - qty;

  async function complete() {
    if (!part) return;
    setSaving(true);
    if (part.key && connected) { await window.ZaikoDB.adjustStock(part.key, part.name, loc, mode, qty); }
    window.location.href = '在庫管理 ホーム画面.html';
  }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected={connected} title="QRスキャン" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
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
            <div key={i} style={{ position: 'absolute', width: 40, height: 40, borderStyle: 'solid', borderColor: scanned ? 'var(--color-success)' : '#fff', borderRadius: 6, ...pos }} />
          ))}
          {camState !== 'live' && (
            <button onClick={startCamera} style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 10, background: 'none', border: 'none', cursor: 'pointer', width: '100%',
            }}>
              <span style={{ fontSize: 34 }}>{scanned ? '✅' : camState === 'error' ? '⚠️' : '📷'}</span>
              <span style={{ color: '#fff', fontSize: 'var(--text-sm)', fontWeight: 600, textAlign: 'center', padding: '0 24px' }}>
                {camState === 'starting' ? 'カメラを起動しています…' : camState === 'error' ? (camError + '（タップで再試行）') : scanned ? '読み取りが完了しました' : 'タップしてQRコードをスキャン'}
              </span>
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            value={manualCode} onChange={(e) => setManualCode(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && manualCode.trim()) resolvePart(manualCode.trim()); }}
            placeholder="部品番号を手入力（カメラが使えない場合）"
            style={{
              flex: 1, height: 44, borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
              padding: '0 14px', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', color: 'var(--color-text)', background: '#fff',
            }}
          />
          <Button variant="outline" onClick={() => manualCode.trim() && resolvePart(manualCode.trim())}>検索</Button>
        </div>

        {notFound && (
          <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
            「{notFound}」に一致する部品が見つかりませんでした
          </div>
        )}

        {scanned && part && (
          <React.Fragment>
            <Card>
              <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{part.no}</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 6 }}>{part.name}</div>
              <select value={loc} onChange={(e) => setLoc(e.target.value)} style={{
                height: 36, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', color: 'var(--color-text)', background: '#fff', padding: '0 8px',
              }}>
                {LOCS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <span style={{ marginLeft: 10, fontSize: 'var(--text-md)', fontWeight: 700 }}>残り{cur}個</span>
            </Card>

            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant={mode === 'in' ? 'success' : 'outline'} style={{ flex: 1, height: 56, fontSize: 'var(--text-md)' }} onClick={() => setMode('in')}>📥 入庫 ＋</Button>
              <Button variant={mode === 'out' ? 'danger' : 'outline'} style={{ flex: 1, height: 56, fontSize: 'var(--text-md)' }} onClick={() => setMode('out')}>📤 出庫 −</Button>
            </div>

            <Card>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 10, textAlign: 'center' }}>数量を入力してください</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                <StepperButton onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>−</StepperButton>
                <span style={{ fontSize: 40, fontWeight: 700, minWidth: 56, textAlign: 'center' }}>{qty}</span>
                <StepperButton onClick={() => setQty((q) => q + 1)}>＋</StepperButton>
              </div>
              <div style={{ marginTop: 14, background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: 12, fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                {loc}: {cur} → {after}
              </div>
            </Card>
          </React.Fragment>
        )}
      </div>

      <div style={{
        flex: '0 0 auto', padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
      }}>
        <Button variant={mode === 'in' ? 'success' : 'danger'} disabled={!scanned || saving} style={{ width: '100%', height: 56, fontSize: 'var(--text-md)', opacity: scanned ? 1 : 0.5 }} onClick={complete}>
          {saving ? '処理中…' : '完了'}
        </Button>
      </div>
    </div>
  );
}

window.QRScanScreen = QRScanScreen;
