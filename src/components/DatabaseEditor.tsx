"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { getKey, getActiveProvider } from "@/lib/byok";

interface Column {
  name: string;
  type: string;
  primary: boolean;
  nullable: boolean;
  references: string | null;
}

interface Table {
  name: string;
  columns: Column[];
}

interface DatabaseEditorProps {
  initialTables: Table[];
}

export default function DatabaseEditor({ initialTables }: DatabaseEditorProps) {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const params = useParams();

  const handleSync = async () => {
    const provider = getActiveProvider();
    const key = getKey(provider);
    if (!key) {
      alert("Missing API Key. Add it in settings.");
      return;
    }

    setIsSyncing(true);
    try {
      const res = await fetch("/api/project/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-AI-Key": key },
        body: JSON.stringify({
          projectId: params.id,
          database: { tables },
          provider
        })
      });
      if (res.ok) {
        alert("Database Schema successfully synced and updated.");
      } else {
        alert("Sync failed. Ensure your API Key is valid.");
      }
    } catch (e) {
      alert("Network error.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAudit = async () => {
    const provider = getActiveProvider();
    const key = getKey(provider);
    if (!key) return;

    setIsAuditing(true);
    try {
      const res = await fetch("/api/project/audit-schema", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-AI-Key": key },
        body: JSON.stringify({ tables })
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  const addTable = () => {
    setTables([...tables, { name: "new_table", columns: [{ name: "id", type: "UUID", primary: true, nullable: false, references: null }] }]);
  };

  const updateTableName = (index: number, newName: string) => {
    const next = [...tables];
    next[index].name = newName;
    setTables(next);
  };

  const addColumn = (tableIndex: number) => {
    const next = [...tables];
    next[tableIndex].columns.push({ name: "new_col", type: "TEXT", primary: false, nullable: true, references: null });
    setTables(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
        <p className="text-sm text-on-surface-variant">Editing schema locally. Click Sync Blueprint to apply changes to all documents.</p>
        <div className="flex gap-3">
          <button 
            onClick={handleAudit} 
            disabled={isAuditing}
            className="flex items-center gap-2 text-sm text-tertiary hover:bg-tertiary/10 px-4 py-2 rounded-lg transition-colors border border-tertiary/20 disabled:opacity-50"
          >
            {isAuditing ? (
              <div className="w-4 h-4 border-2 border-tertiary/20 border-t-tertiary rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-[18px]">fact_check</span>
            )}
            {isAuditing ? "Auditing..." : "Audit Schema"}
          </button>
          <button onClick={addTable} className="flex items-center gap-2 text-sm text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors border border-primary/20">
            <span className="material-symbols-outlined text-[18px]">add_box</span> Add Table
          </button>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 text-sm font-semibold text-on-primary bg-primary px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSyncing ? (
               <div className="w-4 h-4 border-2 border-on-primary/20 border-t-on-primary rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-[18px]">sync</span>
            )}
            {isSyncing ? "Syncing..." : "Sync Blueprint"}
          </button>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-tertiary font-bold flex items-center gap-2">
              <span className="material-symbols-outlined">psychology_alt</span>
              AI Design Review ({suggestions.length})
            </h3>
            <button onClick={() => setSuggestions([])} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((s, i) => (
              <div key={i} className="bg-surface-container-high/50 p-3 rounded-lg border border-outline-variant/10">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`material-symbols-outlined text-sm ${
                    s.type === "error" ? "text-error" : s.type === "warning" ? "text-yellow-500" : "text-primary"
                  }`}>
                    {s.type === "error" ? "report" : s.type === "warning" ? "warning" : "info"}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    {s.type}
                  </span>
                </div>
                <p className="text-xs font-semibold text-on-surface mb-1">{s.message}</p>
                <p className="text-[10px] text-on-surface-variant leading-tight">{s.impact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table, tIdx) => (
          <div key={tIdx} className="glass-panel rounded-xl border border-outline-variant/20 overflow-hidden group">
            {/* Table Header Editable */}
            <div className="bg-primary-container/20 px-4 py-3 border-b border-outline-variant/10 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">table_chart</span>
              <input
                type="text"
                value={table.name}
                onChange={(e) => updateTableName(tIdx, e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-on-surface font-mono outline-none focus:ring-1 focus:ring-primary/50 w-full"
              />
            </div>

            {/* Columns */}
            <div className="divide-y divide-outline-variant/10">
              {table.columns.map((col, cIdx) => (
                <div key={cIdx} className="px-4 py-2 flex items-center gap-2 text-xs">
                  {col.primary ? (
                     <span className="material-symbols-outlined text-yellow-400 text-xs w-4">key</span>
                  ) : <span className="w-4" />}
                  <input
                    value={col.name}
                    onChange={(e) => {
                      const next = [...tables];
                      next[tIdx].columns[cIdx].name = e.target.value;
                      setTables(next);
                    }}
                    className="bg-transparent w-24 outline-none border-b border-transparent focus:border-outline-variant text-on-surface font-mono"
                  />
                  <input
                    value={col.type}
                    onChange={(e) => {
                      const next = [...tables];
                      next[tIdx].columns[cIdx].type = e.target.value;
                      setTables(next);
                    }}
                    className="bg-transparent w-24 outline-none border-b border-transparent focus:border-outline-variant text-on-surface-variant/80 font-mono uppercase"
                  />
                </div>
              ))}
            </div>

            <button onClick={() => addColumn(tIdx)} className="w-full py-2 text-[10px] uppercase tracking-widest text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors flex items-center justify-center gap-1 border-t border-outline-variant/10">
              <span className="material-symbols-outlined text-[14px]">add</span> Add Column
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
