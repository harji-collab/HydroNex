import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { areaPath, linePath } from '../utils/risk';
import { formatArea, formatPercent, formatScore } from '../utils/formatters';
import { riskClass, riskTone } from '../utils/risk';

const navItems = [
  ['/', 'Overview', 'grid'],
  ['/waterbodies', 'Waterbodies', 'droplet'],
  ['/response-analysis', 'Response Analysis', 'activity'],
  ['/vulnerability-map', 'Vulnerability Map', 'map'],
  ['/insights', 'Insights', 'spark'],
  ['/methodology', 'Methodology', 'layers'],
];

export function Icon({ name, size = 18, strokeWidth = 1.8 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  const paths = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),

    droplet: (
      <>
        <path d="M12 3.5S6.5 10 6.5 14.4a5.5 5.5 0 0 0 11 0C17.5 10 12 3.5 12 3.5Z" />
        <path d="M9 15.2c.2 1.2 1.1 2.1 2.4 2.5" />
      </>
    ),

    activity: (
      <>
        <path d="M3 12h4l2.2-7 4.1 14 2.2-7H21" />
      </>
    ),

    map: (
      <>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
        <path d="M9 3v15M15 6v15" />
      </>
    ),

    spark: (
      <>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        <circle cx="12" cy="12" r="4" />
      </>
    ),

    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),

    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.6V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.6h.4A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1L9.4 6l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.1H15v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3L18 6l1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v2.6H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),

    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 5 5" />
      </>
    ),

    plus: <path d="M12 5v14M5 12h14" />,

    minus: <path d="M5 12h14" />,

    maximize: (
      <>
        <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5" />
      </>
    ),

    refresh: (
      <>
        <path d="M20 11a8 8 0 0 0-14.7-4L3 10" />
        <path d="M3 5v5h5" />
        <path d="M4 13a8 8 0 0 0 14.7 4L21 14" />
        <path d="M21 19v-5h-5" />
      </>
    ),

    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),

    check: <path d="m5 12 4 4L19 6" />,

    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),

    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),

    chevron: <path d="m7 10 5 5 5-5" />,

    shield: (
      <>
        <path d="M12 3 20 6v5c0 5-3.2 8.1-8 10-4.8-1.9-8-5-8-10V6l8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] || paths.info}</svg>;
}

export function Brand({ compact = false }) {
  return (
    <div className="brand" aria-label="HydroNex home">
      <div className="brand-mark">
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M4 18c3.2-6.2 7.4-9.3 12-9.3S24.8 11.8 28 18c-3.2 5.1-7.2 7.3-12 7.3S7.2 23.1 4 18Z"
            fill="#0c4a63"
            stroke="#5ce1e6"
            strokeWidth="1.5"
          />
          <path
            d="M8.4 17.7c2.1-3 4.6-4.6 7.6-4.6s5.5 1.6 7.6 4.6c-2.1 3.1-4.6 4.3-7.6 4.3s-5.5-1.2-7.6-4.3Z"
            fill="#5ce1e6"
          />
          <path
            d="M5 8c2.8 2.1 5.6 3.1 8.5 3.1 4.7 0 8.5-2 12.7-6"
            stroke="#86f7d0"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {!compact && (
        <div className="brand-text">
          <div className="brand-name">HYDRONEX</div>
          <div className="brand-caption">Water resilience intelligence</div>
        </div>
      )}
    </div>
  );
}

