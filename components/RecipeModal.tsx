'use client';

import { useEffect } from 'react';
import { X, Clock, Flame, Heart, ChefHat } from 'lucide-react';
import { Meal } from '@/lib/types';

interface RecipeModalProps {
  meal: Meal;
  isFav: boolean;
  onClose: () => void;
  onToggleFavorite: (meal: Meal) => void;
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  和食: { bg: '#D8F3DC', text: '#1E4035' },
  洋食: { bg: '#FAE8E3', text: '#7C3626' },
  中華: { bg: '#FEF3DC', text: '#7C5A1E' },
  高タンパク: { bg: '#E8F4FD', text: '#1E3A5F' },
  低カロリー: { bg: '#F0FDF4', text: '#166534' },
  ヘルシー: { bg: '#F0FDF4', text: '#166534' },
  ボリューム: { bg: '#FDF4FF', text: '#6B21A8' },
  時短: { bg: '#FFF7ED', text: '#9A3412' },
};

export default function RecipeModal({
  meal,
  isFav,
  onClose,
  onToggleFavorite,
}: RecipeModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(28,28,26,0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '28px 28px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flex: 1 }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--green-mid)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {meal.day}
            </span>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginTop: '4px',
                letterSpacing: '-0.02em',
                lineHeight: 1.3,
              }}
            >
              {meal.name}
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                marginTop: '6px',
              }}
            >
              {meal.description}
            </p>
            <div
              style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}
            >
              {meal.tags.map((tag) => {
                const colors = TAG_COLORS[tag] ?? { bg: 'var(--surface-2)', text: 'var(--text-secondary)' };
                return (
                  <span
                    key={tag}
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      backgroundColor: colors.bg,
                      color: colors.text,
                    }}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
            <button
              onClick={() => onToggleFavorite(meal)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isFav ? 'var(--coral-pale)' : 'var(--surface-2)',
                color: isFav ? 'var(--coral)' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}
            >
              <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={onClose}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--surface-2)',
                color: 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            padding: '20px 28px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {[
            { icon: Clock, label: `${meal.cookingTime}分`, sub: '調理時間' },
            { icon: Flame, label: `${meal.calories}kcal`, sub: 'カロリー' },
            { icon: ChefHat, label: `${meal.ingredients.length}種類`, sub: '食材数' },
          ].map(({ icon: Icon, label, sub }) => (
            <div
              key={sub}
              style={{
                flex: 1,
                backgroundColor: 'var(--surface-2)',
                borderRadius: '14px',
                padding: '14px',
                textAlign: 'center',
              }}
            >
              <Icon size={18} style={{ color: 'var(--green-mid)', margin: '0 auto 6px' }} />
              <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {label}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {sub}
              </div>
            </div>
          ))}
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: 'auto', padding: '24px 28px 28px' }} className="scrollbar-hide">
          {/* Ingredients */}
          <section style={{ marginBottom: '28px' }}>
            <h3
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '14px',
              }}
            >
              材料（1人分）
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}
            >
              {meal.ingredients.map((ing, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    backgroundColor: 'var(--surface-2)',
                    borderRadius: '10px',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    {ing.name}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>
                    {ing.amount}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Steps */}
          <section>
            <h3
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '14px',
              }}
            >
              作り方
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {meal.steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      minWidth: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--green-dark)',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <p
                    style={{
                      fontSize: '14px',
                      lineHeight: '1.7',
                      color: 'var(--text-primary)',
                      paddingTop: '4px',
                    }}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
