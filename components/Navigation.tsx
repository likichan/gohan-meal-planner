'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, ShoppingCart, Heart } from 'lucide-react';

const navItems = [
  { href: '/', label: '今週の献立', icon: Calendar },
  { href: '/shopping', label: '買い物リスト', icon: ShoppingCart },
  { href: '/favorites', label: 'お気に入り', icon: Heart },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(247,245,240,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: 'var(--green-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              🍚
            </div>
            <span
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Gohan
            </span>
          </div>
        </Link>

        <nav style={{ display: 'flex', gap: '4px' }}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '400',
                  textDecoration: 'none',
                  backgroundColor: isActive ? 'var(--green-dark)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={15} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
