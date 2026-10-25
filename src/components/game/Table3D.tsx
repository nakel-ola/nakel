import { GAME_TO, Side, useMatch } from "@/components/providers/Match";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type Props = {
  /** Start the rally (e.g. once the intro has finished). */
  active: boolean;
  className?: string;
  /** Called when the visitor takes or gives up control of their paddle. */
  onControlChange?: (playing: boolean) => void;
};

// Regulation table, in metres. "u" runs along the table (Nunu at 0, you at L), "v" across it.
const L = 2.74;
const W = 1.525;
const TOP = 0.76; // table height
const BALL_R = 0.03; // a little larger than real so it reads on screen
const PADDLE_R = 0.12;
const PADDLE_Y = TOP + 0.15;
const REACH = 0.18; // how far behind the end line each player strikes
const ARC = 0.38; // height scale of the ball's flight

const IDLE_MS = 4000; // hand back to auto-play after this long without input
const SERVE_DELAY = 0.75;
const BOUNCE_AT = 0.66; // share of a traverse where the ball lands on the far half

// Courtside barrier boards around Nunu's end of the court. The "sponsors" are the stack.
const BOARD_W = 1.8;
const BOARD_H = 0.7;
const BOARD_PX = 480; // texture pixels per board
const BACK_ROW = 3; // boards across the back; the side walls turn the corners towards the camera
const COURT_BACK = -L / 2 - 3.6; // z of the back row
const COURT_SIDE = (BACK_ROW / 2) * BOARD_W; // |x| of the side walls
const BOARD_COLORS = { face: "#1E3480", text: "#B7C8F6" };
// Back row left to right, then each side wall from the back corner forwards.
const BACK_ADS = ["NAKEL", "FULL-STACK\nDEVELOPER", "NAKEL"];
const LEFT_ADS = ["REACT", "FLUTTER", "TYPESCRIPT", "NAKEL"];
const RIGHT_ADS = ["NEXT.JS", "NODE", "WEB + MOBILE", "LAGOS"];

const COLORS = {
  table: "#1C2A5C",
  line: "#E8E8E8",
  frame: "#0E0E10",
  ball: "#2563EB",
  nunu: "#E6E6E6",
  you: "#26272B",
  handle: "#3A3B41",
};

type Paddle = { v: number; vel: number; swing: number; aim: number };

const uOf = (side: Side) => (side === "nunu" ? -REACH : L + REACH);
// World axes: x across the table, y up, z along it (Nunu far, you near the camera).
const toX = (v: number) => v - W / 2;
const toZ = (u: number) => u - L / 2;

