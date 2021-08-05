import * as THREE from 'three'
import React, { useRef, useEffect, useState } from 'react'
import {  useThree, useLoader } from '@react-three/fiber'


export default function Sound(props) {
    const sound = useRef()
    const { camera } = useThree()
    const [listener] = useState(() => new THREE.AudioListener())
    const buffer = useLoader(THREE.AudioLoader, props.url)
    useEffect(() => {
      sound.current.setBuffer(buffer)
      sound.current.setRefDistance(10)
      sound.current.setLoop(true)
      sound.current.play()
      camera.add(listener)
      return () => camera.remove(listener)
    }, [])
    return (
      <mesh
      {...props}>
        {/* <boxBufferGeometry args={[10, 10, 10]} /> */}
        {/* <meshBasicMaterial attach="material" color="hotpink" opacity="0"  /> */}
        <positionalAudio ref={sound} args={[listener]} />
      </mesh>
    )
  }