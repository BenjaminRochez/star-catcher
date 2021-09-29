/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Model({ ...props }) {
  const starRef = useRef();
  const astroRef = useRef();
  let count = 0;
  useFrame(({ clock }) => {
    starRef.current.position.x = Math.sin(count * 0.03) / 8;
    astroRef.current.position.x = Math.sin(count * 0.1) / 8;
    astroRef.current.position.y = Math.cos(count * 0.1) / 8;
    count += 0.1;
  });
  const group = useRef();
  const { nodes, materials } = useGLTF("/astro.glb");
  return (
    <group ref={group} {...props} dispose={null}>
      <group
        rotation={[-Math.PI / 2, 0, -Math.PI / 6]}
        scale={1.28}
        position={[0, -3, 0]}
      >
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group ref={astroRef}>
            <mesh
              geometry={nodes.Astronaut_geo_Astronaut_0.geometry}
              material={materials["Astronaut.001"]}
            />
            <mesh
              geometry={nodes.Backpack_geo_Backpack_0.geometry}
              material={materials["Backpack.001"]}
            />
          </group>
          <group
            position={[-0.28, 1.34, 0.44]}
            rotation={[-0.21, 0.55, -1.52]}
            scale={[5.64, 5.64, 5.64]}
          >
            <mesh ref={starRef} geometry={nodes.Star_geo_Star_0.geometry}>
              <meshPhysicalMaterial
                attach="material"
                color={"#ebeb2e"}
                roughness={0}
                metalness={1}
                emissive={"#ebeb2e"}
                shininess={2}
                emissiveIntensity={0.6}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/astro.glb");
