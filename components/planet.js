// Procedural lava planet rendered with Three.js — no model files needed.
// Replaces the template's voxel model. Respects prefers-reduced-motion.
import { useEffect, useRef, useState } from 'react'
import { Box, Spinner } from '@chakra-ui/react'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  void main() {
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// 3D value noise + fbm → dark crust with glowing lava cracks
const fragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vPos;
  varying vec3 vNormal;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                   mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                   mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 p = normalize(vPos) * 2.4;
    float flow = fbm(p + vec3(0.0, uTime * 0.04, 0.0));
    float n = fbm(p * 1.3 + flow * 1.6);

    // thin bright ridges where noise ~ 0.5 → lava cracks
    float crack = 1.0 - smoothstep(0.0, 0.045, abs(n - 0.5));
    float pulse = 0.85 + 0.15 * sin(uTime * 1.3 + n * 12.0);

    vec3 crust = mix(vec3(0.07, 0.05, 0.06), vec3(0.20, 0.12, 0.10), n);
    vec3 lava = mix(vec3(1.0, 0.27, 0.05), vec3(1.0, 0.78, 0.25), crack);
    vec3 col = mix(crust, lava * pulse, crack);

    // simple directional light + warm rim glow
    vec3 lightDir = normalize(vec3(0.6, 0.5, 0.8));
    float diff = clamp(dot(vNormal, lightDir), 0.0, 1.0);
    col *= 0.35 + 0.65 * diff + crack * 0.8;
    float rim = pow(1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 2.5);
    col += vec3(1.0, 0.35, 0.1) * rim * 0.55;

    gl_FragColor = vec4(col, 1.0);
  }
`

const Planet = () => {
  const ref = useRef(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch (e) {
      // No WebGL — just hide the spinner and leave the space empty.
      setLoading(false)
      return
    }

    const reduceMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const size = () => [container.clientWidth, container.clientHeight]
    let [w, h] = size()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100)
    camera.position.set(0, 0, 5.2)

    const uniforms = { uTime: { value: 0 } }
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(1.25, 96, 96),
      new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader })
    )
    planet.rotation.z = 0.35
    scene.add(planet)

    // soft additive glow halo
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(1.42, 64, 64),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float i = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            gl_FragColor = vec4(1.0, 0.38, 0.12, 1.0) * i;
          }`
      })
    )
    scene.add(halo)

    // a few orbiting embers
    const emberGeo = new THREE.BufferGeometry()
    const count = 140
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 1.7 + Math.random() * 0.9
      const a = Math.random() * Math.PI * 2
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5
      pos[i * 3 + 2] = Math.sin(a) * r
    }
    emberGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const embers = new THREE.Points(
      emberGeo,
      new THREE.PointsMaterial({
        color: 0xffa060,
        size: 0.025,
        transparent: true,
        opacity: 0.8
      })
    )
    embers.rotation.x = 0.35
    scene.add(embers)

    // drag to spin
    let dragging = false
    let lastX = 0
    let spinVel = 0
    const onDown = e => {
      dragging = true
      lastX = e.clientX
    }
    const onMove = e => {
      if (!dragging) return
      spinVel = (e.clientX - lastX) * 0.004
      planet.rotation.y += spinVel
      lastX = e.clientX
    }
    const onUp = () => (dragging = false)
    renderer.domElement.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    const onResize = () => {
      ;[w, h] = size()
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    const clock = new THREE.Clock()
    let raf
    const render = () => {
      const t = clock.getElapsedTime()
      uniforms.uTime.value = t
      if (!dragging) {
        planet.rotation.y += 0.0025 + spinVel
        spinVel *= 0.95
      }
      embers.rotation.y = t * 0.05
      renderer.render(scene, camera)
      if (!reduceMotion) raf = requestAnimationFrame(render)
    }
    render()
    setLoading(false)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      renderer.dispose()
      scene.traverse(o => {
        o.geometry?.dispose?.()
        o.material?.dispose?.()
      })
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <Box
      ref={ref}
      m="auto"
      mt={['-10px', '-30px', '-60px']}
      mb={['-30px', '-60px', '-90px']}
      w={[280, 420, 520]}
      h={[280, 420, 520]}
      position="relative"
      cursor="grab"
      aria-label="A slowly rotating lava planet"
      role="img"
    >
      {loading && (
        <Spinner
          size="xl"
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
        />
      )}
    </Box>
  )
}

export default Planet
