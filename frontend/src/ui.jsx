import { Link } from 'react-router-dom';

export function PageShell({ eyebrow, title, subtitle, actions, children, className = '' }) {
  return (
    <section className={`page-shell ${className}`.trim()}>
      {(eyebrow || title || subtitle || actions) && (
        <header className="page-header">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h1>{title}</h1>}
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="page-actions">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

export function SurfaceCard({ children, className = '', padded = true }) {
  return <div className={`surface-card ${padded ? 'surface-card--padded' : ''} ${className}`.trim()}>{children}</div>;
}

export function SectionHeader({ eyebrow, title, subtitle, actions, compact = false }) {
  return (
    <div className={`section-header ${compact ? 'section-header--compact' : ''}`}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {title && <h2>{title}</h2>}
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="section-actions">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, tone = 'emerald' }) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      {hint && <span>{hint}</span>}
    </div>
  );
}

export function Badge({ children, tone = 'emerald' }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export function EmptyState({ title, description, actionLabel, onAction, secondaryLabel, secondaryTo }) {
  return (
    <div className="empty-state">
      <div className="empty-state__orb" />
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="empty-state__actions">
        {actionLabel && (
          <button className="btn btn-primary" type="button" onClick={onAction}>
            {actionLabel}
          </button>
        )}
        {secondaryLabel && secondaryTo && (
          <Link className="btn btn-secondary" to={secondaryTo}>
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

export function AuthLayout({ badge, title, subtitle, highlights = [], footer, children }) {
  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <div className="brand-mark">HomeChef</div>
        {badge && <p className="eyebrow">{badge}</p>}
        <h1>{title}</h1>
        <p className="auth-copy">{subtitle}</p>

        {highlights.length > 0 && (
          <div className="auth-highlights">
            {highlights.map((item) => (
              <div key={item.title} className="auth-highlight">
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="auth-panel">
        <div className="surface-card surface-card--padded auth-card">{children}</div>
        {footer && <p className="auth-footer">{footer}</p>}
      </div>
    </div>
  );
}
