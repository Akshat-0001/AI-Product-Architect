import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

const TableIcon = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" className="drop-shadow-xl overflow-visible">
    {/* Base Plate */}
    <path d="M10 15l15-5 15 5v20l-15 5-15-5z" fill="#fb923c" />
    {/* Highlight layers to show rows/data layering */}
    <path d="M10 20l15 5 15-5" fill="white" opacity="0.1" />
    <path d="M10 25l15 5 15-5" fill="white" opacity="0.1" />
    <path d="M10 30l15 5 15-5" fill="white" opacity="0.1" />
    <path d="M10 15l15 5 15-5" fill="white" opacity="0.2" fillRule="evenodd" />
    {/* Column lines */}
    <path d="M20 17v18" stroke="white" strokeWidth="0.5" opacity="0.2" />
    <path d="M30 17v18" stroke="white" strokeWidth="0.5" opacity="0.2" />
  </svg>
);

const TableNode = ({ data, selected }: NodeProps) => {
  const { label, columns } = data as any;
  const displayColumns = columns?.slice(0, 4) || [];

  return (
    <div className="flex flex-col items-center gap-3 transition-all duration-300">
      <Handle type="target" position={Position.Top} className="!opacity-0 !pointer-events-none" />
      <Handle type="source" position={Position.Bottom} className="!opacity-0 !pointer-events-none" />
      <Handle type="target" position={Position.Left} className="!opacity-0 !pointer-events-none" />
      <Handle type="source" position={Position.Right} className="!opacity-0 !pointer-events-none" />

      <div className="relative group">
        <TableIcon />
        {selected && (
          <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full -z-10" />
        )}
      </div>

      <div className="flex flex-col items-center w-48">
        <div className="w-full bg-[#1a1f2e] border border-white/5 rounded-xl shadow-2xl overflow-hidden group-hover:border-orange-500/30 transition-colors">
          {/* Header */}
          <div className="bg-orange-500/10 px-3 py-2 border-b border-white/5 flex items-center gap-2">
            <span className="material-symbols-outlined text-[12px] text-orange-400">table_chart</span>
            <span className="text-[11px] font-black text-on-surface tracking-tight uppercase">{label}</span>
          </div>
          
          {/* Column Preview */}
          <div className="p-2 space-y-1">
            {displayColumns.map((col: any, i: number) => (
              <div key={i} className="flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  {col.primary ? (
                     <span className="material-symbols-outlined text-[10px] text-yellow-500">key</span>
                  ) : <div className="w-[10px]" />}
                  <span className="text-[9px] font-bold text-on-surface/80 truncate">{col.name}</span>
                </div>
                <span className="text-[7px] font-medium text-on-surface-variant/40 uppercase font-mono">{col.type}</span>
              </div>
            ))}
            {columns?.length > 4 && (
              <div className="pt-1 text-center">
                <span className="text-[8px] font-bold text-on-surface-variant/20 uppercase tracking-widest">
                  + {columns.length - 4} more fields
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TableNode);
