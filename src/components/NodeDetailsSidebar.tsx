import { memo } from "react";
import { motion } from "framer-motion";

interface NodeDetailsSidebarProps {
  node: any;
  onClose: () => void;
}

const NodeDetailsSidebar = ({ node, onClose }: NodeDetailsSidebarProps) => {
  if (!node) return null;

  const { label, description, techStack, aiNotes, efficiencyGrade } = node.data;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="absolute top-0 right-0 w-[360px] h-full bg-[#0b0f1a]/95 backdrop-blur-2xl border-l border-white/5 shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Component Analysis</span>
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
            {description || "Architectural component within the logic matrix."}
          </p>
        </div>

        {/* Tech Stack */}
        {techStack && techStack.length > 0 && (
          <div className="mb-10">
            <h3 className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-[0.2em] mb-4">Technology Stack</h3>
            <div className="space-y-2">
              {techStack.map((tech: any, i: number) => (
                <div key={i} className="flex items-center gap-3 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[16px]">{tech.icon || 'code'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface">{tech.name}</span>
                    <span className="text-[10px] text-on-surface-variant/60">{tech.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Performance Notes */}
        <div className="mb-10">
           <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10">
             <div className="flex items-center gap-2 mb-4">
               <span className="material-symbols-outlined text-primary text-[16px]">insights</span>
               <h3 className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">AI Performance Review</h3>
             </div>
             
             <p className="text-on-surface text-[13px] leading-relaxed font-medium italic opacity-90">
               "{aiNotes || "No specific performance observations available for this node yet. Perform a re-generation to refresh insights."}"
             </p>

             <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[14px]">bolt</span>
                  <span className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-widest">Efficiency</span>
                </div>
                <span className="text-xs font-black text-primary">{efficiencyGrade || "N/A"}</span>
             </div>
           </div>
        </div>

        {/* Direct Dependencies */}
        <div className="mb-10">
          <h3 className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-[0.2em] mb-3">System Dependencies</h3>
          <div className="space-y-1">
             {["Database Connection", "API Middleware", "Auth Validator"].map((dep, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.02]">
                  <span className="text-xs text-on-surface-variant font-medium">{dep}</span>
                  <span className="text-[9px] font-bold text-on-surface-variant/30 uppercase">Active</span>
                </div>
             ))}
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default memo(NodeDetailsSidebar);
