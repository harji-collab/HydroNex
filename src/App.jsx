import React, { useEffect, useMemo, useState } from 'react';
import { api } from './api/client';
import { waterbodies as demoWaterbodies, insights as demoInsights, systemStatus as demoStatus, kpis as demoKpis, overviewAreaTrend, overviewRainTrend } from './data/demo/demoData';
import { AppShell, StatePanel } from './components/UI';
import { OverviewPage, ExplorerPage, InsightsPage, MethodologyPage, ResponseAnalysisPage, SystemStatusPage, VulnerabilityMapPage, WaterbodyDetailPage } from './pages/Pages';

const getPath = () => window.location.pathname.replace(/\/$/, '') || '/';

export default function App() {
  const [path, setPath] = useState(getPath);
  const [data, setData] = useState({ waterbodies: [], insights: [], status: [], signals: { kpis: {}, areaTrend: [], rainTrend: [] }, ready: false });

  useEffect(() => {
    const onPopState = () => setPath(getPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([api.getWaterbodies(), api.getInsights(), api.getStatus(), api.getOverviewSignals()]).then(([waterbodies, insights, status, signals]) => {
      if (active) setData({ waterbodies, insights, status, signals, ready: true });
    }).catch((error) => { console.error('[HydroNex] Live API load failed:', error); if (active) setData((current) => ({ ...current, ready: true, error: error.message })); });
    return () => { active = false; };
  }, []);

  const navigate = (nextPath) => {
    if (nextPath === path) return;
    window.history.pushState({}, '', nextPath);
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const page = useMemo(() => {
    if (path === '/') return <OverviewPage data={data} navigate={navigate}/>;
    if (path === '/waterbodies') return <ExplorerPage data={data} navigate={navigate}/>;
    if (path.startsWith('/waterbodies/')) return <WaterbodyDetailPage data={data} id={path.split('/')[2]} navigate={navigate}/>;
    if (path === '/response-analysis') return <ResponseAnalysisPage data={data} navigate={navigate}/>;
    if (path === '/vulnerability-map') return <VulnerabilityMapPage data={data} navigate={navigate}/>;
    if (path === '/insights') return <InsightsPage data={data} navigate={navigate}/>;
    if (path === '/methodology') return <MethodologyPage data={data} navigate={navigate}/>;
    if (path === '/system-status') return <SystemStatusPage data={data} navigate={navigate}/>;
    return <div className="page"><StatePanel state="empty" title="This view is not in the current route manifest"><button className="btn primary" onClick={() => navigate('/')}>Return to command center</button></StatePanel></div>;
  }, [path, data]);

  return <AppShell path={path} navigate={navigate}><React.Fragment key={path}>{page}</React.Fragment></AppShell>;
}
