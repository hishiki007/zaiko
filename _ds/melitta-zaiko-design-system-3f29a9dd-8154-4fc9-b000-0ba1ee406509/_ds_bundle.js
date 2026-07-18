/* @ds-bundle: {"format":4,"namespace":"MelittaZaikoDesignSystem_3f29a9","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Field","sourcePath":"components/core/Field.jsx"},{"name":"HistoryItem","sourcePath":"components/data/HistoryItem.jsx"},{"name":"PhotoDrop","sourcePath":"components/data/PhotoDrop.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Modal","sourcePath":"components/feedback/Modal.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Header","sourcePath":"components/navigation/Header.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"d0ca668571aa","components/core/Button.jsx":"f871b4a152ab","components/core/Card.jsx":"dab435d30191","components/core/Field.jsx":"8504591eda50","components/data/HistoryItem.jsx":"16ab6d76c48a","components/data/PhotoDrop.jsx":"a0f5f0a9cc5a","components/feedback/EmptyState.jsx":"1fcd76b0b48f","components/feedback/Modal.jsx":"964ec9bd383d","components/feedback/Toast.jsx":"630d061ae086","components/navigation/Header.jsx":"50a25bd39f48","components/navigation/Tabs.jsx":"9aee1ec6ce42","ui_kits/inventory/InventoryApp.jsx":"c6ba2d5a7e0d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MelittaZaikoDesignSystem_3f29a9 = window.MelittaZaikoDesignSystem_3f29a9 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
const KIND_STYLE = {
  neutral: {
    bg: 'var(--color-bg)',
    color: 'var(--color-text-muted)',
    border: 'none'
  },
  active: {
    bg: 'var(--color-primary-tint)',
    color: 'var(--color-primary)',
    border: 'none'
  },
  success: {
    bg: 'var(--color-success-tint)',
    color: 'var(--color-success)',
    border: '1px solid var(--color-success-tint-strong)'
  },
  'type-in': {
    bg: 'var(--color-success-tint)',
    color: 'var(--color-success)',
    border: 'none'
  },
  'type-out': {
    bg: 'var(--color-danger-tint)',
    color: 'var(--color-danger)',
    border: 'none'
  },
  'type-move': {
    bg: 'var(--color-warning-tint)',
    color: 'var(--color-warning)',
    border: 'none'
  },
  'type-add': {
    bg: 'var(--color-primary-tint)',
    color: 'var(--color-primary)',
    border: 'none'
  },
  'type-edit': {
    bg: 'var(--color-bg)',
    color: 'var(--color-text-muted)',
    border: 'none'
  }
};

/**
 * Badge — small pill used for location chips ("シンワ倉庫: 12"), the
 * "操作済" just-edited tag, and the colored history-type tags.
 */
