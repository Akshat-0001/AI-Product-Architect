import { memo } from "react";
import { motion } from "framer-motion";

interface TableDetailsSidebarProps {
  node: any;
  onClose: () => void;
}

const TableDetailsSidebar = ({ node, onClose }: TableDetailsSidebarProps) => {
  if (!node) return null;

  const { label, description, columns, aiNotes, efficiencyGrade } = node.data;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="absolute top-0 right-0 w-[400px] h-full bg-[#0b0f1a]/95 backdrop-blur-2xl border-l border-white/5 shadow-2xl z-50 flex flex-col node-sidebar"
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Database Audit</span>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-white/5 rounded-lg text-on-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <div className="px-6 pb-6 overflow-y-auto flex-1 custom-scrollbar">
        {/* Title & Desc */}
        <div className="mt-8 mb-10">
          <h2 className="text-2xl font-black text-on-surface mb-3 tracking-tighter leading-tight">{label}</h2>
          <p className="text-on-surface-variant/80 text-[13px] leading-relaxed font-medium">
            {description || "Relational data entity within the system schema."}
          </p>
        </div>

        {/* Schema Review Notes */}
        <div className="mb-10">
           <div className="bg-orange-500/5 p-5 rounded-2xl border border-orange-500/10">
             <div className="flex items-center gap-2 mb-4">
               <span className="material-symbols-outlined text-orange-400 text-[16px]">fact_check</span>
               <h3 className="text-[9px] font-bold text-orange-400 uppercase tracking-[0.2em]">AI Schema Design Review</h3>
             </div>
             
             <p className="text-on-surface text-[12px] leading-relaxed font-medium italic opacity-90">
               "{aiNotes || "Table layout follows standard normalization practices. Relationships are correctly indexed for optimal query performance."}"
             </p>

             <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-400 text-[14px]">query_stats</span>
                  <span className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-widest">Normalization Grade</span>
                </div>
                <span className="text-xs font-black text-orange-400">{efficiencyGrade || "A"}</span>
             </div>
           </div>
        </div>

        {/* Full Column List */}
        <div className="mb-10">
          <h3 className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-[0.2em] mb-4">Schema Definition</h3>
          <div className="space-y-2">
            {columns?.map((col: any, i: number) => (
              <div key={i} className="flex items-center justify-between bg-white/[0.02] p-3 rounded-xl border border-white/[0.04] group hover:border-orange-500/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${col.primary ? 'bg-yellow-500/10 text-yellow-500' : 'bg-white/5 text-on-surface-variant/40'}`}>
                    <span className="material-symbols-outlined text-[16px]">{col.primary ? 'key' : 'database'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-on-surface">{col.name}</span>
                    <span className="text-[9px] text-on-surface-variant/50 font-mono uppercase">{col.type}</span>
                  </div>
                </div>
                {col.nullable && (
                  <span className="text-[8px] font-bold text-on-surface-variant/20 uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded">Nullable</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Foreign Relationships */}
        <div className="mb-10">
          <h3 className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-[0.2em] mb-3">Relational Links</h3>
          <div className="space-y-1">
             {columns?.filter((c: any) => c.references).map((col: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/[0.02]">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant font-black mb-0.5 uppercase tracking-tighter">{col.name}</span>
                    <span className="text-[9px] text-primary/60 font-bold">Refers to {col.references}</span>
                  </div>
                  <span className="text-[9px] font-bold text-orange-400/30 uppercase">FOREIGN KEY</span>
                </div>
             )) || (
               <p className="text-[10px] text-on-surface-variant/30 italic">No external relations defined for this entity.</p>
             )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(TableDetailsSidebar);
