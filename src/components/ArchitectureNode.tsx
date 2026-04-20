import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

const IsometricIcon = ({ type }: { type: string }) => {
  // Normalize type aliases for robust icon mapping
  const normalizedType = (() => {
    const t = type.toLowerCase();
    if (t === 'frontend' || t === 'client') return 'web';
    if (t === 'backend' || t === 'service' || t === 'api' || t === 'server') return 'server';
    if (t === 'api_gateway' || t === 'gateway') return 'gateway';
    if (t === 'sql' || t === 'nosql' || t === 'database') return 'database';
    if (t === 'external' || t === 'cdn') return 'cdn';
    return t;
  })();

  const colorMap: Record<string, string> = {
    user: "#94a3b8", // Slate
    web: "#38bdf8", // Sky
    mobile: "#38bdf8",
    gateway: "#818cf8", // Indigo
    firewall: "#f87171", // Red
    server: "#60a5fa", // Blue
    lambda: "#fb923c", // Orange
    database: "#fb923c",
    cache: "#2dd4bf", // Teal
    storage: "#94a3b8",
    queue: "#4ade80", // Green
    pubsub: "#4ade80",
    ai_model: "#c084fc", // Purple
    analytics: "#c084fc",
    cdn: "#818cf8",
    dns: "#818cf8",
    auth: "#f472b6", // Pink
  };

  const color = colorMap[normalizedType] || "#94a3b8";

  // Isometric SVG paths for each type
  const renderPath = () => {
    switch (normalizedType) {
      case "database":
      case "cache":
        return (
          <>
            <ellipse cx="25" cy="15" rx="15" ry="7" fill={color} opacity="0.8" />
            <path d="M10 15v15c0 3.8 6.7 7 15 7s15-3.2 15-7V15" fill={color} />
            <ellipse cx="25" cy="15" rx="15" ry="7" fill="white" opacity="0.2" />
          </>
        );
      case "server":
      case "gateway":
        return (
          <>
            <path d="M10 10l15-5 15 5v20l-15 5-15-5z" fill={color} />
            <path d="M10 10l15 5 15-5" fill="white" opacity="0.2" fillRule="evenodd" />
            <path d="M25 15v20" stroke="white" strokeWidth="0.5" opacity="0.3" />
            <rect x="14" y="16" width="6" height="2" fill="white" opacity="0.3" />
            <rect x="14" y="20" width="6" height="2" fill="white" opacity="0.3" />
            <rect x="14" y="24" width="6" height="2" fill="white" opacity="0.3" />
          </>
        );
      case "user":
        return (
          <>
            <circle cx="25" cy="15" r="7" fill={color} />
            <path d="M10 35c0-8 6.7-14 15-14s15 6 15 14z" fill={color} />
          </>
        );
      case "web":
      case "mobile":
        return (
          <>
            <path d="M10 10h30v20h-30z" fill={color} />
            <path d="M12 12h26v16h-26z" fill="#0b0f1a" />
            <path d="M20 34h10" stroke={color} strokeWidth="3" />
            <path d="M25 30v4" stroke={color} strokeWidth="2" />
          </>
        );
      case "queue":
      case "pubsub":
        return (
          <>
            <path d="M10 30l15-5 15 5-15 5z" fill={color} />
            <path d="M10 22l15-5 15 5-15 5z" fill={color} opacity="0.7" />
            <path d="M10 14l15-5 15 5-15 5z" fill={color} opacity="0.4" />
          </>
        );
      case "firewall":
      case "auth":
        return (
          <>
            <path d="M25 5l15 5v15c0 10-15 15-15 15s-15-5-15-15V10z" fill={color} />
            <path d="M25 12v16" stroke="white" strokeWidth="3" opacity="0.5" />
            <path d="M18 20h14" stroke="white" strokeWidth="3" opacity="0.5" />
          </>
        );
      case "ai_model":
      case "analytics":
        return (
          <>
             <path d="M25 10l12 7-12 7-12-7z" fill={color} />
             <path d="M13 17v12l12 7V24z" fill={color} opacity="0.8" />
             <path d="M37 17v12l-12 7V24z" fill={color} opacity="0.6" />
             <path d="M25 20c-3 0-5-2-5-5s2-5 5-5 5 2 5 5-2 5-5 5z" fill="white" opacity="0.3" />
          </>
        );
      case "storage":
        return (
          <>
            <path d="M10 15l15-5 15 5v15l-15 5-15-5z" fill={color} />
            <path d="M10 15l15 5 15-5" fill="white" opacity="0.2" fillRule="evenodd" />
          </>
        );
      case "cdn":
      case "dns":
        return (
          <>
            <path d="M10 25l15-15 15 15-15 15z" fill={color} />
            <circle cx="25" cy="25" r="5" fill="white" opacity="0.3" />
          </>
        );
      default:
        return <rect x="10" y="10" width="30" height="30" rx="4" fill={color} />;
    }
  };

  return (
    <svg width="50" height="50" viewBox="0 0 50 50" className="drop-shadow-xl">
      {renderPath()}
    </svg>
  );
};

const ArchitectureNode = ({ data, selected }: NodeProps) => {
  const { label, type, tech } = data as any;

  return (
    <div className="flex flex-col items-center gap-2 transition-all duration-300">
      <Handle type="target" position={Position.Top} id="t" className="!opacity-0 !pointer-events-none" />
      <Handle type="source" position={Position.Bottom} id="b" className="!opacity-0 !pointer-events-none" />
      <Handle type="target" position={Position.Left} id="l" className="!opacity-0 !pointer-events-none" />
      <Handle type="source" position={Position.Right} id="r" className="!opacity-0 !pointer-events-none" />

      <div className="relative">
        <IsometricIcon type={type} />
        {selected && (
          <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
        )}
      </div>

      <div className="flex flex-col items-center">
        <span className="text-[11px] font-bold text-on-surface px-2.5 py-1.5 rounded-lg bg-[#1a1f2e] border border-white/5 shadow-sm">
          {label}
        </span>
        <span className="text-[7px] font-medium text-on-surface-variant/30 uppercase tracking-widest mt-1">
          {type.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
};

export default memo(ArchitectureNode);
