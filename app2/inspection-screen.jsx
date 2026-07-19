const { Header, Card, Button } = window.MelittaZaikoDesignSystem_3f29a9;

function InspectionScreen() {
  const [allTemplates] = React.useState(window.InspData.loadTemplates);
  const MACHINES = [...new Set(allTemplates.map((t) => t.machine))];
  const [machine, setMachine] = React.useState(null);
  const [type, setType] = React.useState(null);
  const [kit, setKit] = React.useState(null);
  const [prepared, setPrepared] = React.useState([]); // [{machine, inspType}]
  const [loc, setLoc] = React.useState(window.ZaikoDB.getOperator());
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const [connected, setConnected] = React.useState(window.ZaikoDB.isReady());
  const [parts, setParts] = React.useState(null);

  React.useEffect(() => {
    let unsub = () => {};
    window.ZaikoDB.subscribeParts((data) => {
      setConnected(window.ZaikoDB.isReady());
      if (data) setParts(Object.entries(data).map(([key, p]) => ({ key, no: p.no || '', name: p.name, locs: p.locs || {} })));
    }).then((u) => { unsub = u; });
    return () => unsub();
  }, []);

  const typesForMachine = machine ? allTemplates.filter((t) => t.machine === machine) : [];

  function selectMachine(m) { setMachine(m); setType(null); }
  function mergeAll(list) {
    let merged = null;
    for (const p of list) {
      if (!merged) { merged = p.parts.map((it) => ({ ...it })); continue; }
      for (const inc of p.parts) {
        const existing = merged.find((it) => (it.no && it.no === inc.no) || (!it.no && it.name === inc.name));
        if (existing) existing.qty += inc.qty;
        else merged.push({ ...inc });
      }
    }
    return merged;
  }
  function selectType(t) {
    setType(t.inspType);
    const incoming = t.parts.map((i) => ({ ...i, choice: i.altNo ? i.no : undefined, name: (parts && parts.find((p) => p.no === i.no) || {}).name }));
    setPrepared((prev) => {
      const next = [...prev, { machine, inspType: t.inspType, parts: incoming }];
      setKit(mergeAll(next));
      return next;
    });
    setMachine(null); setType(null);
  }
  function removePrepared(idx) {
    setPrepared((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      setKit(next.length ? mergeAll(next) : null);
      return next;
    });
  }
  function clearAll() { setPrepared([]); setKit(null); setMachine(null); setType(null); setError(''); }
  function updateQty(idx, qty) { setKit((prev) => prev.map((it, i) => (i === idx ? { ...it, qty } : it))); }
  function setChoice(idx, code) { setKit((prev) => prev.map((it, i) => (i === idx ? { ...it, choice: code } : it))); }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected={connected} title="点検出庫" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {kit && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={clearAll} style={{
              background: 'none', border: 'none', color: 'var(--color-danger)',
              fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: 0,
            }}>🗑 リストをクリア</button>
            <button onClick={() => { window.location.href = '点検マスタ編集画面.html'; }} style={{
              background: 'none', border: 'none', color: 'var(--color-text-muted)',
              fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: 0,
            }}>⚙️ マスタ編集</button>
          </div>
        )}
        {!machine && !kit && (
          <button onClick={() => { window.location.href = '点検履歴画面.html'; }} style={{
            alignSelf: 'flex-end', background: 'none', border: 'none', color: 'var(--color-text-muted)',
            fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: 0,
          }}>📋 点検履歴を見る</button>
        )}
        {!machine && !kit && (
          <React.Fragment>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)' }}>
              機種を選択
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {MACHINES.map((m) => (
                <button key={m} onClick={() => selectMachine(m)} style={{
                  height: 64, borderRadius: 'var(--radius-lg)', border: 'none',
                  background: 'var(--color-accent-purple)', color: '#fff', fontSize: 'var(--text-md)', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}>{m}</button>
              ))}
            </div>
          </React.Fragment>
        )}

        {machine === '__pick__' && (
          <React.Fragment>
            <button onClick={() => setMachine(null)} style={{
              alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--color-text-muted)',
              fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: 0,
            }}>← リストに戻る</button>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)' }}>
              機種を選択
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {MACHINES.map((m) => (
                <button key={m} onClick={() => selectMachine(m)} style={{
                  height: 64, borderRadius: 'var(--radius-lg)', border: 'none',
                  background: 'var(--color-accent-purple)', color: '#fff', fontSize: 'var(--text-md)', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}>{m}</button>
              ))}
            </div>
          </React.Fragment>
        )}

        {machine && machine !== '__pick__' && !type && (
          <React.Fragment>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => setMachine(kit ? '__pick__' : null)} style={{
                background: 'none', border: 'none', color: 'var(--color-text-muted)',
                fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: 0,
              }}>← 機種選択に戻る</button>
              <button onClick={() => { window.location.href = '点検マスタ編集画面.html'; }} style={{
                background: 'none', border: 'none', color: 'var(--color-text-muted)',
                fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: 0,
              }}>⚙️ マスタ編集</button>
            </div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>{machine}</div>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)' }}>
              点検種別を選択
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {typesForMachine.map((t) => (
                <button key={t.id} onClick={() => selectType(t)} style={{
                  height: 56, padding: '0 20px', borderRadius: 'var(--radius-lg)', border: 'none',
                  background: 'var(--color-warning)', color: '#fff', fontSize: 'var(--text-md)', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}>{t.inspType}</button>
              ))}
            </div>
          </React.Fragment>
        )}

        {kit && !machine && (
          <React.Fragment>
            <button onClick={() => setMachine('__pick__')} style={{
              alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--color-primary)',
              fontSize: 'var(--text-sm)', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: 0,
            }}>＋ 他の機種・点検も追加する</button>
            <Card padding={12}>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 8 }}>準備中の点検</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {prepared.map((p, i) => (
                  <span key={i} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f5f3ff', color: 'var(--color-accent-purple)',
                    borderRadius: 'var(--radius-pill)', padding: '4px 10px', fontSize: 'var(--text-xs)', fontWeight: 700,
                  }}>{p.machine} {p.inspType}<button onClick={() => removePrepared(i)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 700, padding: 0 }}>✕</button></span>
                ))}
              </div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4 }}>点検出庫先</label>
              <select value={loc} onChange={(e) => setLoc(e.target.value)} style={{
                width: '100%', height: 40, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', color: 'var(--color-text)', background: '#fff', padding: '0 8px',
              }}>
                {window.ZaikoDB.LOCS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </Card>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)' }}>
              出庫内容（合算）
            </div>
            <Card padding={0}>
              {kit.map((it, i) => (
                <div key={it.no || it.name} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                  borderBottom: i < kit.length - 1 ? '1px solid var(--color-border)' : 'none', flexWrap: 'wrap',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, fontFamily: it.no ? 'var(--font-mono)' : 'var(--font-sans)' }}>{it.no || it.name}</div>
                    {it.no && it.name && <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)' }}>{it.name}</div>}
                  </div>
                  {it.altNo && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[it.no, it.altNo].map((code) => (
                        <button key={code} onClick={() => setChoice(i, code)} style={{
                          padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: 'var(--text-2xs)', fontWeight: 700,
                          border: `2px solid ${it.choice === code ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          background: it.choice === code ? 'var(--color-primary)' : '#fff',
                          color: it.choice === code ? '#fff' : 'var(--color-text)', cursor: 'pointer', fontFamily: 'var(--font-mono)',
                        }}>{code}</button>
                      ))}
                    </div>
                  )}
                  <button onClick={() => updateQty(i, Math.max(0, it.qty - 1))} style={{
                    width: 40, height: 40, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)', fontSize: 20, fontWeight: 700, color: 'var(--color-text)', cursor: 'pointer',
                  }}>−</button>
                  <span style={{ minWidth: 28, textAlign: 'center', fontSize: 'var(--text-md)', fontWeight: 700 }}>{it.qty}</span>
                  <button onClick={() => updateQty(i, it.qty + 1)} style={{
                    width: 40, height: 40, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)', fontSize: 20, fontWeight: 700, color: 'var(--color-text)', cursor: 'pointer',
                  }}>＋</button>
                </div>
              ))}
            </Card>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>{error}</div>}
          </React.Fragment>
        )}
      </div>

      <div style={{
        flex: '0 0 auto', padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: 10,
      }}>
        <Button
          variant="outline"
          disabled={!kit || !!machine || saving}
          style={{ flex: 1, height: 56, fontSize: 'var(--text-md)' }}
          onClick={async () => {
            if (!kit) return;
            const operator = window.ZaikoDB.getOperator();
            if (operator === 'シンワ倉庫') { setError('作業者がシンワ倉庫のため、移動先を別途選んでください'); return; }
            if (!window.confirm(`シンワ倉庫 → ${operator} へ部品を移動します。よろしいですか？`)) return;
            setError('');
            if (connected && parts) {
              for (const item of kit) {
                const code = item.choice || item.no;
                const match = code ? parts.find((p) => p.no === code) : parts.find((p) => p.name === item.name);
                if (match && item.qty > (match.locs['シンワ倉庫'] || 0)) { setError(`${code || item.name}: シンワ倉庫の在庫が不足しています（残り${match.locs['シンワ倉庫'] || 0}）`); return; }
              }
            }
            setSaving(true);
            if (connected && parts) {
              for (const item of kit) {
                const code = item.choice || item.no;
                const match = code ? parts.find((p) => p.no === code) : parts.find((p) => p.name === item.name);
                if (match && item.qty > 0) { await window.ZaikoDB.transferPart(match.key, match.name, 'シンワ倉庫', operator, item.qty); }
              }
            }
            window.location.href = '在庫管理 ホーム画面.html';
          }}
        >
          ↔ 部品移動を実行（→{window.ZaikoDB.getOperator()}）
        </Button>
        <Button
          disabled={!kit || !!machine || saving}
          style={{
            flex: 2, height: 56, fontSize: 'var(--text-md)', fontWeight: 700, border: 'none',
            cursor: kit ? 'pointer' : 'default', borderRadius: 'var(--radius-lg)', color: '#fff',
            fontFamily: 'var(--font-sans)', background: 'var(--color-accent-purple)', opacity: kit ? 1 : 0.5,
          }}
          onClick={async () => {
            if (!kit) return;
            setError('');
            if (connected && parts) {
              for (const item of kit) {
                const code = item.choice || item.no;
                const match = code ? parts.find((p) => p.no === code) : parts.find((p) => p.name === item.name);
                if (!match) { setError(`${code || item.name}: 在庫データに見つかりません（部品番号が一致しない可能性、CSVインポートをご確認ください）`); return; }
                if (item.qty > (match.locs[loc] || 0)) { setError(`${code || item.name}: ${loc}の在庫が不足しています（残り${match.locs[loc] || 0}）`); return; }
              }
            }
            setSaving(true);
            if (connected && parts) {
              for (const item of kit) {
                const code = item.choice || item.no;
                const match = code ? parts.find((p) => p.no === code) : parts.find((p) => p.name === item.name);
                if (match && item.qty > 0) { await window.ZaikoDB.adjustStock(match.key, match.name, loc, 'out', item.qty); }
              }
            }
            window.location.href = '在庫管理 ホーム画面.html';
          }}
        >
          {saving ? '処理中…' : '🔧 点検出庫を実行'}
        </Button>
      </div>
    </div>
  );
}

window.InspectionScreen = InspectionScreen;
