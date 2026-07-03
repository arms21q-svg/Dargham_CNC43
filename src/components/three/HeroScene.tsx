"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Sparkles, RoundedBox } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { SCENE_COLORS, BRAND } from "@/lib/brand";
import { usePageActive, useIsDesktop } from "@/hooks/usePageActive";

const C = SCENE_COLORS;

function FrameMat({
  color = C.navyFrame,
  roughness = 0.22,
  metalness = 0.9,
}: {
  color?: string;
  roughness?: number;
  metalness?: number;
}) {
  return <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />;
}

function ChromeMat() {
  return <meshStandardMaterial color="#b8c4d4" metalness={0.98} roughness={0.12} />;
}

function GoldMat() {
  return <meshStandardMaterial color={C.gold} metalness={0.97} roughness={0.06} />;
}

function WoodMat({ color = C.woodOak }: { color?: string }) {
  return <meshStandardMaterial color={color} roughness={0.65} metalness={0.03} />;
}

/* ─── نقش عراقي على الخشب ─── */
function WoodCarving() {
  const grooves = useMemo(() => {
    const g: { pos: [number, number, number]; rot: number; size: [number, number, number] }[] = [];
    for (let i = -2; i <= 2; i++) {
      g.push({ pos: [i * 0.28, 0, 0], rot: 0, size: [0.035, 0.02, 0.9] });
      g.push({ pos: [0, 0, i * 0.28], rot: Math.PI / 2, size: [0.035, 0.02, 0.9] });
    }
    for (let a = 0; a < 6; a++) {
      const ang = (a / 6) * Math.PI;
      g.push({ pos: [Math.cos(ang) * 0.3, 0, Math.sin(ang) * 0.3], rot: ang, size: [0.05, 0.025, 0.35] });
    }
    return g;
  }, []);

  return (
    <group position={[0, 0.145, 0]}>
      {grooves.map((g, i) => (
        <mesh key={i} position={g.pos} rotation={[0, g.rot, 0]}>
          <boxGeometry args={g.size} />
          <meshStandardMaterial color={C.woodEngrave} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function Workpiece() {
  return (
    <group position={[0, 0.42, 0]}>
      <RoundedBox args={[1.8, 0.28, 1.2]} radius={0.03} smoothness={4} castShadow receiveShadow>
        <WoodMat />
      </RoundedBox>
      <WoodCarving />
    </group>
  );
}

/* ─── المغزل والمحور Z ─── */
function SpindleAssembly() {
  const bitRef = useRef<Mesh>(null);
  const colletRef = useRef<Mesh>(null);

  useFrame(() => {
    if (bitRef.current) bitRef.current.rotation.y += 0.25;
    if (colletRef.current) colletRef.current.rotation.y += 0.25;
  });

  return (
    <group position={[0, -0.55, 0]}>
      {/* موتور المغزل – أسطوانة أفقية */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.42, 20]} />
        <FrameMat color={C.navyDark} roughness={0.35} metalness={0.85} />
      </mesh>
      {/* خط ذهبي على الموتور */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.15, 0.15]}>
        <cylinderGeometry args={[0.145, 0.145, 0.04, 20]} />
        <GoldMat />
      </mesh>
      {/* عمود Z */}
      <mesh position={[0, -0.05, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 0.35, 16]} />
        <ChromeMat />
      </mesh>
      {/* كوليت */}
      <mesh ref={colletRef} position={[0, -0.28, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.065, 0.12, 12]} />
        <ChromeMat />
      </mesh>
      {/* رأس القطع */}
      <mesh ref={bitRef} position={[0, -0.4, 0]} castShadow>
        <coneGeometry args={[0.04, 0.12, 6]} />
        <GoldMat />
      </mesh>
      <pointLight position={[0, -0.35, 0]} intensity={0.8} color={C.gold} distance={1.5} />
    </group>
  );
}

/* ─── عربة المحور X (على الجسر) ─── */
function XCarriage() {
  const carriageRef = useRef<Group>(null);

  useFrame((state) => {
    if (carriageRef.current) {
      carriageRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.45) * 0.75;
    }
  });

  return (
    <group ref={carriageRef}>
      {/* قاعدة العربة */}
      <RoundedBox args={[0.55, 0.12, 0.5]} radius={0.02} smoothness={2} castShadow position={[0, 0, 0]}>
        <FrameMat />
      </RoundedBox>
      {/* عمود Z */}
      <mesh position={[0, -0.1, 0]} castShadow>
        <boxGeometry args={[0.18, 0.5, 0.18]} />
        <FrameMat color={C.navyMetal} />
      </mesh>
      {/* خطوط ذهبية على العمود */}
      <mesh position={[0.1, -0.1, 0]}>
        <boxGeometry args={[0.02, 0.45, 0.02]} />
        <GoldMat />
      </mesh>
      <SpindleAssembly />
    </group>
  );
}

/* ─── جسر Gantry (محور Y) ─── */
function GantryBridge() {
  const gantryRef = useRef<Group>(null);

  useFrame((state) => {
    if (gantryRef.current) {
      gantryRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.32) * 0.55;
    }
  });

  return (
    <group ref={gantryRef} position={[0, 1.05, 0]}>
      {/* العارضة الرئيسية – شكل I-beam */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 0.18, 0.22]} />
        <FrameMat />
      </mesh>
      <mesh castShadow position={[0, 0.12, 0]}>
        <boxGeometry args={[3.0, 0.06, 0.18]} />
        <FrameMat color={C.navyMetal} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 0.04, 0.24]} />
        <GoldMat />
      </mesh>
      {/* رفاري الجسر */}
      <mesh position={[-1.55, -0.2, 0]} castShadow>
        <boxGeometry args={[0.12, 0.4, 0.12]} />
        <FrameMat />
      </mesh>
      <mesh position={[1.55, -0.2, 0]} castShadow>
        <boxGeometry args={[0.12, 0.4, 0.12]} />
        <FrameMat />
      </mesh>

      <group position={[0, -0.35, 0]}>
        <XCarriage />
      </group>
    </group>
  );
}

