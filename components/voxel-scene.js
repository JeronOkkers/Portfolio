// "Jeron's corner" — an original voxel scene built in code (no model files):
// a wolf (from my logo) on a warehouse floor, my dev desk with a label printer,
// a pallet of boxes and a dumbbell. Inspired by the voxel style of
// craftz.dog, but every voxel here is defined below.
import { useEffect, useRef, useState } from 'react'
import { Box, Spinner } from '@chakra-ui/react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const C = {
  floor: '#8a8f98',
  hazardY: '#f6c343',
  hazardK: '#2a2a2e',
  wood: '#b07a45',
  woodDark: '#8a5a30',
  pallet: '#c9a26b',
  palletDark: '#9c7a4a',
  box: '#c8955c',
  tape: '#e8cf9c',
  label: '#f7f7f2',
  wolf: '#6b7280',
  wolfDark: '#4b5160',
  wolfLight: '#e5e7eb',
  eye: '#f6ad55',
  nose: '#1a1a1d',
  laptop: '#2d3748',
  screen: '#11151c',
  codeO: '#f6ad55',
  codeT: '#4fd1c5',
  codeP: '#b794f4',
  printer: '#e2e8f0',
  printerLid: '#4a5568',
  plate: '#2d3748',
  bar: '#a0aec0'
}

// --- voxel model --------------------------------------------------------
function buildVoxels() {
  const map = new Map()
  const set = (x, y, z, c) => map.set(`${x},${y},${z}`, [x, y, z, c])
  const fill = (x0, x1, y0, y1, z0, z1, c, ox = 0, oy = 0, oz = 0) => {
    for (let x = x0; x <= x1; x++)
      for (let y = y0; y <= y1; y++)
        for (let z = z0; z <= z1; z++) set(x + ox, y + oy, z + oz, c)
  }

  // Warehouse floor slab with a hazard stripe along the front edge
  fill(0, 23, -1, -1, 0, 23, C.floor)
  for (let x = 0; x <= 23; x++) {
    set(x, -1, 23, Math.floor(x / 2) % 2 ? C.hazardK : C.hazardY)
    set(x, -1, 22, Math.floor((x + 1) / 2) % 2 ? C.hazardK : C.hazardY)
  }

  // Pallet (back left)
  {
    const o = [1, 0, 1]
    const f = (a, b, c, d, e, g, col) => fill(a, b, c, d, e, g, col, ...o)
    f(0, 0, 0, 0, 0, 7, C.palletDark)
    f(3, 4, 0, 0, 0, 7, C.palletDark)
    f(7, 7, 0, 0, 0, 7, C.palletDark)
    for (const z of [0, 2, 4, 6, 7]) f(0, 7, 1, 1, z, z, C.pallet)
    // boxes
    f(0, 3, 2, 5, 0, 3, C.box)
    f(1, 2, 5, 5, 0, 3, C.tape)
    f(1, 2, 3, 3, 3, 3, C.label)
    f(4, 7, 2, 4, 1, 5, C.box)
    f(4, 7, 4, 4, 3, 3, C.tape)
    f(5, 6, 3, 3, 5, 5, C.label)
    f(0, 3, 6, 8, 0, 2, C.box)
    f(1, 2, 8, 8, 0, 2, C.tape)
    f(0, 3, 2, 3, 4, 7, C.box)
    f(0, 3, 3, 3, 5, 6, C.tape)
  }

  // Desk + laptop + label printer (back right)
  {
    const o = [11, 0, 1]
    const f = (a, b, c, d, e, g, col) => fill(a, b, c, d, e, g, col, ...o)
    f(0, 11, 6, 6, 0, 4, C.wood)
    for (const [x, z] of [[0, 0], [11, 0], [0, 4], [11, 4]]) f(x, x, 0, 5, z, z, C.woodDark)
    f(1, 10, 2, 2, 0, 0, C.woodDark) // back rail
    // laptop
    f(1, 6, 7, 7, 1, 3, C.laptop)
    f(1, 6, 8, 11, 0, 0, C.laptop)
    f(2, 5, 8, 10, 0, 0, C.screen)
    f(2, 4, 10, 10, 0, 0, C.codeO)
    f(3, 5, 9, 9, 0, 0, C.codeT)
    f(2, 3, 8, 8, 0, 0, C.codeP)
    // label printer + label coming out
    f(8, 10, 7, 8, 1, 3, C.printer)
    f(8, 10, 9, 9, 1, 3, C.printerLid)
    f(9, 9, 7, 7, 4, 5, C.label)
    f(9, 9, 6, 6, 5, 5, C.hazardK) // barcode-ish
  }

  // Wolf, sitting, facing the camera (front centre-left)
  {
    const o = [5, 0, 12]
    const f = (a, b, c, d, e, g, col) => fill(a, b, c, d, e, g, col, ...o)
    f(0, 4, 0, 1, 0, 2, C.wolf) // haunches
    f(1, 3, 2, 4, 1, 2, C.wolf) // torso
    f(1, 3, 2, 4, 3, 3, C.wolfLight) // chest
    f(1, 1, 0, 1, 3, 4, C.wolfLight) // front legs
    f(3, 3, 0, 1, 3, 4, C.wolfLight)
    f(0, 4, 5, 7, 1, 3, C.wolf) // head
    f(0, 4, 7, 7, 1, 2, C.wolfDark) // darker crown
    f(1, 3, 5, 5, 4, 5, C.wolfLight) // snout
    f(2, 2, 6, 6, 5, 5, C.nose)
    f(1, 1, 6, 6, 3, 3, C.eye)
    f(3, 3, 6, 6, 3, 3, C.eye)
    f(0, 1, 8, 8, 2, 2, C.wolfDark) // ears
    f(0, 0, 9, 9, 2, 2, C.wolfDark)
    f(3, 4, 8, 8, 2, 2, C.wolfDark)
    f(4, 4, 9, 9, 2, 2, C.wolfDark)
    f(5, 6, 0, 0, 0, 1, C.wolf) // tail curling round
    f(6, 6, 0, 0, 2, 3, C.wolf)
    f(6, 6, 1, 1, 3, 3, C.wolfLight)
  }

  // Dumbbell (front right)
  fill(16, 16, 0, 2, 15, 17, C.plate)
  fill(20, 20, 0, 2, 15, 17, C.plate)
  fill(17, 19, 1, 1, 16, 16, C.bar)

  return [...map.values()]
}

