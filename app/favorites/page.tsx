'use client';

import { useState, useEffect, useCallback } from 'react';
import { Heart, Trash2, Clock, Flame } from 'lucide-react';
import { FavoriteMeal, Meal } from '@/lib/types';
import { loadFavorites, removeFavorite, isFavorite } from '@/lib/storage';
import RecipeModal from '@/components/RecipeModal';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteMeal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const reload = useCallback(() => {
    setFavorites(loadFavorites());
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleRemove = (id: string) => {
    removeFavorite(id);
    reload();
    if (selectedMeal?.id === id) setSelectedMeal(null);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Heart size={20} style={{ color: 'var(--coral)' }} />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
            保存したレシピ
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
            お気に入り
          </h1>
          {favorites.length > 0 && (
            <span
              style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                fontWeight: '500',
              }}
            >
              {favorites.length}件
            </span>
          )}
        </div>
      </div>

      {/* Empty state */}
      {favorites.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 24px',
            backgroundColor: 'var(--surface)',
            borderRadius: '24px',
            border: '2px dashed var(--border)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💝</div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
            まだお気に入りがありません
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            気に入ったレシピの ♡ をタップして保存しましょう
          </p>
        </div>
      )}

      {/* Favorites list */}
      {favorites.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            overflow: 'hidden',
          }}
        >
          {favorites.map((fav, idx) => {
            const meal = fav.meal;
            const savedDate = new Date(fav.savedAt).toLocaleDateString('ja-JP', {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={fav.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '18px 20px',
                  borderBottom: idx < favorites.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }}
                onClick={() => setSelectedMeal(meal)}
              >
                {/* Heart icon */}
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--coral-pale)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Heart size={18} fill="var(--coral)" style={{ color: 'var(--coral)' }} />
                </div>

                {/* Meal info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {meal.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {meal.cookingTime}分
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Flame size={12} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {meal.calories}kcal
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {savedDate}保存
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div
                  style={{ display: 'flex', gap: '4px', flexShrink: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {meal.tags.slice(0, 1).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '3px 8px',
                        borderRadius: '20px',
                        backgroundColor: 'var(--surface-2)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(fav.id);
                  }}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    color: 'var(--text-muted)',
                    flexShrink: 0,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#FEF2F2';
                    (e.currentTarget as HTMLElement).style.color = '#EF4444';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Recipe modal */}
      {selectedMeal && (
        <RecipeModal
          meal={selectedMeal}
          isFav={isFavorite(selectedMeal.id)}
          onClose={() => setSelectedMeal(null)}
          onToggleFavorite={(meal) => {
            handleRemove(meal.id);
          }}
        />
      )}
    </div>
  );
}
