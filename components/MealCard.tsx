'use client';

import { Clock, Flame, Heart } from 'lucide-react';
import { Meal } from '@/lib/types';

interface MealCardProps {
  meal: Meal;
  isFav: boolean;
  onOpenRecipe: (meal: Meal) => void;
  onToggleFavorite: (meal: Meal) => void;
}

const DAY_COLORS = [
  { dot: '#52B788', bg: '#D8F3DC' },
  { dot: '#4895EF', bg: '#DBEAFE' },
  { dot: '#E07A5F', bg: '#FAE8E3' },
  { dot: '#F2AA4C', bg: '#FEF3DC' },
  { dot: '#9B5DE5', bg: '#F3E8FF' },
  { dot: '#F72585', bg: '#FDE8F5' },
  { dot: '#2D6A4F', bg: '#D8F3DC' },
];

export default function MealCard({ meal, isFav, onOpenRecipe, onToggleFavorite }: MealCardProps) {
  const dayColor = DAY_COLORS[meal.dayIndex] ?? DAY_COLORS[0];

  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '20px',
        padding: '20px',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        transition: 'box-shadow 0.2s, transform 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
      onClick={() => onOpenRecipe(meal)}
    >
      {/* Day badge + favorite */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '20px',
            backgroundColor: dayColor.bg,
          }}
        >
          <div
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: dayColor.dot,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: dayColor.dot,
            }}
          >
            {meal.day}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(meal);
          }}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
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
          <Heart size={15} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Meal name + description */}
      <div>
        <h3
          style={{
            fontSize: '17px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
          }}
        >
          {meal.name}
        </h3>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            marginTop: '5px',
            lineHeight: 1.5,
          }}
        >
          {meal.description}
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Clock size={13} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
            {meal.cookingTime}分
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Flame size={13} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
            {meal.calories}kcal
          </span>
        </div>
      </div>
    </div>
  );
}
