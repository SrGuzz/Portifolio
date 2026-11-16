import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { MARK, iconTexture, disposeIconTextures } from './icons';
import { FLOOR_Y, PATH_TILES, buildStops, pathPoints } from './formations';

// Mundo 3D: piso em grade, peças douradas com ícones e o monograma "AL".
// Tudo é interpolado a partir de J (posição na jornada).

const TILES = [
  { icon: 'cap', tone: 'gold' },
  { icon: 'pin', tone: 'gold' },
  { icon: 'layers', tone: 'gold' },
  { icon: 'api', tone: 'gold' },
  { icon: 'mark', tone: 'ink' },
  { icon: 'database', tone: 'gold' },
  { icon: 'chart', tone: 'gold' },
  { icon: 'cursor', tone: 'gold' },
  { icon: 'mark', tone: 'paper' },
  { icon: 'terminal', tone: 'gold' },
  { icon: 'loop', tone: 'gold' },
  { icon: 'spark', tone: 'gold' },
  { icon: 'dashboard', tone: 'gold' },
  { icon: 'plug', tone: 'gold' },
  { icon: 'shield', tone: 'gold' },
  { icon: 'bolt', tone: 'gold' },
  { icon: 'cloud', tone: 'gold' },
  { icon: 'code', tone: 'gold' },
  { icon: 'nodes', tone: 'gold' },
  { icon: 'mark', tone: 'gold' },
];

// [cor do traço, cor do ponto] do ícone em cada acabamento
const ICON_COLORS = {
  gold: ['#FFFFFF', '#FFFFFF'],
  ink: ['#F5F6F8', '#C9A227'],
  paper: ['#08090B', '#C9A227'],
};

const INK = new THREE.Color('#08090B');
const PAPER = new THREE.Color('#F5F6F8');

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const overshoot = (t) => 1 + 2.4 * (t - 1) ** 3 + 1.4 * (t - 1) ** 2;
const lerp = THREE.MathUtils.lerp;

const FLOOR_VERTEX = /* glsl */ `
  uniform float uCurve;
  varying vec3 vWorld;
  varying float vDepth;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    // o piso sobe atrás da cena, como o interior de uma esfera
    float back = min(world.z, 0.0);
    world.y += uCurve * (world.x * world.x * 0.6 + back * back);
    vWorld = world.xyz;
    vec4 mv = viewMatrix * world;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const FLOOR_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uCell;
  uniform float uNear;
  uniform float uFar;
  uniform float uLine;
  uniform float uCross;
  varying vec3 vWorld;
  varying float vDepth;
  void main() {
    vec2 g = vWorld.xz / uCell;
    vec2 fw = fwidth(g);
    vec2 d = abs(fract(g - 0.5) - 0.5);
    // linhas finas, com cerca de 1px na tela em qualquer distância
    vec2 l = 1.0 - smoothstep(fw * 0.5, fw * 1.25, d);
    float lines = max(l.x, l.y) * uLine;
    // "+" discreto nos cruzamentos
    float arm = 0.06;
    float crossX = l.y * (1.0 - smoothstep(arm - fw.x, arm, d.x));
    float crossY = l.x * (1.0 - smoothstep(arm - fw.y, arm, d.y));
    float a = max(lines, max(crossX, crossY) * uCross);
    float fog = 1.0 - smoothstep(uNear, uFar, vDepth);
    gl_FragColor = vec4(uColor, a * uOpacity * fog);
    #include <colorspace_fragment>
  }
`;

const LINE_VERTEX = /* glsl */ `
  varying float vU;
  void main() {
    vU = uv.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const LINE_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uProgress;
  uniform float uOpacity;
  varying float vU;
  void main() {
    if (vU > uProgress) discard;
    gl_FragColor = vec4(uColor, uOpacity);
    #include <colorspace_fragment>
  }
`;

