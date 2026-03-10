import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Bot, Phone, TrendingUp,
  Building2, MessageSquareWarning, Package, Target, ShieldCheck,
  Settings, BookOpen, ChevronRight, ChevronDown,
} from 'lucide-react';

interface NavItem {
  to: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  end?: boolean;
}

const primaryItems: NavItem[] = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/agent-setup', icon: Bot, label: 'Agents' },
  { to: '/campaigns', icon: Phone, label: 'Campaigns' },
  { to: '/pipeline', icon: TrendingUp, label: 'Pipeline' },
];

const playbookItems: NavItem[] = [
  { to: '/b2b', icon: Building2, label: 'B2B Script' },
  { to: '/objections', icon: MessageSquareWarning, label: 'Objections' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/leads', icon: Target, label: 'Lead Outcomes' },
  { to: '/compliance', icon: ShieldCheck, label: 'Compliance' },
];

const PLAYBOOK_ROUTES = ['/b2b', '/objections', '/products', '/leads', '/compliance'];

const primaryLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '9px 12px',
  borderRadius: 8,
  marginBottom: 2,
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: isActive ? 600 : 400,
  color: isActive ? '#60a5fa' : '#94a3b8',
  background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
  borderLeft: isActive ? '2px solid #3b82f6' : '2px solid transparent',
  transition: 'all 0.15s ease',
});

const playbookLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '9px 12px',
  paddingLeft: 20,
  borderRadius: 8,
  marginBottom: 2,
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: isActive ? 600 : 400,
  color: isActive ? '#60a5fa' : '#94a3b8',
  background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
  borderLeft: isActive ? '2px solid #3b82f6' : '2px solid rgba(255,255,255,0.06)',
  transition: 'all 0.15s ease',
});

export default function Sidebar() {
  const location = useLocation();
  const isPlaybookActive = PLAYBOOK_ROUTES.includes(location.pathname);
  const [playbookOpen, setPlaybookOpen] = useState(isPlaybookActive);

  useEffect(() => {
    if (PLAYBOOK_ROUTES.includes(location.pathname)) {
      setPlaybookOpen(true);
    }
  }, [location.pathname]);

  return (
    <aside style={{
      width: 240,
      minWidth: 240,
      background: '#0d0d14',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 50,
    }}>
      <NavLink
        to="/"
        style={{
          display: 'block',
          padding: '24px 20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          textDecoration: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(145deg, #162d50, #0b1a30)',
            boxShadow: '0 2px 12px rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <defs>
                <linearGradient id="viq-g" x1="10" y1="2" x2="10" y2="18" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60a5fa" />
                  <stop offset="1" stopColor="#2dd4bf" />
                </linearGradient>
              </defs>
              <rect x="1.5" y="5.5" width="2.4" height="9" rx="1.2" fill="url(#viq-g)" opacity="0.85" />
              <rect x="5.3" y="2.5" width="2.4" height="15" rx="1.2" fill="url(#viq-g)" />
              <rect x="8.8" y="7" width="2.4" height="6" rx="1.2" fill="url(#viq-g)" opacity="0.65" />
              <rect x="12.3" y="2.5" width="2.4" height="15" rx="1.2" fill="url(#viq-g)" />
              <rect x="16.1" y="5.5" width="2.4" height="9" rx="1.2" fill="url(#viq-g)" opacity="0.85" />
            </svg>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 19, fontWeight: 300, color: '#e2e8f0', letterSpacing: '-0.3px' }}>Voice</span>
            <span style={{ fontSize: 19, fontWeight: 800, color: '#60a5fa', letterSpacing: '-0.3px' }}>IQ</span>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 10, color: '#64748b', lineHeight: 1.4, paddingLeft: 42 }}>
          Combined Insurance • Chubb<br />Cold Call Playbook
        </p>
      </NavLink>

      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={{
          marginBottom: 8,
          padding: '0 8px',
          fontSize: 10,
          fontWeight: 600,
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          Main
        </div>

        {primaryItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} style={primaryLinkStyle}>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        <div style={{ margin: '16px 0 4px' }}>
          <button
            onClick={() => setPlaybookOpen(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '4px 8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginBottom: 4,
            }}
          >
            <BookOpen size={12} color="#475569" />
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              flex: 1,
              textAlign: 'left',
            }}>
              Playbook
            </span>
            {playbookOpen
              ? <ChevronDown size={12} color="#475569" />
              : <ChevronRight size={12} color="#475569" />
            }
          </button>

          <AnimatePresence initial={false}>
            {playbookOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                {playbookItems.map(({ to, icon: Icon, label }) => (
                  <NavLink key={to} to={to} style={playbookLinkStyle}>
                    <Icon size={16} />
                    {label}
                  </NavLink>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 10px',
            borderRadius: 8,
            marginBottom: 12,
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: isActive ? 600 : 400,
            color: isActive ? '#60a5fa' : '#64748b',
            background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
            borderLeft: isActive ? '2px solid #3b82f6' : '2px solid transparent',
            transition: 'all 0.15s ease',
          })}
        >
          <Settings size={15} />
          Settings
        </NavLink>

        <div style={{
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 8,
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <div
            className="pulse-dot"
            style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', flexShrink: 0 }}
          />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#10b981' }}>Alex is Ready</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>AI Calling Agent • Online</div>
          </div>
        </div>

        <p style={{ margin: '12px 0 0', fontSize: 10, color: '#334155', textAlign: 'center' }}>
          A+ AM Best • 100+ Years • 54 Countries
        </p>
      </div>
    </aside>
  );
}
