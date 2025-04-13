import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Box, Spinner } from '@chakra-ui/react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const VoxelDog = () => {
  const refContainer = useRef()
  const [loading, setLoading] = useState(true)
  const [renderer, setRenderer] = useState()
  const [_camera, setCamera] = useState()
  const [target] = useState(new THREE.Vector3(-0.5, 1.2, 0))
  const [initialCameraPosition] = useState(
    new THREE.Vector3(
      20 * Math.sin(0.2 * Math.PI),
      10,
      20 * Math.cos(0.2 * Math.PI)
    )
  )
  const [scene] = useState(new THREE.Scene())
  const [_controls, setControls] = useState()
  let mixer

  const handleWindowResize = useCallback(() => {
    const { current: container } = refContainer
    if (container && renderer && _camera) {
      const scW = container.clientWidth
      const scH = container.clientHeight

      renderer.setSize(scW, scH)
      _camera.aspect = scW / scH
      _camera.updateProjectionMatrix()
    }
  }, [renderer, _camera])

  useEffect(() => {
    const { current: container } = refContainer
    if (!container) return

    const waitForSizeAndInit = () => {
      const scW = container.clientWidth
      const scH = container.clientHeight

      if (scW === 0 || scH === 0) {
        setTimeout(waitForSizeAndInit, 100)
        return
      }

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(scW, scH)
      renderer.outputEncoding = THREE.sRGBEncoding
      if (container.children.length === 1) {
        container.appendChild(renderer.domElement)
      }
      setRenderer(renderer)

      const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.01, 50000)
      camera.position.copy(initialCameraPosition)
      camera.lookAt(target)
      setCamera(camera)

        // Ambient light for general visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)

        // Directional light to simulate sunlight
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(5, 10, 5)
        directionalLight.castShadow = true
        scene.add(directionalLight)

        // Optional: Hemisphere light for soft sky-like glow
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3)
        hemiLight.position.set(0, 20, 0)
        scene.add(hemiLight)


      const controls = new OrbitControls(camera, renderer.domElement)
      controls.autoRotate = true
      controls.target = target
      setControls(controls)

      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/draco/')

      const loader = new GLTFLoader()
      loader.setDRACOLoader(dracoLoader)
      loader.load(
        '/Tokyo.glb',
        function (gltf) {
          const model = gltf.scene
          model.position.set(0, 2, 0)
          model.scale.set(0.015, 0.015, 0.015)
          scene.add(model)

          mixer = new THREE.AnimationMixer(model)
          const animation = gltf.animations[0]
          if (animation) {
            mixer.clipAction(animation).play()
          }

          setLoading(false)
        },
        undefined,
        function (e) {
          console.error(e)
          setLoading(false)
        }
      )

      let req = null
      const animate = () => {
        req = requestAnimationFrame(animate)

        if (mixer) {
          mixer.update(0.01)
        }

        controls.update()
        renderer.render(scene, camera)
      }

      animate()

      // Cleanup on unmount
      return () => {
        cancelAnimationFrame(req)
        renderer.dispose()
      }
    }

    waitForSizeAndInit()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize, false)
    return () => {
      window.removeEventListener('resize', handleWindowResize, false)
    }
  }, [renderer, handleWindowResize])

  return (
    <Box
      ref={refContainer}
      className="voxel-dog"
      m="auto"
      mt={['-20px', '-60px', '-120px']}
      mb={['-40px', '-140px', '-200px']}
      w={[280, 480, 640]}
      h={[280, 480, 640]}
      position="relative"
    >
      {loading && (
        <Spinner
          size="xl"
          position="absolute"
          left="50%"
          top="50%"
          ml="calc(0px - var(--spinner  -size) / 2)"
          mt="calc(0px - var(--spinner-size))"
        />
      )}
    </Box>
  )
}

export default VoxelDog