export function Sidebar({ path, navigate }) {
  return (
    <aside className="sidebar">
      <Brand />

      <div className="nav-label">Workspace</div>

      <nav className="nav" aria-label="Primary navigation">
        {navItems.map(([href, label, icon]) => (
          <a
            key={href}
            href={href}
            className={`nav-link ${
              path === href ||
              (href === '/waterbodies' && path.startsWith('/waterbodies/'))
                ? 'active'
                : ''
            }`}
            onClick={(event) => {
              event.preventDefault();
              navigate(href);
            }}
          >
            <Icon name={icon} />
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <div className="nav-label" style={{ marginTop: 25 }}>
        Operations
      </div>

      <nav className="nav">
        <a
          href="/system-status"
          className={`nav-link ${
            path === '/system-status' ? 'active' : ''
          }`}
          onClick={(event) => {
            event.preventDefault();
            navigate('/system-status');
          }}
        >
          <Icon name="settings" />
          <span>System status</span>
        </a>
      </nav>

      <div className="sidebar-bottom">
        <div className="status-mini">
          <div className="status-mini-row">
            <span>
              <i className="status-dot" />
              Data mode
            </span>

            <strong
              className="mono"
              style={{
                color: 'var(--green)',
                fontSize: 10,
              }}
            >
              LIVE
            </strong>
          </div>

          <div className="status-mini-row">
            <span>
              <i className="status-dot" />
              Pipeline
            </span>

            <strong
              className="mono"
              style={{
                color: 'var(--green)',
                fontSize: 10,
              }}
            >
              READY
            </strong>
          </div>
        </div>

        <div
          style={{
            color: 'var(--faint)',
            fontSize: 10,
            lineHeight: 1.5,
            padding: '0 10px',
          }}
        >
          Built for rainfall–surface water response analysis.
          <br />
          <span className="mono">v0.1.0 · 30 SEP 2026</span>
        </div>
      </div>
    </aside>
  );
}

const pageNames = {
  '/': 'Overview / Command Center',
  '/waterbodies': 'Waterbody Explorer',
  '/response-analysis': 'Response Analysis',
  '/vulnerability-map': 'Vulnerability Map',
  '/insights': 'Insights & Recommendations',
  '/methodology': 'How HydroNex Works',
  '/system-status': 'System / Data Status',
};

export function AppShell({ path, navigate, children }) {
  const title = path.startsWith('/waterbodies/')
    ? 'Waterbody Detail / Analysis'
    : pageNames[path] || 'HydroNex Intelligence';

  return (
    <div className="app">
      <Sidebar path={path} navigate={navigate} />

      <main className="main">
        <header className="topbar">
          <div>
            <div className="eyebrow">
              Geospatial intelligence for water resilience
            </div>

            <div className="page-title">{title}</div>
          </div>

          <div className="top-actions">
            <span className="data-badge">
              <i
                className="status-dot"
                style={{ margin: 0 }}
              />
              <span>Live data</span>
            </span>

            <span
              className="mono"
              style={{
                color: 'var(--faint)',
                fontSize: 10,
              }}
            >
              <Icon name="clock" size={12} /> Live
            </span>

            <select
              className="select"
              aria-label="Region"
            >
              <option>India · All regions</option>
              <option>Chennai Basin</option>
              <option>Central Basin</option>
              <option>Southern Coast</option>
            </select>

            <button
              className="icon-btn"
              aria-label="Open system status"
              onClick={() => navigate('/system-status')}
            >
              <Icon name="settings" size={16} />
            </button>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

export function Panel({
  children,
  className = '',
  pad = true,
  ...props
}) {
  return (
    <section
      className={`panel ${className}`}
      {...props}
    >
      {pad ? (
        <div className="panel-pad">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  subtitle,
  action,
}) {
  return (
    <div className="panel-head">
      <div>
        {eyebrow && (
          <div className="eyebrow">{eyebrow}</div>
        )}

        <h2 className="panel-title">{title}</h2>

        {subtitle && (
          <div className="panel-subtitle">{subtitle}</div>
        )}
      </div>

      {action && (
        <div className="panel-actions">
          {action}
        </div>
      )}
    </div>
  );
}

export function RiskBadge({ level }) {
  return (
    <span className={`risk-badge ${riskClass(level)}`}>
      <i className="risk-icon" />
      {level}
    </span>
  );
}

export function DemoNote({
  children = 'Demonstration snapshot · not a live Earth Engine result',
}) {
  return (
    <span
      className="mono"
      style={{
        color: 'var(--faint)',
        fontSize: 9,
      }}
    >
      {children}
    </span>
  );
}

export function MetricCard({
  label,
  value,
  suffix = '',
  foot,
  tone = 'default',
  decimals = 0,
}) {
  const [display, setDisplay] = useState(0);

  const numeric =
    typeof value === 'number'
      ? value
      : parseFloat(value);

  useEffect(() => {
    let start = 0;

    const end = Number.isFinite(numeric)
      ? numeric
      : 0;

    const duration = 650;

    const tick = (time) => {
      if (!start) start = time;

      const progress = Math.min(
        (time - start) / duration,
        1
      );

      setDisplay(
        end * (1 - Math.pow(1 - progress, 3))
      );

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [numeric]);

  const rendered =
    typeof value === 'string' &&
    !Number.isFinite(numeric)
      ? value
      : display.toFixed(decimals);

  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>

      <div className={`kpi-value ${tone}`}>
        {rendered}
        <small>{suffix}</small>
      </div>

      <div className="kpi-foot">
        <span>{foot}</span>

        {tone === 'danger' ? (
          <strong className="danger">attention</strong>
        ) : tone === 'warn' ? (
          <strong className="warn">watch</strong>
        ) : (
          <strong>tracking</strong>
        )}
      </div>
    </div>
  );
}

export function Sparkline({
  values,
  color = 'var(--cyan)',
  height = 65,
  fill = true,
}) {
  if (!values?.length) {
    return (
      <div
        className="skeleton"
        style={{ height }}
      />
    );
  }

  const path = linePath(values, 420, 90, 6);
  const fillPath = areaPath(values, 420, 90, 6);

  return (
    <svg
      className="sparkline"
      viewBox="0 0 420 90"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="sparkGradient"
          x1="0"
          x2="0"
          y1="0"
          y2="1"
        >
          <stop
            offset="0"
            stopColor={color}
          />

          <stop
            offset="1"
            stopColor={color}
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      {fill && (
        <path
          className="area"
          d={fillPath}
          fill="url(#sparkGradient)"
        />
      )}

      <path
        className="line"
        d={path}
        style={{ stroke: color }}
      />
    </svg>
  );
}

export function Bars({
  values,
  labels = [
    'O',
    'N',
    'D',
    'J',
    'F',
    'M',
    'A',
    'M',
    'J',
    'J',
    'A',
    'S',
  ],
  color = 'cyan',
}) {
  if (!values?.length) {
    return (
      <div
        className="empty-state"
        style={{ padding: 20 }}
      >
        No time-series data available.
      </div>
    );
  }

  const max = Math.max(...values);

  return (
    <>
      <div className="bar-chart">
        {values.map((value, index) => (
          <div
            key={index}
            className="bar"
            style={{
              height: `${Math.max(
                13,
                (value / max) * 100
              )}%`,
              animationDelay: `${index * 35}ms`,
              background:
                color === 'rain'
                  ? 'linear-gradient(180deg, var(--blue), rgba(110,168,255,.12))'
                  : undefined,
            }}
            title={`${labels[index] || ''}: ${value}`}
          />
        ))}
      </div>

      <div className="axis">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </>
  );
}

export function ResponseChart({
  waterValues,
  rainValues,
  height = 282,
}) {
  if (
    !waterValues?.length ||
    !rainValues?.length
  ) {
    return (
      <div
        className="empty-state"
        style={{
          minHeight: height,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <div>
          <strong>
            Running geospatial analysis…
          </strong>

          <span>
            Waiting for aligned rainfall and
            surface-water observations.
          </span>
        </div>
      </div>
    );
  }

  const normalize = (values) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;

    return values.map(
      (v) => (v - min) / span
    );
  };

  const waterPath = linePath(
    normalize(waterValues),
    800,
    220,
    8
  );

  const rainPath = linePath(
    normalize(rainValues),
    800,
    220,
    8
  );

  return (
    <div
      className="response-chart"
      style={{ minHeight: height }}
    >
      <div className="response-grid" />

      <div className="response-axis y">
        <span>high</span>
        <span>baseline</span>
        <span>low</span>
      </div>

      <svg
        className="response-svg"
        viewBox="0 0 800 220"
        preserveAspectRatio="none"
      >
        <path
          className="rain-line"
          d={rainPath}
        />

        <path
          className="water-line"
          d={waterPath}
        />
      </svg>

      <div className="response-axis x">
        <span>Oct 23</span>
        <span>Jun 24</span>
        <span>Jan 25</span>
        <span>Sep 25</span>
      </div>
    </div>
  );
}

/* =========================================================
   REAL SATELLITE MAP
   ========================================================= */

export function MapSurface({
  selectedId,
  onSelect,
  items = [],
  compact = false,
  metric = 'vulnerability',
  showPopup = false,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [layers, setLayers] = useState({
    water: true,
    vulnerability: true,
    anomaly: false,
    loss: false,
    extent: false,
    boundaries: false,
  });

  const selected =
    items.find(
      (item) => item.id === selectedId
    ) || items[0];

  const metricColor = (water) => {
    if (metric === 'vulnerability') {
      if (
        water.vulnerabilityLevel === 'Critical' ||
        water.vulnerabilityLevel === 'High'
      ) {
        return '#ff6f78';
      }

      if (
        water.vulnerabilityLevel === 'Moderate'
      ) {
        return '#f2b66a';
      }

      return '#55d69a';
    }

    if (metric === 'water loss') {
      return water.areaChangePercent < 0
        ? '#ff6f78'
        : '#55d69a';
    }

    if (metric === 'rainfall anomaly') {
      return water.rainfallAnomalyPercent < 0
        ? '#f2b66a'
        : '#55d69a';
    }

    if (metric === 'response score') {
      return water.responseScore >= 0.7
        ? '#ff6f78'
        : '#6ea8ff';
    }

    return water.color || '#5ce1e6';
  };

  const toggleLayer = (key) => {
    setLayers((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  /* Create Leaflet map */
  useEffect(() => {
    if (
      !mapContainerRef.current ||
      mapInstanceRef.current
    ) {
      return;
    }

    const initial =
      selected || items[0];

    const lat =
      Number(initial?.lat) ||
      13.01158;

    const lon =
      Number(initial?.lon) ||
      80.06063;

    const map = L.map(
      mapContainerRef.current,
      {
        zoomControl: false,
        attributionControl: true,
      }
    ).setView(
      [lat, lon],
      compact ? 11 : 13
    );

    /*
     * Real satellite imagery.
     */
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution:
          '© Esri, Maxar, Earthstar Geographics, and the GIS User Community',
      }
    ).addTo(map);

    /*
     * Place labels over satellite imagery.
     */
    L.tileLayer(
      'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        opacity: 0.9,
        attribution: 'Esri',
      }
    ).addTo(map);

    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(map);

    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = [];
    };
  }, []);

  /*
   * Render live waterbody markers.
   */
  useEffect(() => {
    const map =
      mapInstanceRef.current;

    if (!map) return;

    markersRef.current.forEach(
      (marker) => marker.remove()
    );

    markersRef.current = [];

    if (!layers.water) return;

    items.forEach((water) => {
      const lat = Number(water.lat);
      const lon = Number(water.lon);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lon)
      ) {
        return;
      }

      const color =
        metricColor(water);

      const isSelected =
        water.id === selectedId;

      const marker =
        L.circleMarker(
          [lat, lon],
          {
            radius: isSelected
              ? 13
              : 9,

            color,

            weight: isSelected
              ? 3
              : 2,

            fillColor: color,

            fillOpacity:
              isSelected
                ? 0.9
                : 0.7,
          }
        );

      const popupHTML = `
        <div style="
          min-width:240px;
          font-family:Arial,sans-serif;
          color:#10212b;
          line-height:1.5;
        ">
          <div style="
            font-size:10px;
            text-transform:uppercase;
            letter-spacing:1.5px;
            color:#647783;
            margin-bottom:5px;
          ">
            HYDRONEX · LIVE ANALYSIS
          </div>

          <div style="
            font-size:18px;
            font-weight:700;
            margin-bottom:10px;
          ">
            ${water.name || water.short || 'Waterbody'}
          </div>

          <div style="
            display:grid;
            gap:6px;
            font-size:12px;
          ">
            <div>
              <b>Current extent:</b>
              ${water.currentArea ?? '—'} km²
            </div>

            <div>
              <b>Area change:</b>
              ${water.areaChangePercent ?? '—'}%
            </div>

            <div>
              <b>Rainfall anomaly:</b>
              ${water.rainfallAnomalyPercent ?? '—'}%
            </div>

            <div>
              <b>Response score:</b>
              ${water.responseScore ?? '—'}
            </div>

            <div>
              <b>Vulnerability:</b>
              ${water.vulnerabilityLevel || '—'}
            </div>
          </div>

          <div style="
            margin-top:10px;
            padding-top:8px;
            border-top:1px solid #dbe3e7;
            font-size:10px;
            color:#647783;
          ">
            Sentinel-2 + CHIRPS · HydroNex
          </div>
        </div>
      `;

      marker.bindPopup(
        popupHTML
      );

      marker.on(
        'click',
        () => {
          onSelect?.(water.id);
        }
      );

      marker.addTo(map);

      markersRef.current.push(
        marker
      );
    });
  }, [
    items,
    selectedId,
    layers.water,
    metric,
  ]);

  /*
   * Fly to selected waterbody.
   */
  useEffect(() => {
    const map =
      mapInstanceRef.current;

    if (
      !map ||
      !selected
    ) {
      return;
    }

    const lat =
      Number(selected.lat);

    const lon =
      Number(selected.lon);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon)
    ) {
      return;
    }

    map.flyTo(
      [lat, lon],
      compact ? 11 : 13,
      {
        duration: 0.8,
      }
    );

    const selectedMarker =
      markersRef.current.find(
        (marker) => {
          const position =
            marker.getLatLng();

          return (
            Math.abs(
              position.lat - lat
            ) < 0.00001 &&
            Math.abs(
              position.lng - lon
            ) < 0.00001
          );
        }
      );

    if (
      selectedMarker &&
      showPopup
    ) {
      selectedMarker.openPopup();
    }
  }, [
    selectedId,
    selected,
    compact,
    showPopup,
  ]);

  return (
    <div
      className={`map-surface ${
        compact
          ? 'compact-map'
          : ''
      }`}
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header overlay */}
      <div
        className="map-caption"
        style={{
          zIndex: 1000,
          pointerEvents: 'none',
        }}
      >
        <div className="eyebrow">
          {compact
            ? 'LIVE SATELLITE LAYER'
            : 'Geospatial water intelligence'}
        </div>

        {!compact && (
          <>
            <h2>
              Where water resilience is shifting
            </h2>

            <p>
              Sentinel-2 surface-water
              analysis with CHIRPS
              rainfall context
            </p>
          </>
        )}
      </div>

      {/* Real Leaflet map */}
      <div
        ref={mapContainerRef}
        className="hydronex-leaflet-map"
        aria-label="HydroNex satellite map"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />

      {!compact && (
        <>
          {/* Legend */}
          <div
            className="map-legend"
            style={{
              zIndex: 1000,
            }}
          >
            <span className="legend-item">
              <i
                className="legend-dot"
                style={{
                  background:
                    'var(--green)',
                }}
              />
              Low
            </span>

            <span className="legend-item">
              <i
                className="legend-dot"
                style={{
                  background:
                    'var(--amber)',
                }}
              />
              Moderate
            </span>

            <span className="legend-item">
              <i
                className="legend-dot"
                style={{
                  background:
                    'var(--red)',
                }}
              />
              High / critical
            </span>
          </div>

          {/* Coordinates */}
          <div
            className="map-readout"
            style={{
              zIndex: 1000,
            }}
          >
            {selected
              ? `${Number(
                  selected.lat
                ).toFixed(
                  5
                )}° N · ${Number(
                  selected.lon
                ).toFixed(
                  5
                )}° E`
              : '13.01158° N · 80.06063° E'}

            <br />

            SENTINEL-2 + CHIRPS · LIVE ANALYSIS
          </div>

          {/* Layer controls */}
          <div
            className="map-layer-control"
            style={{
              zIndex: 1000,
            }}
          >
            <button
              className={`btn ${
                layers.water
                  ? 'primary'
                  : 'ghost'
              }`}
              onClick={() =>
                toggleLayer(
                  'water'
                )
              }
            >
              Waterbodies
            </button>

            <button
              className={`btn ${
                layers.vulnerability
                  ? 'primary'
                  : 'ghost'
              }`}
              onClick={() =>
                toggleLayer(
                  'vulnerability'
                )
              }
            >
              Vulnerability
            </button>

            <button
              className={`btn ${
                layers.loss
                  ? 'primary'
                  : 'ghost'
              }`}
              onClick={() =>
                toggleLayer(
                  'loss'
                )
              }
            >
              Water-loss hotspots
            </button>

            <button
              className={`btn ${
                layers.anomaly
                  ? 'primary'
                  : 'ghost'
              }`}
              onClick={() =>
                toggleLayer(
                  'anomaly'
                )
              }
            >
              Rainfall anomaly
            </button>

            <button
              className={`btn ${
                layers.extent
                  ? 'primary'
                  : 'ghost'
              }`}
              onClick={() =>
                toggleLayer(
                  'extent'
                )
              }
            >
              Water extent
            </button>

            <button
              className={`btn ${
                layers.boundaries
                  ? 'primary'
                  : 'ghost'
              }`}
              onClick={() =>
                toggleLayer(
                  'boundaries'
                )
              }
            >
              Admin boundaries
            </button>
          </div>
        </>
      )}

      {/* Selected waterbody information */}
      {showPopup &&
        selected && (
          <div
            className="map-popup"
            style={{
              zIndex: 1000,
            }}
          >
            <div className="eyebrow">
              Selected waterbody
            </div>

            <strong>
              {selected.name}
            </strong>

            <span>
              {formatArea(
                selected.currentArea
              )}{' '}
              ·{' '}
              {formatPercent(
                selected.areaChangePercent
              )}{' '}
              area change
            </span>

            <RiskBadge
              level={
                selected.vulnerabilityLevel
              }
            />
          </div>
        )}

      {compact && (
        <div
          className="map-legend"
          style={{
            zIndex: 1000,
          }}
        >
          <span className="legend-item">
            <i
              className="legend-dot"
              style={{
                background:
                  metric ===
                  'vulnerability'
                    ? 'var(--red)'
                    : 'var(--cyan)',
              }}
            />

            {metric} view
          </span>

          <span
            className="mono"
            style={{
              color: 'white',
              fontSize: 9,
            }}
          >
            click a waterbody
            to inspect
          </span>
        </div>
      )}
    </div>
  );
}

export function StatePanel({
  state = 'empty',
  title,
  children,
}) {
  return (
    <div className="empty-state">
      <strong>
        {title ||
          (state === 'loading'
            ? 'Loading intelligence…'
            : state === 'error'
            ? 'Unable to load analysis'
            : 'No analysis available')}
      </strong>

      <span>
        {children ||
          (state === 'loading'
            ? 'HydroNex is preparing the latest observation set.'
            : state === 'error'
            ? 'Please try again or continue in Live Mode.'
            : 'Try a different waterbody or date range.')}
      </span>
    </div>
  );
}

export function MiniWaterIcon() {
  return (
    <div className="water-icon">
      <Icon name="droplet" size={21} />
    </div>
  );
}

export function WaterbodyLink({
  water,
  navigate,
}) {
  return (
    <button
      className="btn primary"
      onClick={() =>
        navigate(
          `/waterbodies/${water.id}`
        )
      }
    >
      View full analysis
      <Icon name="arrow" size={13} />
    </button>
  );
}

export function WaterbodyName({
  water,
  navigate,
}) {
  return (
    <button
      onClick={() =>
        navigate(
          `/waterbodies/${water.id}`
        )
      }
      style={{
        background: 'none',
        border: 0,
        color: 'var(--text)',
        padding: 0,
        fontWeight: 600,
        textAlign: 'left',
      }}
    >
      {water.name}
    </button>
  );
}

export function Trend({ value }) {
  const cls =
    value === 'Recovering'
      ? 'trend-up'
      : value === 'Declining'
      ? 'trend-down'
      : 'trend-flat';

  return (
    <span className={cls}>
      {value === 'Recovering'
        ? '↗'
        : value === 'Declining'
        ? '↘'
        : '→'}{' '}
      {value}
    </span>
  );
}

export function Select({
  label,
  children,
  ...props
}) {
  return (
    <label
      style={{
        display: 'grid',
        gap: 6,
        color: 'var(--muted)',
        fontSize: 10,
      }}
    >
      {label && (
        <span
          className="eyebrow"
          style={{
            color: 'var(--faint)',
            fontSize: 9,
          }}
        >
          {label}
        </span>
      )}

      <select
        className="select"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function DataPoint({
  label,
  value,
  color,
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        color: 'var(--muted)',
        fontSize: 10,
      }}
    >
      <i
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
        }}
      />

      {label}:{' '}

      <strong
        style={{
          color: 'var(--text)',
          fontWeight: 500,
        }}
      >
        {value}
      </strong>
    </span>
  );
}