function Badge({
  kind = 'neutral',
  pill = true,
  children
}) {
  const s = KIND_STYLE[kind] || KIND_STYLE.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      display: 'inline-block',
      fontSize: 'var(--text-2xs)',
      fontWeight: kind === 'neutral' ? 400 : 600,
      padding: '2px 7px',
      borderRadius: pill ? 'var(--radius-pill)' : 'var(--radius-sm)',
      background: s.bg,
      color: s.color,
      border: s.border,
      whiteSpace: 'nowrap'
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const VARIANTS = {
  primary: {
    bg: 'var(--color-primary)',
    hover: 'var(--color-primary-dark)',
    color: '#fff',
    border: 'none'
  },
  success: {
    bg: 'var(--color-success)',
    hover: '#15803d',
    color: '#fff',
    border: 'none'
  },
  warning: {
    bg: 'var(--color-warning)',
    hover: '#b45309',
    color: '#fff',
    border: 'none'
  },
  danger: {
    bg: 'var(--color-danger)',
    hover: '#b91c1c',
    color: '#fff',
    border: 'none'
  },
  outline: {
    bg: 'var(--color-surface)',
    hover: 'var(--color-bg)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)'
  },
  ghost: {
    bg: 'rgba(255,255,255,0.15)',
    hover: 'rgba(255,255,255,0.25)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.3)'
  }
};

/**
 * Button — the system's single button primitive. Six variants match the
 * source app's exact palette; there is no "secondary" variant in the source.
 */
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  style,
  children
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      fontFamily: 'var(--font-sans)',
      padding: size === 'sm' ? '5px 10px' : '8px 14px',
      fontSize: size === 'sm' ? 'var(--text-2xs)' : 'var(--text-sm)',
      fontWeight: 600,
      border: v.border,
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      whiteSpace: 'nowrap',
      background: hover && !disabled ? v.hover : v.bg,
      color: v.color,
      transform: active && !disabled ? 'scale(0.97)' : 'scale(1)',
      transition: 'all 0.15s',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
/**
 * Card — white elevated surface. Used for the setup form and as the base
 * of every modal. Never bordered; the soft shadow alone separates it from
 * the page.
 */
function Card({
  padding = 24,
  style,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-xl)',
      padding,
      boxShadow: 'var(--shadow-card)',
      fontFamily: 'var(--font-sans)',
      color: 'var(--color-text)',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Field.jsx
try { (() => {
const inputBase = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-md)',
  outline: 'none',
  background: '#fff',
  fontFamily: 'var(--font-sans)',
  color: 'var(--color-text)',
  boxSizing: 'border-box'
};

/**
 * Field — labeled form control wrapping either a text/number input or a
 * select, matching the source app's setup-form and modal-form fields.
 */
function Field({
  label,
  type = 'text',
  as = 'input',
  options = [],
  value,
  onChange,
  placeholder,
  disabled = false
}) {
  const [focused, setFocused] = React.useState(false);
  const style = {
    ...inputBase,
    borderColor: focused ? 'var(--color-primary)' : 'var(--color-border)',
    background: disabled ? 'var(--color-surface-sunken)' : '#fff',
    color: disabled ? 'var(--color-text-muted)' : 'var(--color-text)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 'var(--space-7)'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 'var(--text-xs)',
      fontWeight: 600,
      color: 'var(--color-text-muted)',
      marginBottom: 'var(--space-2)',
      fontFamily: 'var(--font-sans)'
    }
  }, label), as === 'select' ? /*#__PURE__*/React.createElement("select", {
    style: style,
    value: value,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false)
  }, options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o
  }, o))) : /*#__PURE__*/React.createElement("input", {
    type: type,
    style: style,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false)
  }));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Field.jsx", error: String((e && e.message) || e) }); }

// components/data/HistoryItem.jsx
try { (() => {
const BORDER_COLOR = {
  move: 'var(--color-warning)',
  add: 'var(--color-primary)',
  edit: 'var(--color-text-faint)',
  del: 'var(--slate-400)',
  in: 'var(--color-success)',
  out: 'var(--color-danger)',
  set: 'var(--color-accent-purple)'
};
const TYPE_LABELS = {
  move: '移動',
  add: '追加',
  edit: '編集',
  del: '削除',
  in: '入庫',
  out: '出庫',
  set: '直接指定'
};

/**
 * HistoryItem — a single row in the history drawer / part-history modal.
 * The 3px colored left border is the system's one deliberate use of a
 * left-border accent, and it always maps to the operation type.
 */
function HistoryItem({
  type = 'edit',
  name,
  detail,
  time,
  operator
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 10,
      borderRadius: 'var(--radius-md)',
      marginBottom: 6,
      border: '1px solid var(--color-border)',
      borderLeft: `3px solid ${BORDER_COLOR[type] || BORDER_COLOR.edit}`,
      fontSize: 'var(--text-xs)',
      fontFamily: 'var(--font-sans)',
      background: 'var(--color-surface)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 'var(--text-sm)'
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-text-muted)',
      fontSize: 'var(--text-2xs)'
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--color-text-muted)'
    }
  }, "[", TYPE_LABELS[type] || type, "] ", detail, operator ? ` · 👤${operator}` : ''));
}
Object.assign(__ds_scope, { HistoryItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/HistoryItem.jsx", error: String((e && e.message) || e) }); }

// components/data/PhotoDrop.jsx
try { (() => {
/**
 * PhotoDrop — dashed-border drop/tap zone used for part photos and
 * delivery-slip scan uploads. Shows a preview image once a file is chosen.
 */
function PhotoDrop({
  image,
  hint = '写真を選択してください',
  icon = '📄',
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      border: `2px dashed var(--color-border)`,
      borderRadius: 'var(--radius-lg)',
      padding: image ? 8 : 24,
      textAlign: 'center',
      cursor: 'pointer',
      background: 'var(--color-bg)',
      transition: 'border-color 0.2s',
      fontFamily: 'var(--font-sans)'
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "",
    style: {
      maxWidth: '100%',
      maxHeight: 200,
      borderRadius: 'var(--radius-md)',
      objectFit: 'contain'
    }
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-muted)',
      marginTop: 8
    }
  }, hint)));
}
Object.assign(__ds_scope, { PhotoDrop });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/PhotoDrop.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
/**
 * EmptyState — single large emoji + one line of muted text. Used for the
 * empty part table and empty history list. No illustration, no CTA.
 */
