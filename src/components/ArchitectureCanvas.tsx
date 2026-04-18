"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { getKey, getActiveProvider } from "@/lib/byok";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  Node,
  Edge
} from "@xyflow/react";

interface CanvasProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

export default function ArchitectureCanvas({ initialNodes, initialEdges }: CanvasProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const params = useParams();

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: isSimulating }, eds)),
    [isSimulating]
  );

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        animated: !isSimulating,
      }))
    );
  };

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
          architecture: { nodes, edges },
          provider
        })
      });
      if (res.ok) {
        alert("Blueprint Architecture successfully synced and updated.");
      } else {
        alert("Sync failed. Ensure your API Key is valid.");
      }
    } catch (e) {
      alert("Network error.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="w-full h-[700px] border border-outline-variant/10 rounded-2xl overflow-hidden glass-panel">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        colorMode="dark"
        minZoom={0.5}
      >
        <Background />
        <Controls className="bg-surface-container-high border-outline-variant/20 fill-on-surface" />
      </ReactFlow>
      
      {/* HUD Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-surface-container-highest/80 backdrop-blur-md px-6 py-3 rounded-full border border-outline-variant/20 shadow-2xl z-10">
        <button
          onClick={() => {
            const newNode: Node = {
              id: `node-${Date.now()}`,
              position: { x: Math.random() * 200, y: Math.random() * 200 },
              data: { label: "New Node" }
            };
            setNodes((nds) => [...nds, newNode]);
          }}
          className="flex items-center gap-2 text-sm font-medium text-slate-100 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span> Add Node
        </button>
        <div className="w-px h-4 bg-outline-variant/30" />
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 text-sm font-medium text-tertiary hover:text-tertiary-fixed transition-colors disabled:opacity-50"
        >
          {isSyncing ? (
             <div className="w-4 h-4 border-2 border-tertiary/20 border-t-tertiary rounded-full animate-spin" />
          ) : (
            <span className="material-symbols-outlined text-[18px]">sync</span>
          )}
          {isSyncing ? "Syncing..." : "Sync Blueprint"}
        </button>
        <div className="w-px h-4 bg-outline-variant/30" />
        <button 
          onClick={toggleSimulation}
          className={`flex items-center gap-2 text-sm font-medium transition-all ${
            isSimulating ? "text-primary scale-105" : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <span className={`material-symbols-outlined text-[18px] ${isSimulating ? "animate-spin-slow" : ""}`}>
            {isSimulating ? "data_thresholding" : "play_circle"}
          </span>
          {isSimulating ? "Live Traffic" : "Simulate Traffic"}
        </button>
      </div>
    </div>
  );
}
