'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Package, Thermometer, Snowflake, RefreshCw } from 'lucide-react';
import { WeeklyPlan, ShoppingItem } from '@/lib/types';
import { loadWeeklyPlan } from '@/lib/storage';

const CATEGORY_ORDER = ['肉・魚', '野菜・果物', '豆腐・卵・乳製品', '調味料・乾物', 'その他'];
const CATEGORY_ICONS: Record<string, string> = {
  '肉・魚': '🥩',
  '野菜・果物': '🥦',
  '豆腐・卵・乳製品': '🥚',
  '調味料・乾物': '🧂',
  'その他': '🛒',
};

const STORAGE_STYLE: Record<string, { icon: typeof Thermometer; bg: string; text: string }> = {
  冷蔵: { icon: Thermometer, bg: '#DBEAFE', text: '#1E40AF' },
  冷凍: { icon: Snowflake, bg: '#E0F2FE', text: '#0369A1' },
  常温: { icon: Package, bg: 'var(--surface-2)', text: 'var(--text-secondary)' },
};

export default function ShoppingPage() {
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = loadWeeklyPlan();
    if (saved) setPlan(saved);
  }, []);

  const toggleCheck = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const grouped = (() => {
    if (!plan) return {};
    return plan.shoppingList.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
      const cat = item.category ?? 'その他';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});
  })();

  const sortedCategories = CATEGORY_ORDER.filter((c) => grouped[c]);

  const totalItems = plan?.shoppingList.length ?? 0;
  const checkedCount = checked.size;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <ShoppingCart size={20} style={{ color: 'var(--green-mid)' }} />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
            今週の食材
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
            }}
          >
            買い物リスト
          </h1>
          {totalItems > 0 && (
            <div
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                backgroundColor: checkedCount === totalItems ? 'var(--green-pale)' : 'var(--surface-2)',
                fontSize: '13px',
                fontWeight: '600',
                color: checkedCount === totalItems ? 'var(--green-mid)' : 'var(--text-secondary)',
              }}
            >
              {checkedCount} / {totalItems}
            </div>
          )}
        </div>
      </div>

      {/* No plan state */}
      {!plan && (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 24px',
            backgroundColor: 'var(--surface)',
            borderRadius: '24px',
            border: '2px dashed var(--border)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
            買い物リストがありません
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            まず「今週の献立」ページで献立を生成してください
          </p>
        </div>
      )}

      {/* Shopping list */}
      {plan && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {sortedCategories.map((category) => (
            <div key={category}>
              {/* Category header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                }}
              >
                <span style={{ fontSize: '20px' }}>{CATEGORY_ICONS[category]}</span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                  }}
                >
                  {category}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    backgroundColor: 'var(--surface-2)',
                    padding: '2px 8px',
                    borderRadius: '20px',
                  }}
                >
                  {grouped[category].length}品
                </span>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '20px',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                }}
              >
                {grouped[category].map((item, idx) => {
                  const key = `${category}-${item.name}`;
                  const isChecked = checked.has(key);
                  const storageStyle = STORAGE_STYLE[item.storageMethod] ?? STORAGE_STYLE['常温'];
                  const StorageIcon = storageStyle.icon;

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheck(key)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        padding: '16px 20px',
                        borderBottom: idx < grouped[category].length - 1 ? '1px solid var(--border)' : 'none',
                        cursor: 'pointer',
                        opacity: isChecked ? 0.4 : 1,
                        transition: 'opacity 0.15s',
                      }}
                    >
                      {/* Checkbox */}
                      <div
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '7px',
                          border: isChecked ? 'none' : '2px solid var(--border)',
                          backgroundColor: isChecked ? 'var(--green-mid)' : 'transparent',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '1px',
                          transition: 'all 0.15s',
                        }}
                      >
                        {isChecked && (
                          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                            <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '15px',
                              fontWeight: '600',
                              color: 'var(--text-primary)',
                              textDecoration: isChecked ? 'line-through' : 'none',
                            }}
                          >
                            {item.name}
                          </span>
                          <span
                            style={{
                              fontSize: '14px',
                              color: 'var(--text-secondary)',
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                            }}
                          >
                            {item.amount}
                          </span>
                        </div>

                        {/* Used on days */}
                        {item.usedOnDays?.length > 0 && (
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                            使用日：{item.usedOnDays.join('・')}
                          </p>
                        )}

                        {/* Storage note */}
                        {item.storageNote && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              marginTop: '6px',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              backgroundColor: storageStyle.bg,
                              width: 'fit-content',
                            }}
                          >
                            <StorageIcon size={12} style={{ color: storageStyle.text, flexShrink: 0 }} />
                            <span style={{ fontSize: '12px', color: storageStyle.text, fontWeight: '500' }}>
                              {item.storageNote}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Reset button */}
          {checkedCount > 0 && (
            <button
              onClick={() => setChecked(new Set())}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: '14px',
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '13px',
                color: 'var(--text-muted)',
                fontWeight: '500',
                transition: 'all 0.15s',
              }}
            >
              <RefreshCw size={14} />
              チェックをリセット
            </button>
          )}
        </div>
      )}
    </div>
  );
}