/** A 3D table-tennis rally rendered with three.js. */
export const Table3D = ({ active, className, onControlChange }: Props) => {
  const host = useRef<HTMLDivElement>(null);
  const { point, reset } = useMatch();
  const api = useRef({ point, reset, onControlChange });
  api.current = { point, reset, onControlChange };
  const begin = useRef<() => void>(() => {});

  useEffect(() => {
    const el = host.current;
    const section = el?.parentElement;
    if (!el || !section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ------------------------------------------------------------ scene
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    // Soft studio reflections give the surfaces a little sheen.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;
    scene.environmentIntensity = 0.35;
    pmrem.dispose();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    const lookAt = new THREE.Vector3(0, 0.45, -0.35);
    const camBase = new THREE.Vector3();

    scene.add(new THREE.HemisphereLight(0xffffff, 0x0a0a0c, 0.45));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(-1.4, 6, 1.6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -2.4;
    key.shadow.camera.right = 2.4;
    key.shadow.camera.top = 2.8;
    key.shadow.camera.bottom = -2.8;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 12;
    key.shadow.bias = -0.0004;
    key.shadow.radius = 3;
    key.shadow.normalBias = 0.01;
    scene.add(key);
    // Arena spotlight: a soft pool of light on the table.
    const spot = new THREE.SpotLight(0xffffff, 70, 14, 0.42, 0.85, 1.4);
    spot.position.set(0, 5.5, 0.2);
    spot.target.position.set(0, TOP, 0);
    scene.add(spot, spot.target);

    const disposables: { dispose: () => void }[] = [];
    const mat = <T extends THREE.Material>(m: T) => (disposables.push(m), m);
    const geo = <T extends THREE.BufferGeometry>(g: T) => (disposables.push(g), g);

    // Floor only shows the shadows, so the page background shows through.
    const floor = new THREE.Mesh(geo(new THREE.PlaneGeometry(30, 30)), mat(new THREE.ShadowMaterial({ opacity: 0.55 })));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const table = new THREE.Group();
    scene.add(table);
    const top = new THREE.Mesh(
      geo(new THREE.BoxGeometry(W, 0.03, L)),
      mat(new THREE.MeshStandardMaterial({ color: COLORS.table, roughness: 0.38, metalness: 0.1 }))
    );
    top.position.y = TOP - 0.015;
    top.castShadow = top.receiveShadow = true;
    table.add(top);

    // Painted lines sit a hair above the surface.
    const lineMat = mat(new THREE.MeshStandardMaterial({ color: COLORS.line, roughness: 0.4 }));
    const paint = (w: number, l: number, x: number, z: number) => {
      const m = new THREE.Mesh(geo(new THREE.BoxGeometry(w, 0.002, l)), lineMat);
      m.position.set(x, TOP + 0.001, z);
      m.receiveShadow = true;
      table.add(m);
    };
    paint(0.02, L, -W / 2 + 0.01, 0);
    paint(0.02, L, W / 2 - 0.01, 0);
    paint(W, 0.02, 0, -L / 2 + 0.01);
    paint(W, 0.02, 0, L / 2 - 0.01);
    paint(0.003, L, 0, 0);

    // Undercarriage and legs.
    const frameMat = mat(new THREE.MeshStandardMaterial({ color: COLORS.frame, roughness: 0.7, metalness: 0.3 }));
    for (const [x, z] of [
      [-0.62, -1.15],
      [0.62, -1.15],
      [-0.62, 1.15],
      [0.62, 1.15],
    ]) {
      const leg = new THREE.Mesh(geo(new THREE.BoxGeometry(0.05, TOP - 0.03, 0.05)), frameMat);
      leg.position.set(x, (TOP - 0.03) / 2, z);
      leg.castShadow = true;
      table.add(leg);
    }
    const apron = new THREE.Mesh(geo(new THREE.BoxGeometry(W - 0.08, 0.06, L - 0.1)), frameMat);
    apron.position.y = TOP - 0.06;
    table.add(apron);

    // Net: mesh texture, white tape along the top, two posts.
    const netCanvas = document.createElement("canvas");
    netCanvas.width = netCanvas.height = 64;
    const nctx = netCanvas.getContext("2d")!;
    nctx.strokeStyle = "#fff";
    nctx.lineWidth = 2;
    for (let i = 0; i <= 64; i += 16) {
      nctx.beginPath();
      nctx.moveTo(i, 0);
      nctx.lineTo(i, 64);
      nctx.moveTo(0, i);
      nctx.lineTo(64, i);
      nctx.stroke();
    }
    const netTex = new THREE.CanvasTexture(netCanvas);
    netTex.wrapS = netTex.wrapT = THREE.RepeatWrapping;
    netTex.repeat.set(70, 6);
    disposables.push(netTex);
    const netW = W + 0.3;
    const net = new THREE.Mesh(
      geo(new THREE.PlaneGeometry(netW, 0.1525)),
      mat(
        new THREE.MeshStandardMaterial({
          color: "#CFCFCF",
          alphaMap: netTex,
          transparent: true,
          opacity: 0.55,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      )
    );
    net.position.set(0, TOP + 0.076, 0);
    table.add(net);
    const tape = new THREE.Mesh(geo(new THREE.BoxGeometry(netW, 0.012, 0.006)), lineMat);
    tape.position.set(0, TOP + 0.152, 0);
    tape.castShadow = true;
    table.add(tape);
    for (const x of [-netW / 2, netW / 2]) {
      const post = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.012, 0.012, 0.17, 12)), frameMat);
      post.position.set(x, TOP + 0.085, 0);
      post.castShadow = true;
      table.add(post);
    }

    // Court floor inside the barriers, so the boards stand on something.
    const court = new THREE.Mesh(
      geo(new THREE.PlaneGeometry(COURT_SIDE * 2, 14)),
      mat(new THREE.MeshStandardMaterial({ color: "#7A1F18", roughness: 0.78 })) // tournament-red court
    );
    court.rotation.x = -Math.PI / 2;
    court.position.set(0, 0.001, COURT_BACK + 7);
    court.receiveShadow = true;
    scene.add(court);

    // Barrier boards: one continuous fence, one atlas texture; each board's UVs pick its cell.
    const boards: { text: string; x: number; z: number; ry: number }[] = [
      ...BACK_ADS.map((text, i) => ({ text, x: (i - (BACK_ROW - 1) / 2) * BOARD_W, z: COURT_BACK, ry: 0 })),
      ...[LEFT_ADS, RIGHT_ADS].flatMap((ads, s) =>
        ads.map((text, i) => ({
          text,
          x: (s ? 1 : -1) * COURT_SIDE,
          z: COURT_BACK + (i + 0.5) * BOARD_W,
          ry: s ? -Math.PI / 2 : Math.PI / 2, // face the court
        }))
      ),
    ];
    const adCanvas = document.createElement("canvas");
    adCanvas.width = BOARD_PX * boards.length;
    adCanvas.height = Math.round((BOARD_PX * BOARD_H) / BOARD_W);
    const adTex = new THREE.CanvasTexture(adCanvas);
    adTex.colorSpace = THREE.SRGBColorSpace;
    adTex.anisotropy = 8;
    disposables.push(adTex);
    const fontFamily = getComputedStyle(el).fontFamily;

    const drawBoards = () => {
      const h = adCanvas.height;
      const ctx = adCanvas.getContext("2d")!;
      ctx.fillStyle = BOARD_COLORS.face;
      ctx.fillRect(0, 0, adCanvas.width, h);
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillStyle = BOARD_COLORS.text;
      boards.forEach(({ text }, i) => {
        // Heavy, slanted, sized to fill the board like a sponsor mark.
        const lines = text.split("\n");
        ctx.font = `900 100px ${fontFamily}`;
        const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
        const size = Math.min(h * (lines.length > 1 ? 0.34 : 0.5), (100 * BOARD_PX * 0.78) / widest);
        ctx.font = `900 ${size}px ${fontFamily}`;
        lines.forEach((line, j) => {
          ctx.save();
          ctx.translate(i * BOARD_PX + BOARD_PX / 2, h / 2 + (j - (lines.length - 1) / 2) * size * 0.92);
          ctx.transform(1, 0, -0.2, 1, 0, 0);
          ctx.fillText(line, 0, size * 0.04);
          ctx.restore();
        });
      });
      adTex.needsUpdate = true;
    };
    drawBoards();
    // Redraw once the page font is in, so the boards match the site's type.
    document.fonts?.load(`900 64px ${fontFamily}`).then(() => {
      if (!renderer.domElement.isConnected) return;
      drawBoards();
      render();
    });

    // Lit like the rest of the arena, with a little self-light so they read outside the spot.
    const adMat = mat(
      new THREE.MeshStandardMaterial({
        map: adTex,
        roughness: 0.7,
        emissive: 0xffffff,
        emissiveMap: adTex,
        emissiveIntensity: 0.3,
      })
    );
    const backMat = mat(new THREE.MeshStandardMaterial({ color: BOARD_COLORS.face, roughness: 0.8 }));
    const bodyGeo = geo(new THREE.BoxGeometry(BOARD_W - 0.01, BOARD_H, 0.04));
    boards.forEach(({ x, z, ry }, i) => {
      const board = new THREE.Group();
      board.position.set(x, 0, z);
      board.rotation.order = "YXZ";
      board.rotation.set(-0.12, ry, 0); // leans back a little, like the real thing
      const body = new THREE.Mesh(bodyGeo, backMat);
      body.position.y = BOARD_H / 2;
      body.castShadow = true;
      const faceGeo = geo(new THREE.PlaneGeometry(BOARD_W - 0.01, BOARD_H));
      const uv = faceGeo.attributes.uv;
      for (let j = 0; j < uv.count; j++) uv.setX(j, (uv.getX(j) + i) / boards.length);
      const face = new THREE.Mesh(faceGeo, adMat);
      face.position.set(0, BOARD_H / 2, 0.021);
      face.receiveShadow = true;
      board.add(body, face);
      scene.add(board);
    });

    const makePaddle = (side: Side) => {
      const g = new THREE.Group();
      const blade = new THREE.Mesh(
        geo(new THREE.CylinderGeometry(PADDLE_R, PADDLE_R, 0.014, 48)),
        mat(new THREE.MeshStandardMaterial({ color: COLORS[side], roughness: 0.75 }))
      );
      blade.rotation.x = Math.PI / 2; // face the net
      blade.castShadow = true;
      g.add(blade);
      if (side === "you") {
        const rim = new THREE.Mesh(
          geo(new THREE.TorusGeometry(PADDLE_R, 0.006, 8, 64)),
          mat(new THREE.MeshStandardMaterial({ color: COLORS.line, roughness: 0.4 }))
        );
        g.add(rim);
      }
      const handle = new THREE.Mesh(
        geo(new THREE.BoxGeometry(0.03, 0.11, 0.026)),
        mat(new THREE.MeshStandardMaterial({ color: COLORS.handle, roughness: 0.6 }))
      );
      handle.position.y = -PADDLE_R - 0.05;
      handle.castShadow = true;
      g.add(handle);
      scene.add(g);
      return g;
    };
    const paddleMesh: Record<Side, THREE.Group> = { nunu: makePaddle("nunu"), you: makePaddle("you") };

    const ballMesh = new THREE.Mesh(
      geo(new THREE.SphereGeometry(BALL_R, 32, 16)),
      mat(
        new THREE.MeshStandardMaterial({
          // White like a match ball, so it reads against the blue table.
          color: "#F7F7F5",
          emissive: "#FFFFFF",
          emissiveIntensity: 0.25,
          roughness: 0.35,
        })
      )
    );
    ballMesh.castShadow = true;
    scene.add(ballMesh);

    // Landing marks: a blue ring that spreads and fades.
    const ringGeo = geo(new THREE.RingGeometry(0.03, 0.036, 48));
    const rings: { mesh: THREE.Mesh; age: number }[] = [];
    const addRing = (u: number, v: number) => {
      const m = new THREE.Mesh(
        ringGeo,
        new THREE.MeshBasicMaterial({ color: COLORS.ball, transparent: true, depthWrite: false })
      );
      m.rotation.x = -Math.PI / 2;
      m.position.set(toX(v), TOP + 0.003, toZ(u));
      scene.add(m);
      rings.push({ mesh: m, age: 0 });
    };

    // ------------------------------------------------------------ simulation
    const paddles: Record<Side, Paddle> = {
      nunu: { v: W / 2, vel: 0, swing: 0, aim: 0 },
      you: { v: W / 2, vel: 0, swing: 0, aim: 0 },
    };
    const ball = { u: 0, v: W / 2, vu: 0, vv: 0, z: 0, from: 0, to: 0, landed: false, live: false };
    const base = L / 1.25; // m/s along the table
    let server: Side = "nunu";
    let serveIn = SERVE_DELAY;
    let playing = false;
    let lastInput = -Infinity;
    let pointerV: number | null = null;
    let pointerNX = 0; // -1..1, for camera parallax
    let gameOverIn = 0;
    let localScore = { nunu: 0, you: 0 };

    const clampV = (v: number) => Math.min(W + 0.25, Math.max(-0.25, v));

    // Aim at a landing spot on the far half, so every shot is a legal one.
    const launch = (side: Side, speed: number, offset: number) => {
      const dir = side === "nunu" ? 1 : -1;
      const from = uOf(side);
      const to = uOf(side === "nunu" ? "you" : "nunu");
      const landU = from + (to - from) * BOUNCE_AT;
      const landV = Math.min(W - 0.12, Math.max(0.12, ball.v + offset * W * 0.55));
      const t = Math.abs(landU - ball.u) / speed;
      ball.vu = dir * speed;
      ball.vv = (landV - ball.v) / t;
      ball.from = from;
      ball.to = to;
      ball.landed = false;
      ball.live = true;
      paddles[side].swing = 1;
      const receiver = side === "nunu" ? "you" : "nunu";
      const sloppiness = receiver === "nunu" ? 0.3 + (speed / base - 1) * 1.1 : playing ? 0 : 0.2;
      paddles[receiver].aim = (Math.random() * 2 - 1) * PADDLE_R * sloppiness;
    };

    const serve = () => {
      ball.u = uOf(server);
      ball.v = paddles[server].v;
      launch(server, base * 0.85, Math.random() * 1.6 - 0.8);
    };

    const scorePoint = (winner: Side) => {
      ball.live = false;
      server = winner === "nunu" ? "you" : "nunu";
      serveIn = SERVE_DELAY + 0.4;
      if (!playing) return; // demo rallies don't count
      localScore = { ...localScore, [winner]: localScore[winner] + 1 };
      api.current.point(winner);
      if (localScore[winner] >= GAME_TO) {
        gameOverIn = 2.6;
        serveIn = Infinity;
      }
    };

    const startGame = () => {
      localScore = { nunu: 0, you: 0 };
      api.current.reset();
      server = "nunu";
      ball.live = false;
      serveIn = SERVE_DELAY;
    };

    const ai = (side: Side, dt: number, skill: number) => {
      const p = paddles[side];
      const incoming = ball.live && (side === "nunu" ? ball.vu < 0 : ball.vu > 0);
      let target = W / 2 + p.aim * 0.3;
      if (incoming) {
        const t = (uOf(side) - ball.u) / ball.vu;
        target = ball.v + ball.vv * Math.max(0, t) + p.aim;
      }
      const maxSpeed = W * (1.1 + skill * 1.4);
      const dv = Math.max(-maxSpeed * dt, Math.min(maxSpeed * dt, target - p.v));
      p.vel = dv / Math.max(dt, 1e-4);
      p.v = clampV(p.v + dv);
    };

    const step = (dt: number) => {
      if (playing && performance.now() - lastInput > IDLE_MS) {
        playing = false;
        api.current.onControlChange?.(false);
      }
      const you = paddles.you;
      if (playing && pointerV !== null) {
        const before = you.v;
        you.v = clampV(you.v + (clampV(pointerV) - you.v) * Math.min(1, dt * 22));
        you.vel = (you.v - before) / Math.max(dt, 1e-4);
      } else {
        ai("you", dt, 0.9);
      }
      ai("nunu", dt, 0.55);
      paddles.nunu.swing = Math.max(0, paddles.nunu.swing - dt * 4);
      paddles.you.swing = Math.max(0, paddles.you.swing - dt * 4);

      if (gameOverIn > 0) {
        gameOverIn -= dt;
        if (gameOverIn <= 0) startGame();
      }

      if (!ball.live) {
        serveIn -= dt;
        ball.u = uOf(server) + (server === "nunu" ? 1 : -1) * 0.04;
        ball.v = paddles[server].v;
        ball.z = 0.35;
        if (serveIn <= 0) serve();
        return;
      }

      ball.u += ball.vu * dt;
      ball.v += ball.vv * dt;

      // One long arc onto the far half, then a shorter hop up to the paddle.
      const t = Math.abs(ball.u - ball.from) / Math.abs(ball.to - ball.from);
      if (t < BOUNCE_AT) {
        const s = t / BOUNCE_AT;
        ball.z = 0.35 * (1 - s) + 0.9 * 4 * s * (1 - s);
      } else {
        const s = Math.min(1.4, (t - BOUNCE_AT) / (1 - BOUNCE_AT));
        ball.z = Math.max(0, 0.75 * 4 * s * (1 - s * 0.72));
        if (!ball.landed) {
          ball.landed = true;
          addRing(ball.u, ball.v);
        }
      }

      for (const side of ["nunu", "you"] as Side[]) {
        const towards = side === "nunu" ? ball.vu < 0 : ball.vu > 0;
        if (!towards) continue;
        const face = uOf(side);
        const reached = side === "nunu" ? ball.u <= face : ball.u >= face;
        if (!reached) continue;
        const p = paddles[side];
        if (Math.abs(ball.v - p.v) <= PADDLE_R + BALL_R) {
          const speed = Math.min(base * 1.9, Math.abs(ball.vu) * 1.05);
          launch(side, speed, (ball.v - p.v) / (PADDLE_R + BALL_R) + p.vel * 0.08);
        } else if (side === "nunu" ? ball.u < face - 0.5 : ball.u > face + 0.5) {
          scorePoint(side === "nunu" ? "you" : "nunu");
        }
      }
    };

    // ------------------------------------------------------------ render
    const sync = () => {
      for (const side of ["nunu", "you"] as Side[]) {
        const p = paddles[side];
        const g = paddleMesh[side];
        const toward = side === "nunu" ? 1 : -1; // towards the net
        g.position.set(toX(p.v), PADDLE_Y, toZ(uOf(side)) + toward * p.swing * 0.08);
        g.rotation.x = toward * p.swing * 0.5;
        g.rotation.z = (p.v - W / 2) * -0.25;
      }
      ballMesh.position.set(toX(ball.v), TOP + BALL_R + Math.max(0, ball.z) * ARC, toZ(ball.u));
      ballMesh.visible = ball.live || serveIn !== Infinity;

      camera.position.set(camBase.x + pointerNX * 0.25, camBase.y, camBase.z);
      camera.lookAt(lookAt);
    };

    const render = () => {
      sync();
      renderer.render(scene, camera);
    };

    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = `${w}px`;
      renderer.domElement.style.height = `${h}px`;
      camera.aspect = w / h;
      // Portrait screens need a wider lens and a higher, further camera to fit the table.
      const portrait = h > w;
      // Landscape sits high and back like a broadcast camera, so the court and barriers show.
      camera.fov = portrait ? 44 : 29;
      camBase.set(0, portrait ? 3.4 : 3.0, L / 2 + (portrait ? 3.5 : 4.0));
      lookAt.set(0, portrait ? 0.35 : 0.3, portrait ? -0.15 : -0.7);
      camera.updateProjectionMatrix();
    };

    // ------------------------------------------------------------ loop
    let raf = 0;
    let last = 0;
    let visible = true;
    let running = false;

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.033, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      for (let i = 0; i < 3; i++) step(dt / 3);
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.age += dt;
        const k = r.age / 0.6;
        r.mesh.scale.setScalar(1 + k * 4);
        (r.mesh.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - k);
        if (k >= 1) {
          scene.remove(r.mesh);
          (r.mesh.material as THREE.Material).dispose();
          rings.splice(i, 1);
        }
      }
      render();
      if (running && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || reduced || !running || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    // ------------------------------------------------------------ input
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -PADDLE_Y);
    const hit = new THREE.Vector3();
    const ndc = new THREE.Vector2();

    const onMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      pointerNX = ndc.x;
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) pointerV = hit.x + W / 2;
      lastInput = performance.now();
      if (!playing && running && !reduced) {
        playing = true;
        api.current.onControlChange?.(true);
        startGame();
      }
    };

    measure();
    render();

    const ro = new ResizeObserver(() => {
      measure();
      render();
    });
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(el);
    const onVis = () => !document.hidden && start();
    document.addEventListener("visibilitychange", onVis);
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerdown", onMove);

    begin.current = () => {
      running = true;
      start();
    };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerdown", onMove);
      rings.forEach((r) => (r.mesh.material as THREE.Material).dispose());
      disposables.forEach((d) => d.dispose());
      envMap.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    if (active) begin.current();
  }, [active]);

  return <div ref={host} aria-hidden className={cn("absolute inset-0", className)} />;
};

export default Table3D;