const easeOutCirc = x => Math.sqrt(1 - Math.pow(x - 1, 4))

const VoxelScene = () => {
  const ref = useRef(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch (e) {
      setLoading(false)
      return
    }
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    let w = container.clientWidth
    let h = container.clientHeight
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()

    // voxels → one instanced mesh
    const voxels = buildVoxels()
    const mesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0 }),
      voxels.length
    )
    mesh.castShadow = true
    mesh.receiveShadow = true
    const m = new THREE.Matrix4()
    const col = new THREE.Color()
    voxels.forEach(([x, y, z, c], i) => {
      m.makeTranslation(x - 11.5, y + 0.5, z - 11.5)
      mesh.setMatrixAt(i, m)
      // tiny per-voxel shade jitter for the hand-built look
      col.set(c).offsetHSL(0, 0, (Math.random() - 0.5) * 0.035)
      mesh.setColorAt(i, col)
    })
    scene.add(mesh)

    // lights
    scene.add(new THREE.HemisphereLight(0xffffff, 0x666677, 1.1))
    const sun = new THREE.DirectionalLight(0xfff1e0, 1.6)
    sun.position.set(-14, 26, 18)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20 })
    sun.shadow.bias = -0.0008
    scene.add(sun)
    // warm glow from the laptop screen
    const glow = new THREE.PointLight(0xf6ad55, 6, 10, 2)
    glow.position.set(3, 10, -9)
    scene.add(glow)

    // orthographic camera, Takuya-style
    const scale = 16
    const aspect = w / h
    const camera = new THREE.OrthographicCamera(
      -scale * aspect, scale * aspect, scale, -scale, 0.01, 1000
    )
    const target = new THREE.Vector3(0, 3.5, 0)
    const initial = new THREE.Vector3(
      40 * Math.sin(0.2 * Math.PI),
      22,
      40 * Math.cos(0.2 * Math.PI)
    )
    camera.position.copy(initial)
    camera.lookAt(target)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target = target
    controls.enableZoom = false
    controls.enablePan = false
    controls.autoRotate = !reduceMotion
    controls.autoRotateSpeed = 1.2

    const onResize = () => {
      w = container.clientWidth
      h = container.clientHeight
      const a = w / h
      Object.assign(camera, { left: -scale * a, right: scale * a })
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    let frame = 0
    let raf
    const render = () => {
      raf = requestAnimationFrame(render)
      frame = frame <= 100 ? frame + 1 : frame
      if (frame <= 100 && !reduceMotion) {
        // swoop-in intro
        // one smooth turn that lands exactly on the starting angle
        const p = initial
        const e = easeOutCirc(frame / 100)
        const rot = -e * Math.PI * 2
        camera.position.y = 50 + (p.y - 50) * e
        camera.position.x = p.x * Math.cos(rot) + p.z * Math.sin(rot)
        camera.position.z = p.z * Math.cos(rot) - p.x * Math.sin(rot)
        camera.lookAt(target)
      } else {
        controls.update()
      }
      renderer.render(scene, camera)
    }
    render()
    setLoading(false)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      controls.dispose()
      mesh.geometry.dispose()
      mesh.material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <Box
      ref={ref}
      m="auto"
      mt={['-10px', '-40px', '-70px']}
      mb={['-10px', '-50px', '-80px']}
      w={[280, 480, 600]}
      h={[280, 480, 600]}
      position="relative"
      cursor="grab"
      role="img"
      aria-label="Voxel scene: a wolf on a warehouse floor next to a desk with a laptop and label printer, a pallet of boxes and a dumbbell"
    >
      {loading && (
        <Spinner size="xl" position="absolute" left="50%" top="50%" transform="translate(-50%, -50%)" />
      )}
    </Box>
  )
}

export default VoxelScene
