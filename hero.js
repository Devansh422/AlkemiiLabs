import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.126.1/build/three.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.126.1/examples/jsm/postprocessing/EffectComposer.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.126.1/examples/jsm/postprocessing/ShaderPass.js';
import { SavePass } from 'https://cdn.jsdelivr.net/npm/three@0.126.1/examples/jsm/postprocessing/SavePass.js';
import { CopyShader } from 'https://cdn.jsdelivr.net/npm/three@0.126.1/examples/jsm/shaders/CopyShader.js';
import { FXAAShader } from 'https://cdn.jsdelivr.net/npm/three@0.126.1/examples/jsm/shaders/FXAAShader.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.126.1/examples/jsm/postprocessing/RenderPass.js';

(() => {
  const triColorMix = {
    uniforms: {
      tDiffuse1: { value: null },
      tDiffuse2: { value: null },
      tDiffuse3: { value: null }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D tDiffuse1;
      uniform sampler2D tDiffuse2;
      uniform sampler2D tDiffuse3;

      void main() {
        vec4 del0 = texture2D(tDiffuse1, vUv);
        vec4 del1 = texture2D(tDiffuse2, vUv);
        vec4 del2 = texture2D(tDiffuse3, vUv);
        float alpha = min(min(del0.a, del1.a), del2.a);
        gl_FragColor = vec4(del0.r, del1.g, del2.b, alpha);
      }
    `
  };

  const root = document.getElementById('hero-animation');
  if (!root) return;

  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  root.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#1C1917');

  const camera = new THREE.OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    0.1,
    1000
  );
  camera.position.set(0, 0, 100);
  camera.zoom = 20;
  camera.updateProjectionMatrix();

  const dotGeometry = new THREE.CircleGeometry(0.15, 8);
  const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const gridSize = 100;
  const dotCount = gridSize * gridSize;
  const instanced = new THREE.InstancedMesh(dotGeometry, dotMaterial, dotCount);
  scene.add(instanced);

  const transform = new THREE.Matrix4();
  const vec = new THREE.Vector3();
  const right = new THREE.Vector3(1, 0, 0);
  const vec3Mouse = new THREE.Vector3();
  const focus = new THREE.Vector3();
  const positions = [...Array(dotCount)].map((_, i) => {
    const position = new THREE.Vector3();
    position.x = (i % gridSize) - gridSize / 2;
    position.y = Math.floor(i / gridSize) - gridSize / 2;
    position.y += (i % 2) * 0.5;
    position.x += Math.random() * 0.3;
    position.y += Math.random() * 0.3;
    return position;
  });

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  const blendPass = new ShaderPass(triColorMix, 'tDiffuse1');
  blendPass.needsSwap = false;
  const savePass = new SavePass();
  savePass.needsSwap = true;
  const fxaaPass = new ShaderPass(FXAAShader);
  const copyPass = new ShaderPass(CopyShader);
  copyPass.renderToScreen = true;
  composer.addPass(renderPass);
  composer.addPass(blendPass);
  composer.addPass(savePass);
  composer.addPass(fxaaPass);
  composer.addPass(copyPass);

  const rtA = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
  const rtB = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
  let swap = false;
  savePass.renderTarget = rtA;
  blendPass.uniforms['tDiffuse2'].value = rtA.texture;
  blendPass.uniforms['tDiffuse3'].value = rtB.texture;

  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    composer.setSize(width, height);
    rtA.setSize(width, height);
    rtB.setSize(width, height);
    camera.left = width / -2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = height / -2;
    camera.updateProjectionMatrix();
    fxaaPass.material.uniforms['resolution'].value.set(
      1 / (width * renderer.getPixelRatio()),
      1 / (height * renderer.getPixelRatio())
    );
  };
  window.addEventListener('resize', resize, false);
  resize();

  let ticks = 0;
  let ticksValue = 0;
  let ticksVelocity = 0;
  let clickValue = 0;
  let clickVelocity = 0;
  const springConfig = { tension: 20, friction: 20, clamp: true };

  const onPointerDown = (event) => {
    renderer.domElement.setPointerCapture(event.pointerId);
    ticks += 1;
  };
  const onPointerUp = () => {
    if (ticks % 2 === 1) {
      if (clickValue > 0.5) ticks += 1;
      else ticks -= 1;
    }
  };
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointercancel', onPointerUp);

  const mouse = { x: 0, y: 0 };
  const onPointerMove = (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };
  renderer.domElement.addEventListener('pointermove', onPointerMove, false);

  let lastTime = performance.now();
  let elapsedTime = 0;
  const animate = (time) => {
    const dt = Math.min(0.05, (time - lastTime) / 1000);
    lastTime = time;
    elapsedTime += dt;

    const k = springConfig.tension;
    const c = springConfig.friction;

    const ticksTarget = ticks;
    const ticksAccel = k * (ticksTarget - ticksValue) - c * ticksVelocity;
    ticksVelocity += ticksAccel * dt;
    ticksValue += ticksVelocity * dt;

    const clickTarget = ticks % 2 === 1 ? 1 : 0;
    const clickAccel = k * (clickTarget - clickValue) - c * clickVelocity;
    clickVelocity += clickAccel * dt;
    clickValue += clickVelocity * dt;
    if (springConfig.clamp) {
      if (clickValue > 1) clickValue = 1;
      if (clickValue < 0) clickValue = 0;
    }

    const autoTicks = elapsedTime * (2 / 3.8);
    const combinedTicks = ticksValue + autoTicks;

    const viewWidth = renderer.domElement.clientWidth / camera.zoom;
    const viewHeight = renderer.domElement.clientHeight / camera.zoom;
    vec3Mouse.set((mouse.x * viewWidth) / 2, (mouse.y * viewHeight) / 2, 0);
    for (let i = 0; i < dotCount; ++i) {
      focus.copy(vec3Mouse).multiplyScalar(clickValue);
      vec.copy(positions[i]).sub(focus);
      const dist = vec.length() + Math.cos(vec.angleTo(right) * 8) * 0.5;
      const t = combinedTicks / 2 + 1 / 2 - dist / 100;
      const wave = roundedSquareWave(t, 0.15 + (0.2 * dist) / 72, 0.4, 1);
      vec.multiplyScalar(wave + 1.3).add(focus);
      transform.setPosition(vec);
      instanced.setMatrixAt(i, transform);
    }
    instanced.instanceMatrix.needsUpdate = true;

    const delay1 = swap ? rtB : rtA;
    const delay2 = swap ? rtA : rtB;
    savePass.renderTarget = delay2;
    blendPass.uniforms['tDiffuse2'].value = delay1.texture;
    blendPass.uniforms['tDiffuse3'].value = delay2.texture;
    composer.render();
    swap = !swap;

    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);

  const roundedSquareWave = (t, delta = 0.1, a = 1, f = 1 / 10) => {
    return ((2 * a) / Math.PI) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta);
  };
})();
