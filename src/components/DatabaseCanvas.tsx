"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Node,
  Edge,
  Panel,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import TableNode from "./TableNode";
import TableDetailsSidebar from "@/components/TableDetailsSidebar";
import { AnimatePresence } from "framer-motion";
import { toJpeg } from "html-to-image";
import dagre from "dagre";

interface CanvasProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  projectTitle?: string;
}

const nodeTypes = {
  database: TableNode,
};

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const nodeWidth = 200;
  const nodeHeight = 150;

  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

export default function DatabaseCanvas({ initialNodes, initialEdges, projectTitle }: CanvasProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = (_: any, node: Node) => setSelectedNode(node);

  const onLayout = useCallback(
    (direction: string) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      );
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges]
  );

  const exportToJpeg = async () => {
    const element = document.querySelector('.react-flow') as HTMLElement;
    if (!element) return;

    setIsExporting(true);
    setTimeout(async () => {
      try {
        const dataUrl = await toJpeg(element, {
          backgroundColor: '#ffffff',
          quality: 0.95,
          pixelRatio: 2,
          filter: (node) => {
             const exclusionClasses = ['react-flow__controls', 'react-flow__panel', 'node-sidebar'];
             return !exclusionClasses.some(cls => node.classList?.contains(cls));
          }
        });

        const link = document.createElement('a');
        link.download = `${projectTitle?.replace(/\s+/g, '_')}_Database_Schema.jpg`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Export failed', err);
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };

  return (
    <div className="w-full h-full relative group/canvas overflow-hidden bg-[#0b0f1a]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
        nodesConnectable={false}
        elementsSelectable={true}
        defaultEdgeOptions={{
          style: { strokeWidth: 2, stroke: '#fb923c', opacity: 0.6 },
          type: 'smoothstep',
          markerEnd: { type: 'arrowclosed', color: '#fb923c' },
          labelStyle: { fill: '#fff', fontWeight: 900, fontSize: 8 },
          labelBgStyle: { fill: '#1e293b', fillOpacity: 0.9 },
          labelBgPadding: [6, 3],
          labelBgBorderRadius: 4,
        }}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background 
          variant={BackgroundVariant.Lines} 
          gap={40} 
          size={1} 
          color="#1e293b" 
          className="opacity-10"
        />
        
        {/* HUD Controls */}
        <Panel position="top-right" className="!m-6 flex flex-col gap-3 items-end">
           <div className="flex items-center gap-2 bg-surface-container-high/40 backdrop-blur-md p-1.5 rounded-xl border border-white/5 shadow-2xl">
              <button 
                onClick={() => onLayout('TB')}
                className="p-2 hover:bg-white/5 rounded-lg text-on-surface-variant transition-colors flex items-center gap-2"
                title="Auto-Layout (Top to Bottom)"
              >
                <span className="material-symbols-outlined text-sm">account_tree</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Auto Layout</span>
              </button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <button 
                onClick={exportToJpeg}
                disabled={isExporting}
                className="px-5 py-2 text-[10px] font-black bg-orange-500 text-white rounded-lg shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest leading-none disabled:opacity-50"
              >
                {isExporting ? 'Capturing...' : 'Export Matrix'}
              </button>
           </div>
        </Panel>

        {/* Branded Export Title Overlay */}
        {isExporting && (
           <Panel position="top-center" className="!mt-12 bg-white p-6 rounded-2xl shadow-none">
              <h1 className="text-4xl font-black text-black tracking-tighter uppercase italic">{projectTitle}</h1>
              <p className="text-sm font-bold text-black/40 uppercase tracking-[0.3em] mt-2">Entity Relationship Model • {new Date().toLocaleDateString()}</p>
           </Panel>
        )}

        <Controls showInteractive={false} className="!bg-surface-container-high/40 !backdrop-blur-md !border-white/5 !shadow-2xl !rounded-xl !m-6" />
      </ReactFlow>

      <AnimatePresence>
        {selectedNode && (
          <TableDetailsSidebar 
            node={selectedNode} 
            onClose={() => setSelectedNode(null)} 
          />
        )}
      </AnimatePresence>
      
      {/* Legend */}
      <div className="absolute bottom-6 right-6 flex flex-col items-end gap-2 bg-black/40 backdrop-blur-md px-4 py-3 rounded-xl border border-white/5 z-10">
        <span className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest mb-1">ER Diagram Legend</span>
        <div className="flex gap-4">
           <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-orange-400" /> <span className="text-[9px] font-bold text-on-surface-variant">Table Entity</span></div>
           <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400" /> <span className="text-[9px] font-bold text-on-surface-variant">Identity (PK)</span></div>
           <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[10px] text-orange-400/50">arrow_forward</span> <span className="text-[9px] font-bold text-on-surface-variant">Relation (FK)</span></div>
        </div>
      </div>
    </div>
  );
}
