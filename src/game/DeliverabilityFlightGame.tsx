import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createEmailDroneGroup } from './droneModel';
import { createMatrixWorld, generateObstaclesAndCollectibles, GameObstacle, GameCollectible } from './matrixWorld';
import { soundEngine } from './audio';
import { Volume2, VolumeX, Pause, Play, RotateCcw, ArrowLeft, Shield, Sparkles, Zap, Award } from 'lucide-react';

interface DeliverabilityFlightGameProps {
  onReturnToStudio: (perkApplied?: string) => void;
  campaignTitle: string;
}

export const DeliverabilityFlightGame: React.FC<DeliverabilityFlightGameProps> = ({
  onReturnToStudio,
  campaignTitle,
}) => {
  const canvasMountRef = useRef<HTMLDivElement>(null);

  // High-level game shell state
  const [gameState, setGameState] = useState<'title' | 'playing' | 'paused' | 'gameover' | 'victory'>('title');
  const [deliverabilityHealth, setDeliverabilityHealth] = useState(100);
  const [clicksScore, setClicksScore] = useState(0);
  const [distanceRemaining, setDistanceRemaining] = useState(580);
  const [combo, setCombo] = useState(1);
  const [speedMps, setSpeedMps] = useState(38);
  const [isMuted, setIsMuted] = useState(false);
  const [hitWarning, setHitWarning] = useState<string | null>(null);

  // Mutable refs for high-frequency game loop without React re-renders
  const gameRef = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    droneGroup: THREE.Group | null;
    updateThrusters: ((t: number, s: number) => void) | null;
    obstacles: GameObstacle[];
    collectibles: GameCollectible[];
    keys: { [key: string]: boolean };
    dronePos: { x: number; y: number; z: number };
    droneVel: { x: number; y: number; z: number };
    droneRotZ: number;
    health: number;
    score: number;
    combo: number;
    currentSpeed: number;
    targetSpeed: number;
    cameraShake: number;
    animFrameId: number;
    lastTime: number;
    totalDistance: number;
    state: 'title' | 'playing' | 'paused' | 'gameover' | 'victory';
  }>({
    renderer: null,
    scene: null,
    camera: null,
    droneGroup: null,
    updateThrusters: null,
    obstacles: [],
    collectibles: [],
    keys: {},
    dronePos: { x: 0, y: 1.2, z: 0 },
    droneVel: { x: 0, y: 0, z: 0 },
    droneRotZ: 0,
    health: 100,
    score: 0,
    combo: 1,
    currentSpeed: 38,
    targetSpeed: 38,
    cameraShake: 0,
    animFrameId: 0,
    lastTime: 0,
    totalDistance: 580,
    state: 'title',
  });

  // Sync state between component and game loop
  useEffect(() => {
    gameRef.current.state = gameState;
  }, [gameState]);

  // Main Three.js Lifecycle
  useEffect(() => {
    const mountEl = canvasMountRef.current;
    if (!mountEl) return;

    // 1. Scene, Camera, Renderer
    const width = mountEl.clientWidth || window.innerWidth;
    const height = mountEl.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913); // Deep Cyber Matrix Obsidian
    scene.fog = new THREE.FogExp2(0x060913, 0.0075); // Horizon fog matching background

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 700);
    camera.position.set(0, 3.2, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountEl.appendChild(renderer.domElement);

    // 2. Studio PBR Environment Reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Studio Lighting Rig
    // Warm Key Light with tight shadow frustum
    const keyLight = new THREE.DirectionalLight(0xfff1e6, 2.2);
    keyLight.position.set(12, 24, 15);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 80;
    keyLight.shadow.camera.left = -16;
    keyLight.shadow.camera.right = 16;
    keyLight.shadow.camera.top = 16;
    keyLight.shadow.camera.bottom = -16;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Cool Sky / Ground Fill
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1e1b4b, 1.2);
    scene.add(hemiLight);

    // Cyan Neon Ambience
    const neonPoint = new THREE.PointLight(0x06b6d4, 2, 40);
    neonPoint.position.set(0, 5, 0);
    scene.add(neonPoint);

    // 4. Matrix World Corridor
    createMatrixWorld(scene);

    // 5. Procedural 8-Part Drone Model
    const { droneGroup, updateThrusters } = createEmailDroneGroup();
    droneGroup.position.set(0, 1.2, 0);
    scene.add(droneGroup);

    // 6. Obstacles & Collectibles
    const { obstacles, collectibles } = generateObstaclesAndCollectibles(scene);

    // Store in ref
    const g = gameRef.current;
    g.renderer = renderer;
    g.scene = scene;
    g.camera = camera;
    g.droneGroup = droneGroup;
    g.updateThrusters = updateThrusters;
    g.obstacles = obstacles;
    g.collectibles = collectibles;
    g.dronePos = { x: 0, y: 1.2, z: 0 };
    g.droneVel = { x: 0, y: 0, z: 0 };
    g.health = 100;
    g.score = 0;
    g.combo = 1;
    g.currentSpeed = 38;
    g.targetSpeed = 38;
    g.lastTime = performance.now();

    // Key event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      g.keys[e.key.toLowerCase()] = true;
      if (e.key === ' ' && g.state === 'title') {
        startGame();
      } else if ((e.key === 'p' || e.key === 'Escape') && (g.state === 'playing' || g.state === 'paused')) {
        togglePause();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      g.keys[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Window resize
    const handleResize = () => {
      if (!mountEl || !g.renderer || !g.camera) return;
      const w = mountEl.clientWidth;
      const h = mountEl.clientHeight;
      g.camera.aspect = w / h;
      g.camera.updateProjectionMatrix();
      g.renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Pointer steering for mouse / touch drag
    let isPointerDown = false;
    let pointerStartX = 0;
    let pointerStartY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      if (g.state === 'title') {
        startGame();
        return;
      }
      isPointerDown = true;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerDown || g.state !== 'playing') return;
      const dx = (e.clientX - pointerStartX) / window.innerWidth;
      const dy = (e.clientY - pointerStartY) / window.innerHeight;
      g.droneVel.x += dx * 12;
      g.droneVel.y -= dy * 10;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
    };

    const handlePointerUp = () => {
      isPointerDown = false;
    };

    mountEl.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // 7. Core 60fps Game Simulation Loop
    const tick = (now: number) => {
      g.animFrameId = requestAnimationFrame(tick);

      const rawDt = (now - g.lastTime) / 1000;
      const dt = Math.min(rawDt, 0.05); // Clamped delta
      g.lastTime = now;

      const timeSec = now * 0.001;

      // TITLE SCREEN ORBIT MODE
      if (g.state === 'title') {
        const orbitAngle = timeSec * 0.45;
        camera.position.x = Math.sin(orbitAngle) * 5.2;
        camera.position.z = Math.cos(orbitAngle) * 5.2;
        camera.position.y = 2.4 + Math.sin(timeSec * 1.2) * 0.4;
        camera.lookAt(droneGroup.position.x, droneGroup.position.y + 0.3, droneGroup.position.z);

        droneGroup.position.y = 1.2 + Math.sin(timeSec * 2) * 0.12;
        droneGroup.rotation.y = Math.sin(timeSec * 0.8) * 0.15;
        droneGroup.rotation.z = Math.sin(timeSec * 1.5) * 0.08;

        if (updateThrusters) updateThrusters(timeSec, 0.1);
        renderer.render(scene, camera);
        return;
      }

      // PAUSED MODE
      if (g.state === 'paused') {
        renderer.render(scene, camera);
        return;
      }

      // ACTIVE PLAYING MODE
      if (g.state === 'playing') {
        // Boost controls
        const isBoost = g.keys[' '] || g.keys['shift'];
        g.targetSpeed = isBoost ? 62 : 38;
        g.currentSpeed += (g.targetSpeed - g.currentSpeed) * 4 * dt;
        soundEngine.updateEnginePitch(g.currentSpeed / 62);

        // Movement input
        let steerX = 0;
        let steerY = 0;

        if (g.keys['a'] || g.keys['arrowleft']) steerX -= 1;
        if (g.keys['d'] || g.keys['arrowright']) steerX += 1;
        if (g.keys['w'] || g.keys['arrowup']) steerY += 1;
        if (g.keys['s'] || g.keys['arrowdown']) steerY -= 1;

        // Apply smooth acceleration
        const accel = 28;
        g.droneVel.x += steerX * accel * dt;
        g.droneVel.y += steerY * accel * dt;

        // Friction damping
        g.droneVel.x *= 0.91;
        g.droneVel.y *= 0.91;

        // Update positions
        g.dronePos.x += g.droneVel.x * dt;
        g.dronePos.y += g.droneVel.y * dt;
        g.dronePos.z -= g.currentSpeed * dt; // Moving forward down corridor

        // Bounds clamping
        g.dronePos.x = THREE.MathUtils.clamp(g.dronePos.x, -11, 11);
        g.dronePos.y = THREE.MathUtils.clamp(g.dronePos.y, 0.2, 5.5);

        // Aerodynamic Banking Roll (Roll into turn)
        const targetRoll = -g.droneVel.x * 0.06;
        g.droneRotZ += (targetRoll - g.droneRotZ) * 8 * dt;

        const targetPitch = g.droneVel.y * 0.04;

        // Apply to 3D Drone Mesh
        droneGroup.position.set(g.dronePos.x, g.dronePos.y, g.dronePos.z);
        droneGroup.rotation.z = g.droneRotZ;
        droneGroup.rotation.x = targetPitch;
        droneGroup.rotation.y = -g.droneVel.x * 0.02;

        // Animate thrusters
        if (updateThrusters) {
          updateThrusters(timeSec, g.currentSpeed / 62);
        }

        // Camera Follow (Smooth Third-Person Damped Chase Cam)
        const camDistance = isBoost ? 6.2 : 5.4;
        const camHeight = 2.4;
        const targetCamX = g.dronePos.x * 0.75;
        const targetCamY = g.dronePos.y + camHeight;
        const targetCamZ = g.dronePos.z + camDistance;

        // Exponential Damping
        camera.position.x += (targetCamX - camera.position.x) * (1 - Math.exp(-8 * dt));
        camera.position.y += (targetCamY - camera.position.y) * (1 - Math.exp(-8 * dt));
        camera.position.z += (targetCamZ - camera.position.z) * (1 - Math.exp(-8 * dt));

        // Camera Shake decay on collision
        if (g.cameraShake > 0) {
          camera.position.x += (Math.random() - 0.5) * g.cameraShake;
          camera.position.y += (Math.random() - 0.5) * g.cameraShake;
          g.cameraShake = Math.max(0, g.cameraShake - dt * 2.5);
        }

        camera.lookAt(g.dronePos.x * 0.3, g.dronePos.y + 0.6, g.dronePos.z - 8);

        // Dynamic FOV widening on speed boost
        const targetFov = isBoost ? 74 : 65;
        camera.fov += (targetFov - camera.fov) * 5 * dt;
        camera.updateProjectionMatrix();

        // Check Collisions with Obstacles
        for (const obs of g.obstacles) {
          if (!obs.passed) {
            const dz = Math.abs(g.dronePos.z - obs.z);
            if (dz < 1.4) {
              const dx = g.dronePos.x - obs.x;
              const dy = g.dronePos.y - obs.y;
              const dist2D = Math.sqrt(dx * dx + dy * dy);

              if (dist2D < obs.radius + 0.5) {
                // Collision Hit!
                obs.passed = true;
                g.health = Math.max(0, g.health - 22);
                g.combo = 1;
                g.cameraShake = 0.45;
                soundEngine.playHit();

                setHitWarning(`Warning: Caught by ${obs.label} (-22% Deliverability)`);
                setTimeout(() => setHitWarning(null), 2500);

                if (g.health <= 0) {
                  g.state = 'gameover';
                  setGameState('gameover');
                  soundEngine.stopEngineHum();
                  return;
                }
              }
            } else if (g.dronePos.z < obs.z - 2) {
              obs.passed = true;
            }
          }
        }

        // Check Collectibles
        for (const col of g.collectibles) {
          if (!col.collected) {
            // Idle rotation
            col.mesh.rotation.y += dt * 3;
            col.mesh.rotation.x += dt * 1.5;

            const dz = Math.abs(g.dronePos.z - col.z);
            if (dz < 1.6) {
              const dx = g.dronePos.x - col.x;
              const dy = g.dronePos.y - col.y;
              const dist2D = Math.sqrt(dx * dx + dy * dy);

              if (dist2D < col.radius + 0.6) {
                col.collected = true;
                col.mesh.visible = false;
                g.combo += 1;

                if (col.type === 'dkim_shield') {
                  g.health = Math.min(100, g.health + 12);
                  g.score += 250 * g.combo;
                  soundEngine.playCollect('shield');
                } else {
                  g.score += 100 * g.combo;
                  soundEngine.playCollect('click');
                }
              }
            }
          }
        }

        // Distance Remaining calculation
        const remainingDist = Math.max(0, Math.floor(580 + g.dronePos.z));

        // Victory Check (Reached Destination Portal at -580m)
        if (g.dronePos.z <= -578) {
          g.state = 'victory';
          setGameState('victory');
          soundEngine.stopEngineHum();
          soundEngine.playVictory();
          return;
        }

        // Update UI state throttle
        setDeliverabilityHealth(Math.round(g.health));
        setClicksScore(g.score);
        setDistanceRemaining(remainingDist);
        setCombo(g.combo);
        setSpeedMps(Math.round(g.currentSpeed));
      }

      renderer.render(scene, camera);
    };

    g.animFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(g.animFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      mountEl.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      soundEngine.stopEngineHum();
      renderer.dispose();
      if (mountEl && renderer.domElement) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, []);

  const startGame = () => {
    const g = gameRef.current;
    g.state = 'playing';
    g.health = 100;
    g.score = 0;
    g.combo = 1;
    g.dronePos = { x: 0, y: 1.2, z: 0 };
    g.droneVel = { x: 0, y: 0, z: 0 };
    g.currentSpeed = 38;
    g.cameraShake = 0;

    // Reset obstacles & collectibles
    g.obstacles.forEach((o) => (o.passed = false));
    g.collectibles.forEach((c) => {
      c.collected = false;
      c.mesh.visible = true;
    });

    setGameState('playing');
    setDeliverabilityHealth(100);
    setClicksScore(0);
    setDistanceRemaining(580);
    setCombo(1);

    soundEngine.startEngineHum();
  };

  const togglePause = () => {
    if (gameState === 'playing') {
      setGameState('paused');
      soundEngine.stopEngineHum();
    } else if (gameState === 'paused') {
      setGameState('playing');
      soundEngine.startEngineHum();
    }
  };

  const toggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white overflow-hidden select-none font-sans">
      
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={canvasMountRef} className="w-full h-full cursor-crosshair" />

      {/* TOP NAVIGATION / STATUS HUD (<15% Viewport Occlusion) */}
      <div className="absolute top-0 inset-x-0 p-4 sm:p-6 pointer-events-none flex items-start justify-between z-10">
        
        {/* Left: Brand & Return */}
        <div className="pointer-events-auto flex items-center space-x-3">
          <button
            onClick={() => {
              soundEngine.stopEngineHum();
              onReturnToStudio();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md text-xs font-semibold transition cursor-pointer shadow-lg"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Studio</span>
          </button>

          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px]">Deliverability Flight 3D</span>
            <span>•</span>
            <span className="truncate max-w-xs">{campaignTitle}</span>
          </div>
        </div>

        {/* Center: Live Telemetry Cluster (Playing Mode) */}
        {gameState === 'playing' && (
          <div className="pointer-events-auto flex items-center space-x-4 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-md">
            
            {/* Health / Deliverability Score */}
            <div className="flex items-center space-x-2">
              <Shield className={`h-4 w-4 ${deliverabilityHealth > 50 ? 'text-emerald-400' : 'text-rose-400'}`} />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Inbox Health</span>
                <span className={`text-base font-extrabold font-mono tabular-nums leading-none ${deliverabilityHealth > 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {deliverabilityHealth}%
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            {/* Distance to Inbox */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Inbox Target</span>
              <span className="text-base font-extrabold font-mono tabular-nums text-cyan-400 leading-none">
                {distanceRemaining}m
              </span>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            {/* Score / Conversion Clicks */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Clicks Harvested</span>
              <span className="text-base font-extrabold font-mono tabular-nums text-amber-400 leading-none">
                {clicksScore}
              </span>
            </div>

            {/* Combo Multiplier */}
            {combo > 1 && (
              <span className="px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold font-mono">
                {combo}x
              </span>
            )}
          </div>
        )}

        {/* Right: Audio & Pause Controls */}
        <div className="pointer-events-auto flex items-center space-x-2">
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-slate-500" /> : <Volume2 className="h-4 w-4 text-cyan-400" />}
          </button>

          {gameState === 'playing' && (
            <button
              onClick={togglePause}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition cursor-pointer"
              title="Pause Game (Esc)"
            >
              <Pause className="h-4 w-4" />
            </button>
          )}
        </div>

      </div>

      {/* HIT WARNING BANNER */}
      {hitWarning && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-rose-600/90 text-white font-bold text-xs px-4 py-1.5 rounded-full border border-rose-400 shadow-2xl animate-bounce pointer-events-none z-20">
          {hitWarning}
        </div>
      )}

      {/* BOTTOM CONTROLS HINT (<15% Viewport Occlusion) */}
      {gameState === 'playing' && (
        <div className="absolute bottom-4 inset-x-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-slate-950/70 border border-slate-800 px-4 py-1.5 rounded-full text-[11px] font-mono text-slate-400 flex items-center space-x-4">
            <span>A/D or ◄/► Steer</span>
            <span>•</span>
            <span>W/S or ▲/▼ Altitude</span>
            <span>•</span>
            <span className="text-cyan-400 font-bold">Space Boost</span>
            <span>•</span>
            <span>Esc Pause</span>
          </div>
        </div>
      )}

      {/* TITLE SCREEN OVERLAY */}
      {gameState === 'title' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/40 backdrop-blur-[2px] z-20">
          <div className="max-w-md w-full text-center space-y-6">
            
            {/* Bespoke SVG Title Lockup */}
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wider uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                <span>3D Deliverability Flight Engine</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                MATRIX RUN
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                Pilot the Email Dispatch Drone through the corporate spam gauntlet. Dodge trigger firewalls, collect DKIM shields, and deliver your campaign to the Primary Inbox!
              </p>
            </div>

            {/* Launch CTA */}
            <div className="space-y-3">
              <button
                onClick={startGame}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base tracking-wide shadow-2xl shadow-cyan-500/30 transition transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Launch Dispatch Drone (Space / Click)
              </button>

              <div className="text-[11px] font-mono text-slate-400">
                WASD / Arrow Keys to Bank · Space Turbo · Touch / Mouse Drag Supported
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PAUSE OVERLAY */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-md z-20">
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 max-w-sm w-full">
            <h2 className="text-2xl font-bold text-white">Flight Suspended</h2>
            <p className="text-xs text-slate-400">Drone holding station in server corridor</p>
            <div className="space-y-2 pt-2">
              <button
                onClick={togglePause}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
              >
                Resume Flight
              </button>
              <button
                onClick={startGame}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition cursor-pointer"
              >
                Restart Run
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAME OVER (QUARANTINE) MODAL */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/85 backdrop-blur-md z-20 p-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-rose-500/40 text-center space-y-5 shadow-2xl">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 mx-auto flex items-center justify-center">
              <Shield className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">Quarantine Intercepted</h2>
              <p className="text-xs text-slate-400 mt-1">
                Your email packet was quarantined by aggressive spam filter algorithms.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-3 text-left">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Final Clicks</span>
                <span className="text-base font-extrabold font-mono text-amber-400">{clicksScore}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Distance Reached</span>
                <span className="text-base font-extrabold font-mono text-cyan-400">{580 - distanceRemaining}m</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={startGame}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-bold text-xs transition cursor-pointer shadow-lg"
              >
                Try Again
              </button>
              <button
                onClick={() => onReturnToStudio()}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Studio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VICTORY (PRIMARY INBOX DELIVERED) MODAL */}
      {gameState === 'victory' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/85 backdrop-blur-md z-20 p-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 text-center space-y-5 shadow-2xl">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Award className="h-7 w-7" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">100% Primary Inbox</span>
              <h2 className="text-2xl font-black text-white">Campaign Delivered!</h2>
              <p className="text-xs text-slate-400 mt-1">
                Your email packet traversed the server matrix without quarantine.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-3 gap-2 text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Inbox Health</span>
                <span className="text-sm font-extrabold text-emerald-400">{deliverabilityHealth}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Clicks</span>
                <span className="text-sm font-extrabold text-amber-400">{clicksScore}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Max Combo</span>
                <span className="text-sm font-extrabold text-pink-400">{combo}x</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs">
              <strong>Unlocked Campaign Bonus:</strong> +15% Projected Open Rate boost applied to your active campaign!
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => onReturnToStudio('Primary Inbox Delivery Certification (+15% Open Boost)')}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-emerald-600/25"
              >
                Apply Deliverability Boost & Return
              </button>
              <button
                onClick={startGame}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Replay
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
