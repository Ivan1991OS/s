import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

const Earth = () => {
  const earthRef = useRef();
  
  useFrame(() => {
    earthRef.current.rotation.y += 0.003; // Sekin aylanish
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={new THREE.TextureLoader().load("https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Blue_Marble_2002.png/800px-Blue_Marble_2002.png")}
      />
    </mesh>
  );
};

const SpinningEarth = () => {
  return (
    <Canvas camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Stars />
      <OrbitControls enableZoom={false} />
      <Earth />
    </Canvas>
  );
};

export default SpinningEarth;
