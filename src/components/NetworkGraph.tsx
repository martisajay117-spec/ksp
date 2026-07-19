import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { POLEEntity, POLELink } from "../types";

interface NetworkGraphProps {
  nodes: POLEEntity[];
  links: POLELink[];
  selectedId: string | null;
  onSelectNode: (node: POLEEntity | null) => void;
  activeAlgo: string | null;
  kValue: number;
  activeTypes: Set<string>;
  searchQuery: string;
  role: string;
}

const TYPE_COLOR: Record<string, string> = {
  Person: '#E53935',       // KSP Crimson
  Object: '#6E93B8',       // Steel blue
  Location: '#7F9E6E',     // Moss green
  Event: '#D69A4E',        // Warm amber
  BankAccount: '#9884AC'   // Soft violet
};

const COMMUNITY_PALETTE = ['#E53935', '#D69A4E', '#6E93B8', '#7F9E6E', '#9884AC', '#B79A5C', '#5FA8D3'];

export default function NetworkGraph({
  nodes,
  links,
  selectedId,
  onSelectNode,
  activeAlgo,
  kValue,
  activeTypes,
  searchQuery,
  role
}: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width || 600;
    const height = rect.height || 500;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%");

    const zoomLayer = svg.append("g");

    // Enable Zoom
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 3])
      .on("zoom", (event) => {
        zoomLayer.attr("transform", event.transform);
      });

    svg.call(zoomBehavior);

    // Deep copy nodes and links for D3 simulation
    const d3Nodes = nodes.map(n => ({ ...n, x: 0, y: 0, fx: null as number | null, fy: null as number | null }));
    const d3Links = links.map(l => ({
      ...l,
      source: typeof l.source === 'object' ? l.source.id : l.source,
      target: typeof l.target === 'object' ? l.target.id : l.target
    }));

    // Setup adjacency list for algorithms
    const adj = new Map<string, Set<string>>();
    d3Nodes.forEach(n => adj.set(n.id, new Set()));
    d3Links.forEach(l => {
      adj.get(l.source)?.add(l.target);
      adj.get(l.target)?.add(l.source);
    });

    // ---------------- ALGORITHMS IMPLEMENTATION ----------------
    let coreNodes = new Set<string>();
    let betweennessMap = new Map<string, number>();
    let communityMap = new Map<string, number>();

    // 1. k-Core Decomposition
    if (activeAlgo === 'core') {
      const tempAdj = new Map<string, Set<string>>();
      d3Nodes.forEach(n => tempAdj.set(n.id, new Set(adj.get(n.id))));
      const removed = new Set<string>();
      let changed = true;
      while (changed) {
        changed = false;
        for (const [id, set] of tempAdj) {
          if (removed.has(id)) continue;
          const activeDeg = Array.from(set).filter(nb => !removed.has(nb)).length;
          if (activeDeg < kValue) {
            removed.add(id);
            changed = true;
          }
        }
      }
      d3Nodes.forEach(n => {
        if (!removed.has(n.id)) coreNodes.add(n.id);
      });
    }

    // 2. Betweenness Centrality (Brandes' algorithm)
    if (activeAlgo === 'between') {
      d3Nodes.forEach(n => betweennessMap.set(n.id, 0));
      for (const s of adj.keys()) {
        const S: string[] = [];
        const P = new Map<string, string[]>();
        adj.forEach((_, k) => P.set(k, []));
        const sigma = new Map<string, number>();
        adj.forEach((_, k) => sigma.set(k, 0));
        sigma.set(s, 1);
        const dist = new Map<string, number>();
        adj.forEach((_, k) => dist.set(k, -1));
        dist.set(s, 0);

        const q: string[] = [s];
        while (q.length > 0) {
          const v = q.shift()!;
          S.push(v);
          const neighborsList = adj.get(v) || new Set();
          for (const w of neighborsList) {
            if (dist.get(w)! < 0) {
              dist.set(w, dist.get(v)! + 1);
              q.push(w);
            }
            if (dist.get(w) === dist.get(v)! + 1) {
              sigma.set(w, sigma.get(w)! + sigma.get(v)!);
              P.get(w)!.push(v);
            }
          }
        }

        const delta = new Map<string, number>();
        d3Nodes.forEach(n => delta.set(n.id, 0));
        while (S.length > 0) {
          const w = S.pop()!;
          const predecessors = P.get(w) || [];
          for (const v of predecessors) {
            delta.set(v, delta.get(v)! + (sigma.get(v)! / sigma.get(w)!) * (1 + delta.get(w)!));
          }
          if (w !== s) {
            betweennessMap.set(w, betweennessMap.get(w)! + delta.get(w)!);
          }
        }
      }
      // Undirected graph correction factor
      betweennessMap.forEach((val, key) => betweennessMap.set(key, val / 2));
    }

    // 3. Simple modularity-based Louvain-like community detection
    if (activeAlgo === 'community') {
      d3Nodes.forEach(n => communityMap.set(n.id, 0));
      const ids = d3Nodes.map(n => n.id);
      const degree = new Map<string, number>();
      ids.forEach(id => degree.set(id, adj.get(id)?.size || 0));
      const m = d3Links.length || 1;
      let comm = new Map<string, string>(ids.map(id => [id, id]));
      let commTot = new Map<string, number>(ids.map(id => [id, degree.get(id) || 0]));

      let improved = true;
      let iterations = 0;
      while (improved && iterations < 15) {
        improved = false;
        iterations++;
        for (const id of ids) {
          const curC = comm.get(id)!;
          commTot.set(curC, (commTot.get(curC) || 0) - (degree.get(id) || 0));

          const linksToComm = new Map<string, number>();
          const neighborsSet = adj.get(id) || new Set();
          for (const nb of neighborsSet) {
            const c = comm.get(nb)!;
            linksToComm.set(c, (linksToComm.get(c) || 0) + 1);
          }

          let bestC = curC;
          let bestGain = (linksToComm.get(curC) || 0) - ((commTot.get(curC) || 0) * (degree.get(id) || 0)) / (2 * m);

          for (const [c, kiIn] of linksToComm) {
            const gain = kiIn - ((commTot.get(c) || 0) * (degree.get(id) || 0)) / (2 * m);
            if (gain > bestGain) {
              bestGain = gain;
              bestC = c;
            }
          }

          comm.set(id, bestC);
          commTot.set(bestC, (commTot.get(bestC) || 0) + (degree.get(id) || 0));
          if (bestC !== curC) improved = true;
        }
      }

      const labels = new Map<string, number>();
      let nextLabel = 0;
      ids.forEach(id => {
        const c = comm.get(id)!;
        if (!labels.has(c)) {
          labels.set(c, nextLabel++);
        }
        communityMap.set(id, labels.get(c)!);
      });
    }

    // ---------------- FORCE SIMULATION ----------------
    const simulation = d3.forceSimulation<any>(d3Nodes)
      .force("link", d3.forceLink<any, any>(d3Links).id(d => d.id).distance(100).strength(0.6))
      .force("charge", d3.forceManyBody().strength(-240))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(32));

    // Render relationship links
    const link = zoomLayer.append("g")
      .selectAll("line")
      .data(d3Links)
      .join("line")
      .attr("stroke", d => {
        const s = typeof d.source === "object" ? d.source.id : d.source;
        const t = typeof d.target === "object" ? d.target.id : d.target;
        if (activeAlgo === 'core') {
          const isInCore = coreNodes.has(s) && coreNodes.has(t);
          return isInCore ? "#E53935" : "#333333";
        }
        return "#444444";
      })
      .attr("stroke-width", d => {
        const s = typeof d.source === "object" ? d.source.id : d.source;
        const t = typeof d.target === "object" ? d.target.id : d.target;
        return (activeAlgo === 'core' && coreNodes.has(s) && coreNodes.has(t)) ? 2.5 : 1.2;
      })
      .attr("stroke-opacity", d => {
        // Dim relationships not matching filtered criteria
        const s = typeof d.source === "object" ? d.source.id : d.source;
        const t = typeof d.target === "object" ? d.target.id : d.target;
        const sNode = nodes.find(n => n.id === s);
        const tNode = nodes.find(n => n.id === t);
        if (!sNode || !tNode || !activeTypes.has(sNode.type) || !activeTypes.has(tNode.type)) {
          return 0.05;
        }
        return 0.55;
      });

    // Render nodes
    const nodeGroup = zoomLayer.append("g")
      .selectAll("g")
      .data(d3Nodes)
      .join("g")
      .attr("class", "node select-none cursor-pointer")
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.2).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }))
      .on("click", (event, d) => {
        event.stopPropagation();
        onSelectNode(nodes.find(n => n.id === d.id) || null);
      });

    // Outer halo around selected nodes or high betweenness centrality nodes
    const maxBetween = Math.max(...Array.from(betweennessMap.values()), 0.001);
    nodeGroup.append("circle")
      .attr("r", d => {
        if (activeAlgo === 'between') {
          const rank = betweennessMap.get(d.id) || 0;
          return 12 + 18 * (rank / maxBetween);
        }
        return 16;
      })
      .attr("fill", "none")
      .attr("stroke", d => d.id === selectedId ? "#ffffff" : "#E53935")
      .attr("stroke-width", d => d.id === selectedId ? 2 : 1)
      .attr("stroke-opacity", d => {
        if (d.id === selectedId) return 0.8;
        if (activeAlgo === 'between' && (betweennessMap.get(d.id) || 0) / maxBetween > 0.4) return 0.5;
        return 0;
      })
      .attr("stroke-dasharray", "3,3");

    // Inside node circles
    nodeGroup.append("circle")
      .attr("r", d => {
        if (activeAlgo === 'between') {
          const rank = betweennessMap.get(d.id) || 0;
          return 8 + 12 * (rank / maxBetween);
        }
        return 10;
      })
      .attr("fill", d => {
        if (activeAlgo === 'community') {
          const commId = communityMap.get(d.id) || 0;
          return COMMUNITY_PALETTE[commId % COMMUNITY_PALETTE.length];
        }
        return TYPE_COLOR[d.type] || "#ffffff";
      })
      .attr("stroke", "#111111")
      .attr("stroke-width", d => d.id === selectedId ? 2.5 : 1)
      .attr("fill-opacity", d => {
        // Dim unselected search queries or type selections
        const typeHidden = !activeTypes.has(d.type);
        const searchMiss = searchQuery.trim() !== "" && 
          !(d.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
            d.id.toLowerCase().includes(searchQuery.toLowerCase()));
        
        if (typeHidden || searchMiss) return 0.15;
        if (activeAlgo === 'core' && !coreNodes.has(d.id)) return 0.2;
        return 0.85;
      });

    // Node labels
    nodeGroup.append("text")
      .attr("dy", d => {
        if (activeAlgo === 'between') {
          const rank = betweennessMap.get(d.id) || 0;
          return 16 + 14 * (rank / maxBetween);
        }
        return 22;
      })
      .attr("text-anchor", "middle")
      .attr("fill", d => d.id === selectedId ? "#E53935" : "#888888")
      .attr("font-size", d => d.id === selectedId ? "11px" : "9.5px")
      .attr("font-family", "var(--font-mono)")
      .text(d => {
        // Mask PII based on roles if role is Analyst
        if (role === "Analyst" && d.type === "Person" && d.id !== "P-001") {
          return `Suspect ${d.id}`;
        }
        return d.label;
      });

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      nodeGroup.attr("transform", d => `translate(${d.x}, ${d.y})`);
    });

    // Reset view bounds initial center
    simulation.force("center", d3.forceCenter(width / 2, height / 2));

    return () => {
      simulation.stop();
    };
  }, [nodes, links, selectedId, activeAlgo, kValue, activeTypes, searchQuery, role]);

  const resetZoom = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(500)
      .call(d3.zoom<SVGSVGElement, unknown>().transform, d3.zoomIdentity);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#111111] rounded border border-[#333333] overflow-hidden">
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* Zoom / Reset Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <button 
          onClick={resetZoom}
          className="w-8 h-8 flex items-center justify-center bg-[#1A1A1A] hover:bg-[#111111] text-[#E53935] rounded border border-[#333333] transition-colors text-xs font-mono cursor-pointer"
          title="Reset View Position"
        >
          ⌖
        </button>
      </div>

      <div className="absolute bottom-4 left-4 text-[10px] font-mono text-[#555555] select-none pointer-events-none">
        Drag to pan · Scroll to zoom · Click nodes to inspect
      </div>
    </div>
  );
}
