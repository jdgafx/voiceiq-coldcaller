import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import B2BScript from './pages/B2BScript';
import B2CScript from './pages/B2CScript';
import Objections from './pages/Objections';
import Products from './pages/Products';
import Leads from './pages/Leads';
import Compliance from './pages/Compliance';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: 240, overflowY: 'auto', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/b2b" element={<B2BScript />} />
            <Route path="/b2c" element={<B2CScript />} />
            <Route path="/objections" element={<Objections />} />
            <Route path="/products" element={<Products />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