/* ─── قضبان خطية Y ─── */
function LinearRails() {
  const railX = [-1.45, 1.45];
  return (
    <group>
      {railX.map((x) => (
        <group key={x} position={[x, 0.72, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.08, 0.08, 2.6]} />
            <ChromeMat />
          </mesh>
          {/* منزلقات */}
          {[-0.8, 0, 0.8].map((z) => (
            <mesh key={z} position={[0, 0.06, z]} castShadow>
              <boxGeometry args={[0.14, 0.06, 0.14]} />
              <FrameMat color={C.navyDark} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/* ─── لوحة التحكم ─── */
function ControlPanel() {
  return (
    <group position={[2.05, 0.65, 0.6]} rotation={[0, -0.35, 0]}>
      <RoundedBox args={[0.45, 0.65, 0.12]} radius={0.03} smoothness={3} castShadow>
        <FrameMat color={C.navyDark} roughness={0.4} />
      </RoundedBox>
      {/* شاشة */}
      <mesh position={[0, 0.12, 0.065]}>
        <planeGeometry args={[0.32, 0.2]} />
        <meshStandardMaterial color="#0d1a2d" emissive={C.navyMetal} emissiveIntensity={0.4} />
      </mesh>
      {/* أزرار ذهبية */}
      {[-0.12, 0, 0.12].map((x) => (
        <mesh key={x} position={[x, -0.15, 0.065]}>
          <cylinderGeometry args={[0.025, 0.025, 0.02, 12]} />
          <GoldMat />
        </mesh>
      ))}
      {/* زر طوارئ أحمر */}
      <mesh position={[0, -0.28, 0.065]}>
        <cylinderGeometry args={[0.04, 0.04, 0.025, 16]} />
        <meshStandardMaterial color="#c0392b" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ─── قاعدة الماكينة ─── */
function MachineCabinet() {
  return (
    <group>
      {/* خزانة القاعدة */}
      <RoundedBox args={[4.0, 0.55, 2.8]} radius={0.04} smoothness={3} position={[0, 0.28, 0]} castShadow receiveShadow>
        <FrameMat color={C.navyDark} roughness={0.35} metalness={0.82} />
      </RoundedBox>
      {/* خط ذهبي أمامي */}
      <mesh position={[0, 0.12, 1.41]}>
        <boxGeometry args={[3.6, 0.04, 0.02]} />
        <GoldMat />
      </mesh>
      {/* أرجل مطاطية */}
      {(
        [
          [-1.7, 0.04, -1.2],
          [1.7, 0.04, -1.2],
          [-1.7, 0.04, 1.2],
          [1.7, 0.04, 1.2],
        ] as [number, number, number][]
      ).map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 0.08, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.2} />
        </mesh>
      ))}
      {/* لوح التثبيت T-slot */}
      <mesh position={[0, 0.56, 0]} receiveShadow>
        <boxGeometry args={[3.4, 0.06, 2.4]} />
        <meshStandardMaterial color="#2a3545" roughness={0.75} metalness={0.25} />
      </mesh>
      {/* خطوط T-slot */}
      {[-1.0, 0, 1.0].map((x) => (
        <mesh key={x} position={[x, 0.6, 0]}>
          <boxGeometry args={[0.04, 0.02, 2.2]} />
          <ChromeMat />
        </mesh>
      ))}
    </group>
  );
}

/* ─── ماكينة CNC كاملة ─── */
function CNCMachine({ lite }: { lite?: boolean }) {
  const rootRef = useRef<Group>(null);

  useFrame((state) => {
    if (rootRef.current) {
      rootRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.04;
    }
  });

  return (
    <group ref={rootRef} position={[0, -0.15, 0]}>
      <MachineCabinet />
      <LinearRails />
      <GantryBridge />
      <ControlPanel />
      <Workpiece />

      {!lite && (
        <Sparkles
          count={12}
          scale={[1.5, 0.4, 1.2]}
          position={[0, 0.5, 0]}
          size={1}
          speed={0.3}
          color={C.gold}
          opacity={0.4}
        />
      )}
    </group>
  );
}

const SCENE_BG = BRAND.colors.white;
const SCENE_FLOOR = "#dce8f8";

function Scene({ shadows }: { shadows: boolean }) {
  return (
    <>
      <color attach="background" args={[SCENE_BG]} />
      <fog attach="fog" args={[SCENE_BG, 14, 32]} />

      <ambientLight intensity={0.65} />
      <hemisphereLight args={["#ffffff", "#e2e8f0", 0.85]} />
      <directionalLight
        position={[7, 11, 6]}
        intensity={1.2}
        castShadow={shadows}
        shadow-mapSize={shadows ? [1024, 1024] : undefined}
        shadow-camera-far={22}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight position={[-6, 5, -4]} intensity={0.45} color="#f8fafc" />

      <CNCMachine lite={!shadows} />

      {shadows && (
        <ContactShadows position={[0, -0.02, 0]} opacity={0.22} scale={14} blur={2} far={6} color="#64748b" />
      )}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow={shadows}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color={SCENE_FLOOR} roughness={0.95} metalness={0.05} />
      </mesh>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.25}
        maxPolarAngle={Math.PI / 2.05}
        minPolarAngle={Math.PI / 5.5}
        target={[0, 0.55, 0]}
      />
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-wood-cream/80 rounded-3xl">
      <div className="w-14 h-14 border-4 border-navy-300 border-t-gold rounded-full animate-spin" />
      <p className="font-display text-navy-600 text-sm">جاري تحميل المشهد...</p>
    </div>
  );
}

export function HeroScene() {
  const active = usePageActive();
  const isDesktop = useIsDesktop();

  return (
    <div className="w-full h-[320px] md:h-[480px] lg:h-[520px] bg-wood-cream">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          shadows={isDesktop}
          dpr={isDesktop ? [1, 1.25] : [1, 1]}
          frameloop={active ? "always" : "never"}
          camera={{ position: [5.5, 3.8, 5.5], fov: 40 }}
          gl={{ antialias: isDesktop, alpha: true, powerPreference: "high-performance" }}
        >
          <Scene shadows={isDesktop} />
        </Canvas>
      </Suspense>
    </div>
  );
}