/** Estúdio de luz usado só para gerar os reflexos das peças. */
function buildStudio() {
  const scene = new THREE.Scene();
  const box = new THREE.BoxGeometry();
  const room = new THREE.Mesh(
    box,
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.02, 0.02, 0.022), side: THREE.BackSide }),
  );
  room.scale.set(40, 30, 40);
  scene.add(room);
  const panel = (intensity, tint, position, scale) => {
    const color = new THREE.Color(tint[0] * intensity, tint[1] * intensity, tint[2] * intensity);
    const mesh = new THREE.Mesh(box, new THREE.MeshBasicMaterial({ color }));
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    scene.add(mesh);
  };
  const warm = [1, 0.87, 0.66];
  const soft = [1, 0.96, 0.9];
  panel(2.1, soft, [0, 14, 0], [26, 0.1, 22]);
  panel(3.2, warm, [0, 9, -15], [26, 9, 0.1]);
  panel(1.45, warm, [0, 0, 17], [36, 24, 0.1]);
  panel(3.2, soft, [-7, 7, 15], [11, 7, 0.1]);
  panel(7, warm, [-15, 5, -6], [0.1, 12, 2]);
  panel(5.5, soft, [15, 4, -4], [0.1, 10, 1.6]);
  panel(0.9, warm, [0, -10, 9], [30, 0.1, 20]);
  return scene;
}

const newSpec = () => ({ p: new THREE.Vector3(), q: new THREE.Quaternion(), s: 1, icon: 1 });

