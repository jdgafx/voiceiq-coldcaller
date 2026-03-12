import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Bot, Phone, TrendingUp,
  Building2, MessageSquareWarning, Package, Target, ShieldCheck,
  Settings, BookOpen, ChevronRight, ChevronDown,
} from 'lucide-react';
import { getSettings } from '../data/store';

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
  padding: '10px 12px',
  borderRadius: 8,
  marginBottom: 2,
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: isActive ? 600 : 400,
  color: isActive ? '#60a5fa' : '#94a3b8',
  background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
  borderLeft: isActive ? '2px solid #3b82f6' : '2px solid transparent',
  transition: 'all 0.15s ease',
  minHeight: 44,
});

const playbookLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 12px',
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
  minHeight: 44,
});

interface SidebarProps {
  onNavigate?: () => void;
  mobileHidden?: boolean;
}

export default function Sidebar({ onNavigate, mobileHidden }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isPlaybookActive = PLAYBOOK_ROUTES.includes(location.pathname);
  const [playbookOpen, setPlaybookOpen] = useState(isPlaybookActive);
  const settings = getSettings();
  const agentConfigured = !!settings.b2bWebhookUrl;

  useEffect(() => {
    if (PLAYBOOK_ROUTES.includes(location.pathname)) {
      setPlaybookOpen(true);
    }
  }, [location.pathname]);

  function handleNavClick() {
    onNavigate?.();
  }

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
      transform: mobileHidden ? 'translateX(-100%)' : 'translateX(0)',
      transition: 'transform 0.25s ease',
    }}>
      <NavLink
        to="/"
        onClick={handleNavClick}
        style={{
          display: 'block',
          padding: '24px 20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          textDecoration: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Logo Mark */}
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(160deg, #0f2847 0%, #071526 60%, #0c1f3a 100%)',
            boxShadow: '0 0 0 1px rgba(56,189,248,0.12), 0 4px 14px rgba(0,0,0,0.5), 0 0 28px rgba(59,130,246,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            position: 'relative' as const,
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute' as const,
              top: 0, left: 0, right: 0, height: '50%',
              borderRadius: '12px 12px 0 0',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
              pointerEvents: 'none' as const,
            }} />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ position: 'relative' as const, zIndex: 1 }}>
              <defs>
                <linearGradient id="viq-pulse" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" />
                  <stop offset="0.45" stopColor="#60a5fa" />
                  <stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
                <filter id="viq-glow">
                  <feGaussianBlur stdDeviation="0.7" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#viq-glow)">
                <path
                  d="M2 12 L6 12 L8 8 L10 16 L12 4.5 L14 19.5 L16 8 L18 12 L22 12"
                  stroke="url(#viq-pulse)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </g>
              <circle cx="12" cy="4.5" r="1.3" fill="#60a5fa" opacity="0.5" />
            </svg>
          </div>
          {/* Brand Name */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <span style={{
                fontSize: 20,
                fontWeight: 300,
                color: '#94a3b8',
                letterSpacing: '0.5px',
              }}>Voice</span>
              <span style={{
                fontSize: 20,
                fontWeight: 800,
                background: 'linear-gradient(135deg, #60a5fa 0%, #22d3ee 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}>IQ</span>
            </div>
            <div style={{
              fontSize: 11,
              color: '#64748b',
              letterSpacing: '1.2px',
              textTransform: 'uppercase' as const,
              fontWeight: 500,
              marginTop: 2,
            }}>
              AI Cold Calling
            </div>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          paddingLeft: 52,
          marginTop: 6,
        }}>
          <div style={{
            width: 14,
            height: 1,
            background: 'linear-gradient(90deg, rgba(59,130,246,0.4), transparent)',
            borderRadius: 1,
          }} />
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500, letterSpacing: '0.3px' }}>
            Combined Insurance &bull; Chubb
          </span>
        </div>
      </NavLink>

      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={{
          marginBottom: 8,
          padding: '0 8px',
          fontSize: 12,
          fontWeight: 600,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          Main
        </div>

        {primaryItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} style={primaryLinkStyle} onClick={handleNavClick}>
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
              padding: '8px 8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginBottom: 4,
              minHeight: 36,
            }}
          >
            <BookOpen size={13} color="#64748b" />
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              flex: 1,
              textAlign: 'left',
            }}>
              Playbook
            </span>
            {playbookOpen
              ? <ChevronDown size={12} color="#64748b" />
              : <ChevronRight size={12} color="#64748b" />
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
                  <NavLink key={to} to={to} style={playbookLinkStyle} onClick={handleNavClick}>
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
          onClick={handleNavClick}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 10px',
            borderRadius: 8,
            marginBottom: 12,
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: isActive ? 600 : 400,
            color: isActive ? '#60a5fa' : '#64748b',
            background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
            borderLeft: isActive ? '2px solid #3b82f6' : '2px solid transparent',
            transition: 'all 0.15s ease',
            minHeight: 44,
          })}
        >
          <Settings size={15} />
          Settings
        </NavLink>

        <div
          onClick={() => { if (!agentConfigured) { navigate('/agent-setup'); handleNavClick(); } }}
          style={{
            background: agentConfigured ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
            border: `1px solid ${agentConfigured ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
            borderRadius: 8,
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: agentConfigured ? 'default' : 'pointer',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => !agentConfigured && (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)')}
          onMouseLeave={e => !agentConfigured && (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.2)')}
        >
          <div
            className={agentConfigured ? 'pulse-dot' : undefined}
            style={{ width: 8, height: 8, borderRadius: '50%', background: agentConfigured ? '#10b981' : '#f59e0b', flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: agentConfigured ? '#10b981' : '#f59e0b' }}>
              {agentConfigured ? 'Alex is Ready' : 'Alex'}
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              {agentConfigured ? 'AI Calling Agent • Online' : 'Tap to configure →'}
            </div>
          </div>
        </div>

        <p style={{ margin: '12px 0 0', fontSize: 12, color: '#475569', textAlign: 'center' }}>
          A+ AM Best • 100+ Years • 54 Countries
        </p>
      </div>
    </aside>
  );
}
