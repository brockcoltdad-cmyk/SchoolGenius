'use client';

import { useTheme } from '@/lib/theme-context';

export default function ThemeTest() {
  const { currentTheme } = useTheme();

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(to bottom right, ${currentTheme.colors.background})`,
      padding: '2rem',
      color: currentTheme.colors.text
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#000' }}>
          Theme Diagnostic
        </h1>

        <div style={{ marginBottom: '1rem' }}>
          <strong>Theme ID:</strong> {currentTheme.id}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <strong>Theme Name:</strong> {currentTheme.name}
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '1.5rem 0 1rem', color: '#000' }}>
          Colors
        </h2>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <strong>Primary:</strong> {currentTheme.colors.primary}
            <div style={{
              width: '100px',
              height: '40px',
              backgroundColor: currentTheme.colors.primary,
              border: '1px solid #ccc',
              marginTop: '0.5rem'
            }} />
          </div>

          <div>
            <strong>Secondary:</strong> {currentTheme.colors.secondary}
            <div style={{
              width: '100px',
              height: '40px',
              backgroundColor: currentTheme.colors.secondary,
              border: '1px solid #ccc',
              marginTop: '0.5rem'
            }} />
          </div>

          <div>
            <strong>Accent:</strong> {currentTheme.colors.accent}
            <div style={{
              width: '100px',
              height: '40px',
              backgroundColor: currentTheme.colors.accent,
              border: '1px solid #ccc',
              marginTop: '0.5rem'
            }} />
          </div>

          <div>
            <strong>Text:</strong> {currentTheme.colors.text}
            <div style={{
              width: '100px',
              height: '40px',
              backgroundColor: currentTheme.colors.text,
              border: '1px solid #ccc',
              marginTop: '0.5rem'
            }} />
          </div>

          <div>
            <strong>Text Secondary:</strong> {currentTheme.colors.textSecondary}
            <div style={{
              width: '100px',
              height: '40px',
              backgroundColor: currentTheme.colors.textSecondary,
              border: '1px solid #ccc',
              marginTop: '0.5rem'
            }} />
          </div>

          <div>
            <strong>Background:</strong> {currentTheme.colors.background}
          </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '1.5rem 0 1rem', color: '#000' }}>
          Classes
        </h2>

        <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.875rem' }}>
          <div><strong>Button Class:</strong> {currentTheme.buttonClass}</div>
          <div><strong>Card Class:</strong> {currentTheme.cardClass}</div>
          <div><strong>Border Class:</strong> {currentTheme.borderClass}</div>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          borderRadius: '0.5rem',
          backgroundColor: '#f0f9ff'
        }}>
          <p style={{ color: '#1e40af', fontWeight: '600' }}>
            If you can read this entire diagnostic page clearly, the theme is loading correctly.
          </p>
        </div>
      </div>
    </div>
  );
}
