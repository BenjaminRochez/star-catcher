import * as THREE from "three";
import React, { useRef, useState, Suspense } from "react";
import { Canvas, createPortal, useFrame } from "@react-three/fiber";

import Model from "./Astro";
import Planet from "./Planet";
import {
  useFBO,
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
  Stars,
  useTexture,
  Loader
} from "@react-three/drei";
useGLTF.preload("/card.glb");

function BackFace({ children, ...props }) {
  const CamBack = useRef();
  const fbo = useFBO({ stencilBuffer: true });
  const group = useRef();
  const backTexture = useTexture("./back.png");
  const [sceneBack] = useState(() => new THREE.Scene());
  useFrame((state) => {
    CamBack.current.matrixWorldInverse.copy(state.camera.matrixWorldInverse);
    state.gl.setRenderTarget(fbo);
    state.gl.render(sceneBack, CamBack.current);
    state.gl.setRenderTarget(null);
  });
  return (
    <>
      <group ref={group} {...props} dispose={null}>
        {/* back scene */}
        <mesh {...props} position={[0, 0, -0.035]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.05, 3.97]} />
          <meshPhysicalMaterial
            map={fbo.texture}
            transparent
            side={THREE.FrontSide}
          />
        </mesh>
      </group>

      {/* back texture png */}
      <mesh {...props} position={[0, 0, -0.025]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.0, 3.9]} />
        <meshPhysicalMaterial
          map={backTexture}
          transparent
          side={THREE.FrontSide}
        />
      </mesh>

      {/* back perspective camera */}
      <PerspectiveCamera
        manual
        ref={CamBack}
        fov={75}
        aspect={2.5 / 5}
        onUpdate={(c) => c.updateProjectionMatrix()}
      />

      {/* This is React being awesome, we portal this components children into the separate scene above */}
      {createPortal(children, sceneBack)}
    </>
  );
}
function MagicCard({ children, ...props }) {
  const cam = useRef();
  const fbo = useFBO({ stencilBuffer: true });
  const group = useRef();
  const { nodes, materials } = useGLTF("/card.glb");
  const [scene] = useState(() => new THREE.Scene());
  scene.background = new THREE.Color("#100E12");
  useFrame((state) => {
    cam.current.matrixWorldInverse.copy(state.camera.matrixWorldInverse);
    state.gl.setRenderTarget(fbo);
    state.gl.render(scene, cam.current);
    state.gl.setRenderTarget(null);
  });
  return (
    <>
      <group ref={group} {...props} dispose={null}>
        <mesh geometry={nodes.Plane_1.geometry} material={materials.gold} />
        <mesh
          geometry={nodes.Plane_2.geometry}
          material={materials.gold}
        ></mesh>

        <mesh geometry={nodes.Plane_3.geometry} material={materials.gold}>
          {" "}
        </mesh>
      </group>

      <mesh {...props} position={[0, 0, 0.01]}>
        <planeGeometry args={[1.9, 3.8]} />
        <meshPhysicalMaterial map={fbo.texture} />
      </mesh>

      <PerspectiveCamera
        manual
        ref={cam}
        fov={75}
        aspect={2.5 / 5}
        onUpdate={(c) => c.updateProjectionMatrix()}
      />

      {/* This is React being awesome, we portal this components children into the separate scene above */}
      {createPortal(children, scene)}
    </>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={1} />
      <pointLight position={[20, 20, 10]} />
      <pointLight position={[-10, -10, -10]} color="white" />
    </>
  );
}

function LightStar() {
  let count = 0;
  const staroRef = useRef();
  useFrame(({ clock }) => {
    staroRef.current.position.x = Math.sin(count * 0.03) / 8;
    count += 0.1;
  });
  return (
    <pointLight
      ref={staroRef}
      args={["#dbab00", 7, 3]}
      position={[0, 0, 0.5]}
      rotation={[0, 0, 0]}
      scale={[0.5, 0.5, 0.5]}
    />
  );
}

function LightRock() {
  return (
    <pointLight
      args={["#fff", 3, 10]}
      position={[-3, 2, -3]}
      rotation={[0, 0, 0]}
      scale={[1, 1, 1]}
    />
  );
}

export default function App() {
  const controls = useRef();

  return (
    <>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 75 }}>
        <Suspense fallback={null}>
          <Lights />
          <MagicCard>
            <Stars radius={100} depth={50} count={100} factor={10} />
            <LightStar />
            <Model />
            <ambientLight intensity={0.15} />
          </MagicCard>
          <BackFace>
            <Stars radius={100} depth={50} count={100} factor={10} />
            <LightRock />
            <Planet />
          </BackFace>
          <OrbitControls ref={controls} enableZoom={false} enablePan={false} />
        </Suspense>
      </Canvas>
      <Loader />
      <div className="atmosphere"></div>
    </>
  );
}
