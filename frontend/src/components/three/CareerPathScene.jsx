import { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// A gentle curved ribbon of light with glass nodes floating along it —
// represents the student's path through time (semesters -> career).
function PathCurve() {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const x = (t - 0.5) * 14;
      const y = Math.sin(t * Math.PI * 1.4) * 1.6 - 0.4;
      const z = Math.cos(t * Math.PI * 0.8) * 1.2;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  const tubeGeo = useMemo(() => new THREE.TubeGeometry(points, 100, 0.02, 8, false), [points]);

  return (
    <mesh geometry={tubeGeo}>
      <meshStandardMaterial color="#5B5FEF" emissive="#5B5FEF" emissiveIntensity={0.6} transparent opacity={0.35} />
    </mesh>
  );
}

function Node({ position, color, scale = 1, speed = 1 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.2 * speed;
    }
  });
  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.1}
          transmission={0.85}
          thickness={0.6}
          ior={1.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  const nodes = useMemo(
    () => [
      { position: [-5.5, -0.9, 0.6], color: '#5B5FEF', scale: 0.9, speed: 1.1 },
      { position: [-2.6, 1.1, -0.4], color: '#A5D8FF', scale: 0.7, speed: 0.9 },
      { position: [0.2, -0.6, 0.9], color: '#E8B94E', scale: 1.05, speed: 1.3 },
      { position: [2.8, 1.3, -0.6], color: '#12B5A6', scale: 0.75, speed: 1.0 },
      { position: [5.4, -0.5, 0.4], color: '#5B5FEF', scale: 0.95, speed: 1.2 },
    ],
    []
  );

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-5, -3, -5]} intensity={0.4} color="#A5D8FF" />
      <PathCurve />
      {nodes.map((n, i) => (
        <Node key={i} {...n} />
      ))}
      <Sparkles count={35} scale={12} size={2} speed={0.3} opacity={0.5} color="#5B5FEF" />
      <Environment preset="city" environmentIntensity={0.5} />
    </>
  );
}

export default function CareerPathScene({ className = '' }) {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {visible && (
        <Canvas
          camera={{ position: [0, 0.4, 7.5], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
          frameloop="always"
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
