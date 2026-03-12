import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import B2BScript from './pages/B2BScript';
import Objections from './pages/Objections';
import Products from './pages/Products';
import Leads from './pages/Leads';
import Compliance from './pages/Compliance';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import Settings from './pages/Settings';
import AgentSetup from './pages/AgentSetup';
import Pipeline from './pages/Pipeline';

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= breakpoint);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

function AppShell() {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
      {/* Hamburger button — only visible on mobile */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(prev => !prev)}
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay — tap to close on mobile */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <Sidebar
        onNavigate={isMobile ? closeSidebar : undefined}
        mobileHidden={isMobile && !sidebarOpen}
      />

      {/* Main content */}
      <main
        className="main-content"
        style={{ flex: 1, marginLeft: isMobile ? 0 : 240, overflowY: 'auto', minHeight: '100vh', transition: 'margin-left 0.25s ease' }}
      >
        {/* Spacer for hamburger button on mobile */}
        {isMobile && <div style={{ height: 56 }} />}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/b2b" element={<B2BScript />} />
          <Route path="/objections" element={<Objections />} />
          <Route path="/products" element={<Products />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/agent-setup" element={<AgentSetup />} />
          <Route path="/pipeline" element={<Pipeline />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
