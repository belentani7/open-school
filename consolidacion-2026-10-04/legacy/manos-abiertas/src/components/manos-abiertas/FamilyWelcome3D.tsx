'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment, Text, Html } from '@react-three/drei';
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';

interface FamilyMemberProps {
  position: [number, number, number];
  color: string;
  scale: number;
  delay: number;
  ethnicity: 'latino' | 'africano' | 'asiatico' | 'arabe' | 'europeo';
}

function FamilyMember({ position, color, scale, delay, ethnicity }: FamilyMemberProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useFrame((state) => {
    if (meshRef.current && visible) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.05;
    }
  });

  const skinTones = {
    latino: ['#F5D0B0', '#E8B898', '#D4A574'],
    africano: ['#6B4423', '#8B5A2B', '#A0522D'],
    asiatico: ['#FFE4C4', '#FFDAB9', '#E8C4A0'],
    arabe: ['#C68642', '#D2A679', '#E5C4A0'],
    europeo: ['#FFE0BD', '#F5D0B0', '#E8C4A0'],
  };

  const clothesColors = {
    latino: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
    africano: ['#FF8C42', '#4A90D9', '#9B59B6'],
    asiatico: ['#E74C3C', '#3498DB', '#2ECC71'],
    arabe: ['#8E44AD', '#34495E', '#D35400'],
    europeo: ['#5D6D7E', '#28B463', '#AF7AC5'],
  };

  const currentSkinTones = skinTones[ethnicity];
  const currentClothesColor = clothesColors[ethnicity][Math.floor(Math.random() * 3)];

  return (
    <group
      ref={meshRef}
      position={position}
      scale={visible ? scale : 0}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Cabeza */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color={currentSkinTones[1]} roughness={0.6} />
      </mesh>

      {/* Cuerpo */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.5, 32]} />
        <meshStandardMaterial color={currentClothesColor} roughness={0.7} />
      </mesh>

      {/* Brazos */}
      <mesh position={[-0.3, 0.2, 0]} rotation={[0, 0, -0.5]}>
        <capsuleGeometry args={[0.06, 0.35, 4, 16]} />
        <meshStandardMaterial color={currentClothesColor} />
      </mesh>
      <mesh position={[0.3, 0.2, 0]} rotation={[0, 0, 0.5]}>
        <capsuleGeometry args={[0.06, 0.35, 4, 16]} />
        <meshStandardMaterial color={currentClothesColor} />
      </mesh>

      {/* Piernas */}
      <mesh position={[-0.12, -0.4, 0]}>
        <capsuleGeometry args={[0.07, 0.4, 4, 16]} />
        <meshStandardMaterial color="#2C3E50" />
      </mesh>
      <mesh position={[0.12, -0.4, 0]}>
        <capsuleGeometry args={[0.07, 0.4, 4, 16]} />
        <meshStandardMaterial color="#2C3E50" />
      </mesh>

      {/* Manos abiertas gesture */}
      <mesh position={[-0.45, 0.0, 0.15]} rotation={[0.3, 0, 0.8]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={currentSkinTones[1]} />
      </mesh>
      <mesh position={[0.45, 0.0, 0.15]} rotation={[0.3, 0, -0.8]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={currentSkinTones[1]} />
      </mesh>

      {hovered && (
        <Html position={[0, 1.2, 0]} center>
          <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-xs font-medium whitespace-nowrap border border-gray-200">
            🤝 Bienvenido/a
          </div>
        </Html>
      )}

      <ContactShadows
        position={[0, -0.6, 0]}
        opacity={0.4}
        scale={1.5}
        blur={2}
        far={2}
      />
    </group>
  );
}

function WelcomeText() {
  const textRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
  });

  return (
    <group ref={textRef} position={[0, 2.5, 0]}>
      <Text
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
      >
        MANOS ABIERTAS
        <meshBasicMaterial attach="material" color="#ffffff" toneMapped={false} />
      </Text>
      <Text
        fontSize={0.15}
        color="#e0e0e0"
        anchorX="center"
        anchorY="middle"
        position={[0, -0.3, 0]}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
      >
        Tu puerta de entrada a la IA
        <meshBasicMaterial attach="material" color="#e0e0e0" toneMapped={false} />
      </Text>
    </group>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#4ECDC4" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export function FamilyWelcome3D() {
  const familyMembers = useMemo(
    () => [
      { position: [-1.5, 0, 0] as [number, number, number], color: '#F5D0B0', scale: 1.1, delay: 200, ethnicity: 'latino' as const },
      { position: [-0.5, 0, 0.5] as [number, number, number], color: '#6B4423', scale: 1.0, delay: 400, ethnicity: 'africano' as const },
      { position: [0.5, 0, 0.3] as [number, number, number], color: '#FFE4C4', scale: 0.95, delay: 600, ethnicity: 'asiatico' as const },
      { position: [1.5, 0, 0] as [number, number, number], color: '#C68642', scale: 1.05, delay: 800, ethnicity: 'arabe' as const },
      { position: [0, 0, -0.8] as [number, number, number], color: '#FFE0BD', scale: 1.0, delay: 1000, ethnicity: 'europeo' as const },
    ],
    []
  );

  return (
    <div className="w-full h-[400px] md:h-[500px] relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <color attach="background" args={['#1a1a2e']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4ECDC4" />
        
        <Environment preset="night" />
        
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
          {familyMembers.map((member, index) => (
            <FamilyMember key={index} {...member} />
          ))}
        </Float>

        <WelcomeText />
        <Particles />

        <ContactShadows position={[0, -0.61, 0]} opacity={0.5} scale={10} blur={3} far={4} />
      </Canvas>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
}
