import { useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import coverImg from '../assets/imgs/shared/Bookcover.png';
import woodenSignImg from '../assets/imgs/threeBook/au2cal.png';

function DustParticles() {
  const ref = useRef();
  const count = 120;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 7;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
      spd[i] = 0.25 + Math.random() * 0.45; // units per second
    }
    return [pos, spd];
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array;
    const t = Date.now() * 0.0003;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * delta;
      arr[i * 3] += Math.sin(t + i) * 0.001;
      if (arr[i * 3 + 1] > 3.5) {
        arr[i * 3 + 1] = -3.5;
        arr[i * 3] = (Math.random() - 0.5) * 12;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#d38a42" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function BookMesh() {
  const meshRef = useRef();
  const signRef = useRef();
  const animDone = useRef(false);
  const floatTime = useRef(0);

  const [coverTex, signTex] = useTexture(
    [coverImg, woodenSignImg],
    (textures) => {
      textures.forEach(t => {
        t.colorSpace = THREE.SRGBColorSpace;
        // Anisotropic filtering keeps the texture sharp when viewed at an angle.
        // 16 is the maximum most GPUs support; Three.js clamps to the device limit.
        t.anisotropy = 16;
        t.needsUpdate = true;
      });
    }
  );

  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: '#a95c14', roughness: 0.7 }),  // +X spine
    new THREE.MeshStandardMaterial({ color: '#f3e4d2', roughness: 0.9 }),  // -X pages
    new THREE.MeshStandardMaterial({ color: '#e8c6a1', roughness: 0.9 }),  // +Y top edge
    new THREE.MeshStandardMaterial({ color: '#e8c6a1', roughness: 0.9 }),  // -Y bottom edge
    new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.5 }),     // +Z front cover
    new THREE.MeshStandardMaterial({ color: '#c06e1e', roughness: 0.6 }),  // -Z back cover
  ], [coverTex]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Reset position for StrictMode double-invoke safety
    mesh.position.set(3, 4, -10);
    mesh.rotation.set(0.3, Math.PI + 0.5, 0.1);
    mesh.scale.setScalar(0.05);
    animDone.current = false;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });
      tl.to(mesh.position, { x: 0, y: 0.3, z: 0, duration: 2.2, ease: 'power3.out' }, 0);
      tl.to(mesh.rotation, { x: 0, y: 0.15, z: 0, duration: 2.2, ease: 'power3.out' }, 0);
      tl.to(mesh.scale, {
        x: 1, y: 1, z: 1,
        duration: 2.2,
        ease: 'back.out(1.4)',
        onComplete: () => { animDone.current = true; },
      }, 0);
    });

    return () => ctx.revert();
  }, []);

  useFrame((_, delta) => {
    if (!animDone.current || !meshRef.current) return;
    floatTime.current += delta;
    meshRef.current.rotation.y = 0.15 + Math.sin(floatTime.current * 0.45) * 0.12;
    meshRef.current.position.y = 0.3 + Math.sin(floatTime.current * 0.7) * 0.06;
  });

  return (
    <>
      <mesh ref={meshRef} material={materials}>
        <boxGeometry args={[1.5, 2.05, 0.14]} />
      </mesh>

      {/* Wooden sign — background prop */}
      <mesh ref={signRef} position={[0.2, -1.8, -3.5]} rotation={[0, 0, -0.04]}>
        <planeGeometry args={[5.5, 2.2]} />
        <meshStandardMaterial map={signTex} transparent alphaTest={0.1} roughness={0.8} />
      </mesh>
    </>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 4]} intensity={1.4} color="#fff5e0" />
      <pointLight position={[-3, 1, 3]} intensity={0.6} color="#e8701a" />
      <pointLight position={[3, -1, 2]} intensity={0.3} color="#ffd080" />
      <Suspense fallback={null}>
        <BookMesh />
        <DustParticles />
      </Suspense>
    </>
  );
}

function ThreeBook({ height = '65vh' }) {
  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent', display: 'block' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

export default ThreeBook;
