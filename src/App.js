import React, { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Sky, OrbitControls } from "@react-three/drei"
import Grass from "./Grass"
import Sound from "./Sound"

export default function App() {
  return (<>
    <form onsubmit="console.log('You clicked start.'); return false">
      <button type="submit">PLEASE PRESS THIS BUTTON IT IS THE ONLY WAY TO MAKE IT WORK PLSSSSS</button>
    </form>

    <Canvas camera={{ position: [15, 15, 30] }}>
      <Sky azimuth={1} inclination={0.6} distance={1000} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <Grass />
        <Sound position={[-40.2, 0, 40]} url="/a.mp3" />
        <Sound position={[40.2, 0, -40]} url="/b.mp3" />
      </Suspense>
      <OrbitControls minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI / 2.5} />
    </Canvas>
  </>)
}
