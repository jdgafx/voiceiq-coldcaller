import { NavLink } from 'react-router-dom';
import { Zap, LayoutDashboard, Building2, User, MessageSquareWarning, Package, Target, ShieldCheck, Phone, Settings } from 'lucide-react';

const playbookItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/b2b', icon: Building2, label: 'B2B Script' },
  { to: '/b2c', icon: User, label: 'B2C Script' },
  { to: '/objections', icon: MessageSquareWarning, label: 'Objections' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/leads', icon: Target, label: 'Lead Outcomes' },
  { to: '/compliance', icon: ShieldCheck, label: 'Compliance' },
];

const callingItems = [
  { to: '/campaigns', icon: Phone, label: 'Campaigns' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside style={{ width: 240, minWidth: 240, background: '#0d0d14', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 50 }}>
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #3b82f6, #14b8a6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' }}>VoiceIQ</span>
        </div>
        <p style={{ margin: 0, fontSize: 10, color: '#64748b', lineHeight: 1.4, paddingLeft: 42 }}>
          Combined Insurance • Chubb<br />Cold Call Playbook
        </p>
      </div>

      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 8, padding: '0 8px', fontSize: 10, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Playbook
        </div>
        {playbookItems.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, marginBottom: 2,
              textDecoration: 'none', fontSize: 14, fontWeight: isActive ? 600 : 400,
              color: isActive ? '#60a5fa' : '#94a3b8',
              background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
              borderLeft: isActive ? '2px solid #3b82f6' : '2px solid transparent',
              transition: 'all 0.15s ease',
            })}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        <div style={{ margin: '16px 0 8px', padding: '0 8px', fontSize: 10, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          AI Calling
        </div>
        {callingItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, marginBottom: 2,
              textDecoration: 'none', fontSize: 14, fontWeight: isActive ? 600 : 400,
              color: isActive ? '#60a5fa' : '#94a3b8',
              background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
              borderLeft: isActive ? '2px solid #3b82f6' : '2px solid transparent',
              transition: 'all 0.15s ease',
            })}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
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