function EmptyState({
  icon = '🔧',
  message
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '48px 16px',
      color: 'var(--color-text-muted)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      marginBottom: 10
    }
  }, icon), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)'
    }
  }, message));
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Modal.jsx
try { (() => {
/**
 * Modal — overlay + centered card. Matches the source app's `.overlay`/
 * `.modal` pattern used for every dialog (add/edit part, transfer, stock
 * change, history, scan, operator picker...).
 */
function Modal({
  open,
  onClose,
  title,
  footer,
  maxWidth = 460,
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      if (e.target === e.currentTarget && onClose) onClose();
    },
    style: {
      position: 'fixed',
      inset: 0,
      background: 'var(--color-scrim)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-xl)',
      padding: 24,
      width: '100%',
      maxWidth,
      boxShadow: 'var(--shadow-modal)',
      maxHeight: '90vh',
      overflowY: 'auto',
      fontFamily: 'var(--font-sans)',
      color: 'var(--color-text)'
    }
  }, title && /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--text-xl)',
      margin: '0 0 18px',
      fontWeight: 700
    }
  }, title), children, footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 20
    }
  }, footer)));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Modal.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
/**
 * Toast — bottom-center auto-dismissing confirmation, exactly matching the
 * source app's `#toast` element. Always a short past-tense message, usually
 * emoji-prefixed (✅ 更新しました).
 */
function Toast({
  show,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--slate-900)',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: 'var(--radius-pill)',
      fontSize: 'var(--text-sm)',
      fontWeight: 500,
      opacity: show ? 1 : 0,
      transition: 'opacity 0.3s',
      zIndex: 300,
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      fontFamily: 'var(--font-sans)'
    }
  }, children);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Header.jsx
try { (() => {
/**
 * Header — sticky top app bar: colored primary background, title, and a
 * connection-status dot + ghost-button cluster on the right. Matches the
 * source app's single global `<header>` exactly (no variants).
 */
function Header({
  title = '🔧 部品在庫管理',
  connected = true,
  right
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      background: 'var(--color-primary)',
      color: '#fff',
      padding: '0 16px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-header)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-lg)',
      fontWeight: 700,
      margin: 0
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: connected ? 'var(--green-200)' : 'var(--red-200)',
      boxShadow: connected ? '0 0 6px var(--green-200)' : 'none'
    }
  }), right));
}
Object.assign(__ds_scope, { Header });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Header.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/**
 * Tabs — the horizontal location-filter strip ("すべて / シンワ倉庫 / アラン...")
 * with a live count bubble per tab. Active tab gets a 3px underline in the
 * primary color, matching the source app exactly.
 */
