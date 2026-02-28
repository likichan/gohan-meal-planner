'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sparkles, RefreshCw, AlertCircle, Calendar } from 'lucide-react';
import { WeeklyPlan, Meal } from '@/lib/types';
import { saveWeeklyPlan, loadWeeklyPlan, saveFavorite, removeFavorite, isFavorite, loadFavorites } from '@/lib/storage';
import MealCard from '@/components/MealCard';
import RecipeModal from '@/components/RecipeModal';

export default function HomePage() {
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [favIds, setFavIds] = useState<Set<string>>(new Set());

  const refreshFavIds = useCallback(() => {
    const favs = loadFavorites();
    setFavIds(new Set(favs.map((f) => f.id)));
  }, []);

  useEffect(() => {
    const saved = loadWeeklyPlan();
    if (saved) setPlan(saved);
    refreshFavIds();
  }, [refreshFavIds]);

  const generatePlan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-plan', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Generation failed');

      const weekOf = getMonday();
      const newPlan: WeeklyPlan = { weekOf, ...data };
      setPlan(newPlan);
      saveWeeklyPlan(newPlan);
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleToggleFavorite = useCallback((meal: Meal) => {
    if (isFavorite(meal.id)) {
      removeFavorite(meal.id);
    } else {
      saveFavorite(meal);
    }
    refreshFavIds();
  }, [refreshFavIds]);

  const getMonday = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff)).toISOString().split('T')[0];
  };

  const formatWeekRange = (weekOf: string) => {
    const monday = new Date(weekOf);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const fmt = (d: Date) => d.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' });
    return `${fmt(monday)} 〜 ${fmt(sunday)}`;
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Page header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={20} style={{ color: 'var(--green-mid)' }} />
          {plan ? (
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              {formatWeekRange(plan.weekOf)}
            </span>
          ) : (
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>今週の献立</span>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
            }}
          >
            {plan ? '今週の夕食' : 'さあ、始めましょう'}
          </h1>
          <button
            onClick={generatePlan}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 22px',
              borderRadius: '14px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              backgroundColor: loading ? 'var(--border)' : 'var(--green-dark)',
              color: loading ? 'var(--text-muted)' : '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                生成中...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                {plan ? '再生成' : '献立を生成'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 24px',
            backgroundColor: 'var(--surface)',
            borderRadius: '24px',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🍳</div>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>
            AIが今週の献立を考えています...
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
            30秒ほどかかる場合があります
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '16px 20px',
            backgroundColor: '#FEF2F2',
            borderRadius: '14px',
            border: '1px solid #FCA5A5',
            marginBottom: '24px',
            color: '#991B1B',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600' }}>エラーが発生しました</p>
            <p style={{ fontSize: '13px', marginTop: '2px', opacity: 0.8 }}>{error}</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !plan && !error && (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 24px',
            backgroundColor: 'var(--surface)',
            borderRadius: '24px',
            border: '2px dashed var(--border)',
          }}
        >
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🥗</div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
            今週の献立を生成しましょう
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            AIが7日分のヘルシーな夕食を提案します。
            <br />
            買い物リストも自動で作成されます。
          </p>
        </div>
      )}

      {/* Meal grid */}
      {!loading && plan && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {plan.meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              isFav={favIds.has(meal.id)}
              onOpenRecipe={setSelectedMeal}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      {/* Recipe modal */}
      {selectedMeal && (
        <RecipeModal
          meal={selectedMeal}
          isFav={favIds.has(selectedMeal.id)}
          onClose={() => setSelectedMeal(null)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
