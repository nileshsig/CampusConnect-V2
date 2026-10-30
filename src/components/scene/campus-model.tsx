"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BuildingProps {
  id: string;
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  roofType?: "flat" | "pitched" | "tower";
  activeSection: string;
  onSelect: (id: string) => void;
  hovered: string | null;
  setHovered: (id: string | null) => void;
}

function Building({
  id,
  name,
  position,
  size,
  roofType = "pitched",
  activeSection,
  onSelect,
  hovered,
  setHovered,
}: BuildingProps) {
  const meshRef = useRef<THREE.Group>(null);
  const isSelected = activeSection === id || hovered === id;

  // Visual tokens from Section 6.2
  const wallColor = "#FFFFFF";
  const roofColor = isSelected ? "#2A56C6" : "#152A4E";
  const trimColor = isSelected ? "#2A56C6" : "#152A4E";

  const [w, h, d] = size;

  return (
    <group
      ref={meshRef}
      position={[position[0], position[1] + (isSelected ? 0.08 : 0), position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(id);
      }}
      onPointerOut={() => {
        setHovered(null);
      }}
    >
      {/* Building Base / Walls */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={wallColor} roughness={0.4} />
      </mesh>

      {/* Roof structure */}
      {roofType === "pitched" && (
        <mesh position={[0, h + 0.35, 0]} castShadow>
          <coneGeometry args={[w * 0.75, 0.7, 4]} />
          <meshStandardMaterial color={roofColor} roughness={0.3} />
        </mesh>
      )}

      {roofType === "flat" && (
        <mesh position={[0, h + 0.08, 0]} castShadow>
          <boxGeometry args={[w + 0.15, 0.16, d + 0.15]} />
          <meshStandardMaterial color={roofColor} roughness={0.3} />
        </mesh>
      )}

      {roofType === "tower" && (
        <group position={[0, h, 0]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[0.8, 1.2, 0.8]} />
            <meshStandardMaterial color={wallColor} />
          </mesh>
          <mesh position={[0, 1.4, 0]} castShadow>
            <coneGeometry args={[0.6, 0.8, 4]} />
            <meshStandardMaterial color={roofColor} />
          </mesh>
        </group>
      )}

      {/* Door / Trim Entry accent */}
      <mesh position={[0, 0.3, d / 2 + 0.01]}>
        <planeGeometry args={[0.5, 0.6]} />
        <meshBasicMaterial color={trimColor} />
      </mesh>
    </group>
  );
}

function GroundSlab() {
  return (
    <group>
      {/* Architectural ground slab */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[14, 0.3, 11]} />
        <meshStandardMaterial color="#F7F8FA" roughness={0.9} />
      </mesh>

      {/* Campus walking paths (flat strips on slab) */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.8, 8]} />
        <meshStandardMaterial color="#E1E5EB" />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} receiveShadow>
        <planeGeometry args={[0.8, 10]} />
        <meshStandardMaterial color="#E1E5EB" />
      </mesh>
    </group>
  );
}

function SceneContent({
  activeSection,
  onSelect,
  hovered,
  setHovered,
}: {
  activeSection: string;
  onSelect: (id: string) => void;
  hovered: string | null;
  setHovered: (id: string | null) => void;
}) {
  // Buildings definition matching Section 6.6
  const buildings = [
    {
      id: "safety",
      name: "Main Gate & Security Post",
      position: [0, 0, 3] as [number, number, number],
      size: [1.8, 1.0, 1.2] as [number, number, number],
      roofType: "flat" as const,
    },
    {
      id: "academics",
      name: "Teaching Block",
      position: [-3.2, 0, 1.2] as [number, number, number],
      size: [2.6, 1.6, 1.8] as [number, number, number],
      roofType: "flat" as const,
    },
    {
      id: "notices",
      name: "Administrative Office",
      position: [3.2, 0, 1.2] as [number, number, number],
      size: [2.2, 1.4, 1.8] as [number, number, number],
      roofType: "pitched" as const,
    },
    {
      id: "events",
      name: "Open-Air Stage & Auditorium",
      position: [2.8, 0, -2.6] as [number, number, number],
      size: [2.6, 0.8, 2.2] as [number, number, number],
      roofType: "flat" as const,
    },
    {
      id: "clubs",
      name: "Club House & Sports Pavilion",
      position: [-2.8, 0, -2.6] as [number, number, number],
      size: [2.2, 1.1, 2.0] as [number, number, number],
      roofType: "pitched" as const,
    },
    {
      id: "messages",
      name: "Central Library & Clock Tower",
      position: [0, 0, -2.2] as [number, number, number],
      size: [2.4, 1.5, 2.0] as [number, number, number],
      roofType: "tower" as const,
    },
  ];

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.0}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <GroundSlab />
      {buildings.map((b) => (
        <Building
          key={b.id}
          id={b.id}
          name={b.name}
          position={b.position}
          size={b.size}
          roofType={b.roofType}
          activeSection={activeSection}
          onSelect={onSelect}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </>
  );
}

export function CampusModel({
  activeSection = "safety",
  onSelectBuilding,
}: {
  activeSection?: string;
  onSelectBuilding?: (id: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const handleSelect = (id: string) => {
    if (onSelectBuilding) onSelectBuilding(id);
  };

  const buildingNames: Record<string, string> = {
    safety: "Main Gate & Security Post",
    academics: "Teaching Block",
    notices: "Administrative Office & Bulletin",
    events: "Open-Air Stage & Auditorium",
    clubs: "Club House & Sports Pavilion",
    messages: "Central Library & Clock Tower",
  };

  // Fallback still architectural illustration if WebGL is unavailable (Section 6.6)
  if (!hasWebGL) {
    return (
      <div className="w-full h-full min-h-[350px] bg-paper border border-line rounded-card flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 border-2 border-ink rounded-lg bg-surface flex items-center justify-center mb-4">
          <span className="font-heading font-extrabold text-ink text-2xl">VBU</span>
        </div>
        <h4 className="font-heading font-bold text-ink">Architectural Campus Model</h4>
        <p className="text-xs text-muted mt-1 max-w-xs">
          Vinoba Bhave University campus layout: 6 integrated modules for academics, notices, clubs, events, messages, and safety.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[380px] md:h-[500px] select-none" aria-hidden="true">
      {/* Floating Hover Label */}
      {hovered && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-ink text-surface text-xs font-semibold rounded shadow-none pointer-events-none">
          {buildingNames[hovered]}
        </div>
      )}

      {/* Rotation hint badge */}
      <div className="absolute bottom-3 right-3 z-10 px-2 py-1 bg-surface/90 border border-line rounded text-[11px] text-muted pointer-events-none">
        Drag to turn
      </div>

      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 8, 10], fov: 38 }}
        style={{ pointerEvents: "auto" }}
      >
        <SceneContent
          activeSection={activeSection}
          onSelect={handleSelect}
          hovered={hovered}
          setHovered={setHovered}
        />
      </Canvas>
    </div>
  );
}