function Tabs({
  items,
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      overflowX: 'auto',
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      fontFamily: 'var(--font-sans)'
    }
  }, items.map(it => {
    const isActive = it.value === active;
    return /*#__PURE__*/React.createElement("div", {
      key: it.value,
      onClick: () => onChange && onChange(it.value),
      style: {
        padding: '10px 14px',
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
        borderBottom: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
        transition: 'all 0.15s'
      }
    }, it.label, /*#__PURE__*/React.createElement("span", {
      style: {
        background: isActive ? 'var(--color-primary-tint)' : 'var(--color-bg)',
        color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
        padding: '1px 7px',
        borderRadius: 'var(--radius-pill)',
        fontSize: 'var(--text-3xs)',
        marginLeft: 5
      }
    }, it.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/inventory/InventoryApp.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Header,
  Tabs,
  Button,
  Badge,
  Field,
  Card,
  Modal,
  Toast,
  EmptyState,
  HistoryItem
} = window.MelittaZaikoDesignSystem_3f29a9;
const LOCS = ['シンワ倉庫', 'アラン', 'ゆーや', 'しゅん', 'たくや'];
const TYPE_LABELS = {
  move: '移動',
  add: '追加',
  edit: '編集',
  del: '削除',
  in: '入庫',
  out: '出庫',
  set: '直接指定'
};
const SEED_PARTS = [{
  key: 'p1',
  no: 'M-1024',
  name: 'ヒーターユニット',
  locs: {
    シンワ倉庫: 6,
    アラン: 1,
    ゆーや: 0,
    しゅん: 0,
    たくや: 2
  },
  updatedAt: 5
}, {
  key: 'p2',
  no: 'M-2031',
  name: 'パッキン一式',
  locs: {
    シンワ倉庫: 24,
    アラン: 3,
    ゆーや: 5,
    しゅん: 2,
    たくや: 0
  },
  updatedAt: 4
}, {
  key: 'p3',
  no: 'M-3110',
  name: 'フィルターバスケット',
  locs: {
    シンワ倉庫: 10,
    アラン: 0,
    ゆーや: 2,
    しゅん: 0,
    たくや: 1
  },
  updatedAt: 3
}, {
  key: 'p4',
  no: 'M-4402',
  name: 'エアポンプ',
  locs: {
    シンワ倉庫: 3,
    アラン: 0,
    ゆーや: 0,
    しゅん: 0,
    たくや: 0
  },
  updatedAt: 2
}, {
  key: 'p5',
  no: 'M-5501',
  name: 'ドリップトレイ',
  locs: {
    シンワ倉庫: 8,
    アラン: 2,
    ゆーや: 1,
    しゅん: 1,
    たくや: 1
  },
  updatedAt: 1
}, {
  key: 'p6',
  no: 'M-6023',
  name: '配管ホース 1m',
  locs: {
    シンワ倉庫: 15,
    アラン: 0,
    ゆーや: 0,
    しゅん: 3,
    たくや: 0
  },
  updatedAt: 0
}];
const SEED_HISTORY = [{
  type: 'move',
  name: 'パッキン一式',
  detail: 'シンワ倉庫→アラン 2個移動',
  time: '7/15 09:41',
  operator: 'たくや'
}, {
  type: 'in',
  name: 'ヒーターユニット',
  detail: '入庫 シンワ倉庫: 4→6',
  time: '7/14 17:05',
  operator: 'しゅん'
}, {
  type: 'out',
  name: 'ドリップトレイ',
  detail: '出庫 アラン: 3→2',
  time: '7/14 11:20',
  operator: 'ゆーや'
}, {
  type: 'add',
  name: '配管ホース 1m',
  detail: '新規登録 シンワ倉庫:15 他0',
  time: '7/13 15:02',
  operator: 'アラン'
}];
function total(locs) {
  return LOCS.reduce((s, l) => s + (locs[l] || 0), 0);
}
function InventoryApp() {
  const [parts, setParts] = React.useState(SEED_PARTS);
  const [hist, setHist] = React.useState(SEED_HISTORY);
  const [curLoc, setCurLoc] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const [operator, setOperator] = React.useState(null);
  const [lastKey, setLastKey] = React.useState(null);
  const [toast, setToast] = React.useState('');
  const [histOpen, setHistOpen] = React.useState(false);
  const [opModal, setOpModal] = React.useState(false);
  const [addModal, setAddModal] = React.useState(false);
  const [editKey, setEditKey] = React.useState(null);
  const [stockKey, setStockKey] = React.useState(null);
  const [transferKey, setTransferKey] = React.useState(null);
  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }
  function addHist(entry) {
    setHist(h => [{
      ...entry,
      time: 'たった今'
    }, ...h]);
  }
  const rows = React.useMemo(() => {
    let r = parts.slice();
    if (curLoc !== 'all' && !query) r = r.filter(p => (p.locs[curLoc] || 0) > 0);
    if (query) r = r.filter(p => p.name.includes(query) || p.no.includes(query));
    r.sort((a, b) => a.key === lastKey ? -1 : b.key === lastKey ? 1 : b.updatedAt - a.updatedAt);
    return r;
  }, [parts, curLoc, query, lastKey]);
  const tabItems = [{
    value: 'all',
    label: 'すべて',
    count: parts.length
  }, ...LOCS.map(l => ({
    value: l,
    label: l,
    count: parts.filter(p => (p.locs[l] || 0) > 0).length
  }))];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      background: 'var(--color-bg)',
      minHeight: '100vh',
      color: 'var(--color-text)'
    }
  }, /*#__PURE__*/React.createElement(Header, {
    connected: true,
    right: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      onClick: () => setOpModal(true)
    }, "\uD83D\uDC64 ", operator || '未選択'), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      onClick: () => setHistOpen(true)
    }, "\u5168\u5C65\u6B74"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 56,
      zIndex: 90,
      background: 'var(--color-surface)',
      boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 16px',
      flexWrap: 'wrap',
      borderBottom: '1px solid var(--color-border)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: "\uD83D\uDD0D \u90E8\u54C1\u540D\u30FB\u90E8\u54C1\u756A\u53F7\u3067\u691C\u7D22...",
    style: {
      flex: 1,
      minWidth: 150,
      padding: '8px 12px',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      fontSize: 'var(--text-md)',
      outline: 'none',
      fontFamily: 'var(--font-sans)'
    }
  }), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setAddModal(true)
  }, "\uFF0B \u90E8\u54C1\u8FFD\u52A0"), /*#__PURE__*/React.createElement(Button, {
    variant: "warning",
    onClick: () => setTransferKey('__new__')
  }, "\u2194 \u79FB\u52D5"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline"
  }, "CSV\u51FA\u529B"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline"
  }, "\uD83D\uDCE5 CSV\u30A4\u30F3\u30DD\u30FC\u30C8"), /*#__PURE__*/React.createElement(Button, {
    variant: "success"
  }, "\uD83D\uDCF1 QR\u30B9\u30AD\u30E3\u30F3"), /*#__PURE__*/React.createElement(Button, {
    style: {
      background: 'var(--color-accent-purple)',
      color: '#fff'
    }
  }, "\uD83D\uDD27 \u70B9\u691C")), /*#__PURE__*/React.createElement(Tabs, {
    items: tabItems,
    active: curLoc,
    onChange: setCurLoc
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16
    }
  }, rows.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    icon: "\uD83D\uDD27",
    message: "\u90E8\u54C1\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093"
  }) : /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-table)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ['部品番号', '部品名', curLoc === 'all' ? '保管場所 / 数量' : curLoc + ' の数量', '合計', '操作'].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      background: 'var(--slate-50)',
      padding: '10px 12px',
      textAlign: 'left',
      fontSize: 'var(--text-2xs)',
      fontWeight: 700,
      color: 'var(--color-text-muted)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--letter-spacing-label)',
      borderBottom: '1px solid var(--color-border)',
      whiteSpace: 'nowrap'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => {
    const isLast = r.key === lastKey;
    const tot = total(r.locs);
    return /*#__PURE__*/React.createElement("tr", {
      key: r.key,
      style: isLast ? {
        background: '#eff6ff',
        borderLeft: '3px solid var(--color-primary)'
      } : {}
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 12px',
        borderBottom: '1px solid var(--color-border)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-muted)'
      }
    }, r.no), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 12px',
        borderBottom: '1px solid var(--color-border)',
        fontWeight: 600
      }
    }, r.name, isLast && /*#__PURE__*/React.createElement(Badge, {
      kind: "active",
      style: {
        marginLeft: 6
      }
    }, "\u64CD\u4F5C\u6E08")), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 12px',
        borderBottom: '1px solid var(--color-border)'
      }
    }, curLoc === 'all' ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 5,
        flexWrap: 'wrap'
      }
    }, LOCS.map(l => /*#__PURE__*/React.createElement(Badge, {
      key: l,
      kind: (r.locs[l] || 0) > 0 ? 'success' : 'neutral'
    }, l, ": ", r.locs[l] || 0))) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700,
        fontSize: 'var(--text-base)',
        color: (r.locs[curLoc] || 0) === 0 ? 'var(--color-zero)' : 'inherit'
      }
    }, r.locs[curLoc] || 0)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 12px',
        borderBottom: '1px solid var(--color-border)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700,
        fontSize: 'var(--text-base)',
        color: tot === 0 ? 'var(--color-zero)' : 'inherit'
      }
    }, tot)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 12px',
        borderBottom: '1px solid var(--color-border)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 5,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "sm",
      onClick: () => setStockKey(r.key)
    }, "\u5728\u5EAB\u5909\u66F4"), /*#__PURE__*/React.createElement(Button, {
      variant: "warning",
      size: "sm",
      onClick: () => setTransferKey(r.key)
    }, "\u2194 \u79FB\u52D5"), /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "sm",
      onClick: () => setEditKey(r.key)
    }, "\u7DE8\u96C6"), /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "sm",
      style: {
        color: 'var(--color-danger)'
      },
      onClick: () => {
        setParts(ps => ps.filter(p => p.key !== r.key));
        addHist({
          type: 'del',
          name: r.name,
          detail: '削除'
        });
        showToast('🗑 削除しました');
      }
    }, "\u524A\u9664"))));
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      right: 0,
      top: 56,
      bottom: 0,
      width: 320,
      background: '#fff',
      borderLeft: '1px solid var(--color-border)',
      transform: histOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s',
      zIndex: 150,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontWeight: 700,
      fontSize: 'var(--text-md)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u5168\u64CD\u4F5C\u5C65\u6B74"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setHistOpen(false),
    style: {
      background: 'none',
      border: 'none',
      fontSize: 18,
      cursor: 'pointer',
      color: 'var(--color-text-muted)'
    }
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: 'auto',
      flex: 1,
      padding: 10
    }
  }, hist.map((h, i) => /*#__PURE__*/React.createElement(HistoryItem, _extends({
    key: i
  }, h))))), /*#__PURE__*/React.createElement(Modal, {
    open: opModal,
    onClose: () => setOpModal(false),
    title: "\u4F5C\u696D\u8005\u3092\u9078\u629E",
    footer: /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: () => setOpModal(false)
    }, "\u9589\u3058\u308B")
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-muted)',
      marginTop: -8,
      marginBottom: 14
    }
  }, "\u51FA\u5EAB\u30FB\u79FB\u52D5\u3092\u8A18\u9332\u3057\u305F\u4EBA\u3068\u3057\u3066\u5C65\u6B74\u306B\u6B8B\u308A\u307E\u3059\u3002"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, LOCS.map(name => /*#__PURE__*/React.createElement(Button, {
    key: name,
    variant: operator === name ? 'primary' : 'outline',
    style: {
      textAlign: 'left',
      justifyContent: 'flex-start'
    },
    onClick: () => {
      setOperator(name);
      setOpModal(false);
    }
  }, name)))), /*#__PURE__*/React.createElement(Modal, {
    open: addModal,
    onClose: () => setAddModal(false),
    title: "\u90E8\u54C1\u3092\u8FFD\u52A0",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: () => setAddModal(false)
    }, "\u30AD\u30E3\u30F3\u30BB\u30EB"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => {
        setAddModal(false);
        showToast('✅ 追加しました');
      }
    }, "\u4FDD\u5B58"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u90E8\u54C1\u756A\u53F7",
    placeholder: "\u4F8B: M-7001"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "\u90E8\u54C1\u540D *",
    placeholder: "\u4F8B: \u30DC\u30EB\u30C8 M6"
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-xs)',
      fontWeight: 700,
      color: 'var(--color-text-muted)',
      margin: '4px 0 10px'
    }
  }, "\u5404\u4FDD\u7BA1\u5834\u6240\u306E\u521D\u671F\u6570\u91CF"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, LOCS.map(l => /*#__PURE__*/React.createElement(Field, {
    key: l,
    label: l,
    type: "number",
    value: 0,
    onChange: () => {}
  })))), /*#__PURE__*/React.createElement(Modal, {
    open: !!editKey,
    onClose: () => setEditKey(null),
    title: "\u90E8\u54C1\u3092\u7DE8\u96C6",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: () => setEditKey(null)
    }, "\u30AD\u30E3\u30F3\u30BB\u30EB"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => {
        setEditKey(null);
        showToast('✅ 更新しました');
      }
    }, "\u4FDD\u5B58"))
  }, editKey && (() => {
    const p = parts.find(x => x.key === editKey);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "\u90E8\u54C1\u756A\u53F7",
      value: p.no,
      onChange: () => {}
    }), /*#__PURE__*/React.createElement(Field, {
      label: "\u90E8\u54C1\u540D *",
      value: p.name,
      onChange: () => {}
    })), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-muted)',
        margin: '4px 0 10px'
      }
    }, "\u203B \u5728\u5EAB\u6570\u306E\u5909\u66F4\u306F\u300C\u5728\u5EAB\u5909\u66F4\u300D\u30DC\u30BF\u30F3\u304B\u3089"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12
      }
    }, LOCS.map(l => /*#__PURE__*/React.createElement(Field, {
      key: l,
      label: l,
      type: "number",
      value: p.locs[l] || 0,
      disabled: true,
      onChange: () => {}
    }))));
  })()), /*#__PURE__*/React.createElement(StockModal, {
    partKey: stockKey,
    parts: parts,
    onClose: () => setStockKey(null),
    onConfirm: (loc, val, mode) => {
      const p = parts.find(x => x.key === stockKey);
      setParts(ps => ps.map(x => x.key === stockKey ? {
        ...x,
        locs: {
          ...x.locs,
          [loc]: val
        },
        updatedAt: 99
      } : x));
      const label = mode === 'in' ? '入庫' : mode === 'out' ? '出庫' : '直接指定';
      addHist({
        type: mode,
        name: p.name,
        detail: `${label} ${loc}: ${p.locs[loc] || 0}→${val}`,
        operator
      });
      setLastKey(stockKey);
      setStockKey(null);
      showToast(`✅ ${loc}: ${val}`);
    }
  }), /*#__PURE__*/React.createElement(TransferModal, {
    partKey: transferKey === '__new__' ? null : transferKey,
    parts: parts,
    onClose: () => setTransferKey(null),
    onConfirm: (key, from, to, qty) => {
      const p = parts.find(x => x.key === key);
      if (!p || from === to || qty <= 0 || qty > (p.locs[from] || 0)) {
        showToast('入力内容をご確認ください');
        return;
      }
      setParts(ps => ps.map(x => x.key === key ? {
        ...x,
        locs: {
          ...x.locs,
          [from]: (x.locs[from] || 0) - qty,
          [to]: (x.locs[to] || 0) + qty
        },
        updatedAt: 99
      } : x));
      addHist({
        type: 'move',
        name: p.name,
        detail: `${from}→${to} ${qty}個移動`,
        operator
      });
      setLastKey(key);
      setTransferKey(null);
      showToast(`✅ ${from}→${to} ${qty}個`);
    }
  }), /*#__PURE__*/React.createElement(Toast, {
    show: !!toast
  }, toast));
}
window.InventoryApp = InventoryApp;
function StockModal({
  partKey,
  parts,
  onClose,
  onConfirm
}) {
  const [mode, setMode] = React.useState('in');
  const [loc, setLoc] = React.useState(LOCS[0]);
  const [qty, setQty] = React.useState(1);
  const p = parts.find(x => x.key === partKey);
  React.useEffect(() => {
    if (partKey) {
      setMode('in');
      setLoc(LOCS[0]);
      setQty(1);
    }
  }, [partKey]);
  if (!p) return null;
  const cur = p.locs[loc] || 0;
  const after = mode === 'in' ? cur + Number(qty || 0) : mode === 'out' ? cur - Number(qty || 0) : Number(qty || 0);
  return /*#__PURE__*/React.createElement(Modal, {
    open: !!partKey,
    onClose: onClose,
    title: p.name,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: onClose
    }, "\u30AD\u30E3\u30F3\u30BB\u30EB"), /*#__PURE__*/React.createElement(Button, {
      variant: "success",
      onClick: () => onConfirm(loc, after, mode)
    }, "\u78BA\u5B9A"))
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u4FDD\u7BA1\u5834\u6240",
    as: "select",
    options: LOCS,
    value: loc,
    onChange: e => setLoc(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      margin: '0 0 14px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: mode === 'in' ? 'success' : 'outline',
    style: {
      flex: 1
    },
    onClick: () => setMode('in')
  }, "\uD83D\uDCE5 \u5165\u5EAB \uFF0B"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    style: {
      flex: 1,
      borderColor: mode === 'out' ? 'var(--color-danger)' : undefined,
      color: mode === 'out' ? 'var(--color-danger)' : undefined
    },
    onClick: () => setMode('out')
  }, "\uD83D\uDCE4 \u51FA\u5EAB \u2212"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    style: {
      flex: 1,
      borderColor: mode === 'set' ? 'var(--color-primary)' : undefined,
      color: mode === 'set' ? 'var(--color-primary)' : undefined
    },
    onClick: () => setMode('set')
  }, "\u270F\uFE0F \u76F4\u63A5\u6307\u5B9A")), /*#__PURE__*/React.createElement(Field, {
    label: mode === 'set' ? '在庫数（直接指定）' : mode === 'in' ? '入庫数量' : '出庫数量',
    type: "number",
    value: qty,
    onChange: e => setQty(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-bg)',
      borderRadius: 'var(--radius-md)',
      padding: 12,
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-muted)',
      textAlign: 'center',
      marginTop: 8
    }
  }, loc, ": ", cur, " \u2192 ", after));
}
function TransferModal({
  partKey,
  parts,
  onClose,
  onConfirm
}) {
  const [key, setKey] = React.useState(partKey);
  const [from, setFrom] = React.useState(LOCS[0]);
  const [to, setTo] = React.useState(LOCS[1]);
  const [qty, setQty] = React.useState(1);
  React.useEffect(() => {
    setKey(partKey);
    if (partKey) {
      setFrom(LOCS[0]);
      setTo(LOCS[1]);
      setQty(1);
    }
  }, [partKey]);
  const open = partKey !== null && partKey !== undefined;
  const p = parts.find(x => x.key === key) || parts[0];
  if (!p) return null;
  const fq = p.locs[from] || 0,
    tq = p.locs[to] || 0;
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    title: "\u2194 \u90E8\u54C1\u3092\u79FB\u52D5",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: onClose
    }, "\u30AD\u30E3\u30F3\u30BB\u30EB"), /*#__PURE__*/React.createElement(Button, {
      variant: "warning",
      onClick: () => onConfirm(key, from, to, Number(qty))
    }, "\u79FB\u52D5\u3092\u5B9F\u884C"))
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u90E8\u54C1\u756A\u53F7\u307E\u305F\u306F\u90E8\u54C1\u540D",
    as: "select",
    options: parts.map(x => x.name),
    value: p.name,
    onChange: e => setKey(parts.find(x => x.name === e.target.value)?.key)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u79FB\u52D5\u5143",
    as: "select",
    options: LOCS,
    value: from,
    onChange: e => setFrom(e.target.value)
  }), /*#__PURE__*/React.createElement(Field, {
    label: "\u79FB\u52D5\u5148",
    as: "select",
    options: LOCS,
    value: to,
    onChange: e => setTo(e.target.value)
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u79FB\u52D5\u6570\u91CF",
    type: "number",
    value: qty,
    onChange: e => setQty(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-bg)',
      borderRadius: 'var(--radius-md)',
      padding: 12,
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-muted)',
      textAlign: 'center',
      marginTop: 8
    }
  }, from, ": ", fq, "\u2192", Math.max(0, fq - Number(qty || 0)), "\u3000", to, ": ", tq, "\u2192", tq + Number(qty || 0)));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/inventory/InventoryApp.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.HistoryItem = __ds_scope.HistoryItem;

__ds_ns.PhotoDrop = __ds_scope.PhotoDrop;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Header = __ds_scope.Header;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