export class WorldEngine {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200);
  stops = [];
  tiles = [];
  logo = new THREE.Group();
  logoMaterials = [];
  geometries = [];
  disposables = [];
  labels = [];
  slots = {};
  width = 1;
  height = 1;
  mobile = false;
  time = 0;
  J = 0;
  introStart = -1;
  pointer = new THREE.Vector2();
  pointerSmooth = new THREE.Vector2();
  camPos = new THREE.Vector3();
  camTarget = new THREE.Vector3();
  v1 = new THREE.Vector3();
  color = new THREE.Color();

  constructor(canvas, options) {
    this.options = options;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const studio = buildStudio();
    const environment = pmrem.fromScene(studio, 0.03).texture;
    studio.traverse((object) => {
      object.geometry?.dispose();
      object.material?.dispose?.();
    });
    this.scene.environment = environment;
    this.disposables.push(environment, pmrem);

    const hemisphere = new THREE.HemisphereLight(0xffffff, 0x08090b, 0.45);
    const key = new THREE.DirectionalLight(0xfff1cf, 2.1);
    key.position.set(5, 8, 6);
    const rim = new THREE.DirectionalLight(0xffd977, 1.2);
    rim.position.set(-7, 3, -6);
    this.scene.add(hemisphere, key, rim);

    this.buildFloor();
    this.buildDust();
    this.buildTiles();
    this.buildLogo();
    this.resize();
  }

  /* ---------- construção ---------- */

  buildFloor() {
    const geometry = new THREE.PlaneGeometry(180, 180, 180, 180);
    geometry.rotateX(-Math.PI / 2);
    this.geometries.push(geometry);
    const material = new THREE.ShaderMaterial({
      vertexShader: FLOOR_VERTEX,
      fragmentShader: FLOOR_FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor: { value: PAPER.clone() },
        uOpacity: { value: 1 },
        uCurve: { value: 0.03 },
        uCell: { value: 2 },
        uNear: { value: 6 },
        uFar: { value: 46 },
        uLine: { value: 0.13 },
        uCross: { value: 0.42 },
      },
    });
    this.floor = new THREE.Mesh(geometry, material);
    this.floor.position.y = FLOOR_Y;
    this.floor.renderOrder = -1;
    this.scene.add(this.floor);
  }

  buildDust() {
    const count = 520;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = -1.2 + Math.random() * 16;
      positions[i * 3 + 2] = -32 + Math.random() * 42;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometries.push(geometry);
    const material = new THREE.PointsMaterial({
      color: PAPER.clone(),
      size: 0.045,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    this.dust = new THREE.Points(geometry, material);
    this.scene.add(this.dust);
  }

  buildTiles() {
    const body = new RoundedBoxGeometry(1, 1, 0.26, 5, 0.12);
    const face = new THREE.PlaneGeometry(0.64, 0.64);
    this.geometries.push(body, face);
    const materials = {
      gold: new THREE.MeshPhysicalMaterial({ color: '#E2B04E', metalness: 1, roughness: 0.38 }),
      ink: new THREE.MeshPhysicalMaterial({ color: '#17181B', metalness: 0.65, roughness: 0.34 }),
      paper: new THREE.MeshPhysicalMaterial({
        color: '#F5F6F8',
        metalness: 0,
        roughness: 0.42,
        clearcoat: 0.35,
        clearcoatRoughness: 0.3,
      }),
    };
    this.tiles = TILES.map((tile, index) => {
      const group = new THREE.Group();
      const [stroke, dot] = ICON_COLORS[tile.tone];
      const iconMaterial =
        tile.tone === 'gold'
          ? new THREE.MeshStandardMaterial({
              map: iconTexture(tile.icon, '#FFFFFF', '#FFFFFF'),
              color: '#2A1D04',
              metalness: 0.55,
              roughness: 0.5,
              transparent: true,
              depthWrite: false,
            })
          : new THREE.MeshBasicMaterial({
              map: iconTexture(tile.icon, stroke, dot),
              transparent: true,
              depthWrite: false,
              toneMapped: false,
            });
      const icon = new THREE.Mesh(face, iconMaterial);
      icon.position.z = 0.131;
      group.add(new THREE.Mesh(body, materials[tile.tone]), icon);
      this.scene.add(group);
      return { group, icon, iconMaterial, from: newSpec(), to: newSpec(), idle: index * 1.73 };
    });
  }

  buildLogo() {
    const toWorld = ([x, y]) => new THREE.Vector3((x - 32) / 16, -(y - 32) / 16, 0);
    const radius = MARK.stroke / 2 / 16;
    const parts = [];
    const up = new THREE.Vector3(0, 1, 0);
    [MARK.a, MARK.l].forEach((polyline) => {
      const points = polyline.map(toWorld);
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        const tube = new THREE.CylinderGeometry(radius, radius, a.distanceTo(b), 32, 1, true);
        tube.applyQuaternion(
          new THREE.Quaternion().setFromUnitVectors(up, this.v1.copy(b).sub(a).normalize()),
        );
        tube.translate((a.x + b.x) / 2, (a.y + b.y) / 2, 0);
        parts.push(tube);
      }
      points.forEach((point) => {
        const joint = new THREE.SphereGeometry(radius, 32, 20);
        joint.translate(point.x, point.y, 0);
        parts.push(joint);
      });
    });
    const strokes = mergeGeometries(parts);
    parts.forEach((part) => part.dispose());
    this.geometries.push(strokes);

    const porcelain = new THREE.MeshPhysicalMaterial({
      color: '#E9ECF2',
      roughness: 0.24,
      metalness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 0.55,
      transparent: true,
    });
    const gold = new THREE.MeshPhysicalMaterial({
      color: '#C9A227',
      metalness: 1,
      roughness: 0.22,
      transparent: true,
    });
    this.logoMaterials = [porcelain, gold];

    const dotGeometry = new THREE.SphereGeometry(MARK.dotRadius / 16, 40, 28);
    this.geometries.push(dotGeometry);
    const dot = new THREE.Mesh(dotGeometry, gold);
    const center = toWorld(MARK.dot);
    dot.position.set(center.x, center.y, 0.05);
    this.logo.add(new THREE.Mesh(strokes, porcelain), dot);
    this.scene.add(this.logo);
  }

  buildLine() {
    if (this.line) {
      this.scene.remove(this.line, this.lineTip);
      this.line.geometry.dispose();
    }
    const y = FLOOR_Y + 0.03;
    const points = pathPoints(this.mobile, this.width / this.height).map(
      ([x, z]) => new THREE.Vector3(x, y, z),
    );
    const start = points[0]
      .clone()
      .add(this.mobile ? new THREE.Vector3(0, 0, 1.6) : new THREE.Vector3(-1.6, 0, 0.7));
    this.lineCurve = new THREE.CatmullRomCurve3([start, ...points], false, 'centripetal');
    const geometry = new THREE.TubeGeometry(this.lineCurve, 240, 0.028, 8, false);
    if (this.line) {
      this.line.geometry = geometry;
    } else {
      const material = new THREE.ShaderMaterial({
        vertexShader: LINE_VERTEX,
        fragmentShader: LINE_FRAGMENT,
        transparent: true,
        uniforms: {
          uColor: { value: new THREE.Color('#C9A227') },
          uProgress: { value: 0 },
          uOpacity: { value: 1 },
        },
      });
      this.line = new THREE.Mesh(geometry, material);
      const tip = new THREE.SphereGeometry(0.075, 20, 14);
      this.geometries.push(tip);
      this.lineTip = new THREE.Mesh(tip, new THREE.MeshBasicMaterial({ color: '#C9A227', toneMapped: false }));
    }
    this.scene.add(this.line, this.lineTip);
  }

  /* ---------- API ---------- */

  tick(dt, J) {
    this.J = J;
    this.render(dt);
  }

  setSlot(name, rect) {
    this.slots = { ...this.slots, [name]: rect };
    this.rebuildStops();
  }

  setPointer(x, y) {
    this.pointer.set(x, y);
  }

  bindLabels(labels) {
    this.labels = labels;
  }

  playIntro() {
    this.introStart = this.options.reducedMotion ? -1 : this.time;
  }

  /** J da parada mais próxima (usado com movimento reduzido). */
  snap(J) {
    let best = this.stops[0].J;
    for (const stop of this.stops) {
      if (Math.abs(stop.J - J) < Math.abs(best - J)) best = stop.J;
    }
    return best;
  }

  rebuildStops() {
    this.stops = buildStops(
      {
        mobile: this.mobile,
        aspect: this.width / this.height,
        fov: this.camera.fov,
        width: this.width,
        height: this.height,
        tiles: this.tiles.length,
      },
      this.slots,
    );
  }

  resize() {
    const canvas = this.renderer.domElement;
    this.width = Math.max(1, canvas.clientWidth);
    this.height = Math.max(1, canvas.clientHeight);
    this.mobile = this.width < 768;
    const aspect = this.width / this.height;
    this.camera.aspect = aspect;
    this.camera.fov = aspect < 1 ? 52 : aspect < 1.3 ? 44 : 35;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.mobile ? 1.6 : 2));
    this.renderer.setSize(this.width, this.height, false);
    this.rebuildStops();
    this.buildLine();
    this.render(0);
  }

  dispose() {
    this.geometries.forEach((geometry) => geometry.dispose());
    this.disposables.forEach((item) => item.dispose());
    this.scene.traverse((object) => {
      if (!object.material) return;
      (Array.isArray(object.material) ? object.material : [object.material]).forEach((m) => m.dispose());
    });
    this.line?.geometry.dispose();
    disposeIconTextures();
    this.renderer.dispose();
  }

  /* ---------- quadro ---------- */

  segment(J) {
    const stops = this.stops;
    if (J <= stops[0].J) return { a: stops[0], b: stops[0], t: 0 };
    for (let i = 0; i < stops.length - 1; i++) {
      const a = stops[i];
      const b = stops[i + 1];
      if (J <= b.J) return { a, b, t: (J - a.J) / Math.max(1e-6, b.J - a.J) };
    }
    const last = stops[stops.length - 1];
    return { a: last, b: last, t: 0 };
  }

  render(dt) {
    const reduced = this.options.reducedMotion;
    if (!reduced) this.time += dt;
    const time = reduced ? 0 : this.time;
    const intro = this.introStart < 0 ? 1 : clamp01((this.time - this.introStart) / 2.4);
    const { a, b, t } = this.segment(this.J);
    const k = easeInOut(clamp01(t));
    const hh = 10 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const ctx = {
      t: time,
      aspect: this.width / this.height,
      mobile: this.mobile,
      n: this.tiles.length,
      hh,
      hw: hh * (this.width / this.height),
    };

    // câmera, com leve paralaxe do ponteiro
    this.pointerSmooth.lerp(this.pointer, reduced ? 1 : 1 - Math.exp(-dt * 3));
    this.camPos.set(
      lerp(a.cam.p[0], b.cam.p[0], k),
      lerp(a.cam.p[1], b.cam.p[1], k),
      lerp(a.cam.p[2], b.cam.p[2], k),
    );
    this.camTarget.set(
      lerp(a.cam.t[0], b.cam.t[0], k),
      lerp(a.cam.t[1], b.cam.t[1], k),
      lerp(a.cam.t[2], b.cam.t[2], k),
    );
    this.camera.position.copy(this.camPos);
    this.camera.position.x += this.pointerSmooth.x * 0.45;
    this.camera.position.y += this.pointerSmooth.y * 0.25;
    this.camera.lookAt(this.camTarget);
    this.camera.updateMatrixWorld();

    // peças: cada uma parte um pouco depois da anterior
    const wobble = lerp(a.wobble, b.wobble, k);
    const count = this.tiles.length;
    this.tiles.forEach((tile, index) => {
      a.f(index, ctx, tile.from);
      b.f(index, ctx, tile.to);
      const delay = (index / (count - 1)) * 0.28;
      const p = easeInOut(clamp01((clamp01(t) - delay) / 0.72));
      const group = tile.group;
      group.position.lerpVectors(tile.from.p, tile.to.p, p);
      group.quaternion.slerpQuaternions(tile.from.q, tile.to.q, p);
      group.scale.setScalar(Math.max(1e-4, lerp(tile.from.s, tile.to.s, p)));
      tile.iconMaterial.opacity = lerp(tile.from.icon, tile.to.icon, p);
      tile.icon.visible = tile.iconMaterial.opacity > 0.02;

      if (intro < 1) {
        const e = overshoot(clamp01((intro - (index / count) * 0.35) / 0.65));
        group.position.multiplyScalar(e);
        group.scale.multiplyScalar(Math.max(1e-4, e));
        group.rotateY((1 - e) * 2.4);
      }
      if (!reduced && wobble > 0) {
        group.position.y += Math.sin(time * 0.9 + tile.idle) * 0.06 * wobble;
        group.rotateX(Math.sin(time * 0.7 + tile.idle) * 0.035 * wobble);
        group.rotateY(Math.cos(time * 0.6 + tile.idle * 1.3) * 0.045 * wobble);
      }
    });

    // monograma
    const logoOpacity = lerp(a.logo.o, b.logo.o, k);
    this.logo.visible = logoOpacity > 0.01;
    if (this.logo.visible) {
      this.logo.position.set(
        lerp(a.logo.p[0], b.logo.p[0], k),
        lerp(a.logo.p[1], b.logo.p[1], k) + (reduced ? 0 : Math.sin(time * 0.8) * 0.08),
        lerp(a.logo.p[2], b.logo.p[2], k),
      );
      const pop = intro < 1 ? overshoot(clamp01(intro / 0.7)) : 1;
      this.logo.scale.setScalar(Math.max(1e-4, lerp(a.logo.s, b.logo.s, k) * pop));
      this.logo.rotation.set(
        this.pointerSmooth.y * 0.18 + (reduced ? 0 : Math.sin(time * 0.5) * 0.05),
        this.pointerSmooth.x * 0.35 + (reduced ? 0 : Math.sin(time * 0.35) * 0.12),
        0,
      );
      this.logoMaterials.forEach((material) => {
        material.opacity = logoOpacity;
      });
    }

    // piso, poeira e linha acompanham o tema
    const theme = lerp(a.theme, b.theme, k);
    const uniforms = this.floor.material.uniforms;
    uniforms.uCurve.value = lerp(a.curve, b.curve, k);
    uniforms.uOpacity.value = lerp(a.floor, b.floor, k) * (theme > 0.5 ? 0.85 : 1);
    this.color.copy(PAPER).lerp(INK, theme);
    uniforms.uColor.value.copy(this.color);
    this.dust.material.color.copy(this.color);
    this.dust.material.opacity = 0.5 - theme * 0.25;
    if (!reduced) this.dust.rotation.y = time * 0.006;

    if (this.line && this.lineCurve) {
      const progress = lerp(a.line, b.line, k);
      const visible = progress > 0.001;
      this.line.visible = this.lineTip.visible = visible;
      this.line.material.uniforms.uProgress.value = progress;
      if (visible) this.lineCurve.getPointAt(Math.min(0.999, progress), this.lineTip.position);
    }

    this.updateLabels();
    this.renderer.render(this.scene, this.camera);
    this.options.onUpdate?.({ J: this.J, theme, beam: lerp(a.beam, b.beam, k) });
  }

  /** Posiciona os rótulos do DOM sob as peças da trajetória. */
  updateLabels() {
    for (const { el, tile } of this.labels) {
      const target = this.tiles[tile];
      if (!el || !target || tile >= PATH_TILES) continue;
      this.v1.copy(target.group.position).project(this.camera);
      const x = (this.v1.x * 0.5 + 0.5) * this.width;
      const y = (-this.v1.y * 0.5 + 0.5) * this.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }
  }
}
