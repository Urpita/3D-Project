import * as THREE from 'three';

export interface GameObstacle {
  mesh: THREE.Group;
  type: 'spam_firewall' | 'blacklist_beam' | 'captcha_barrier';
  z: number;
  x: number;
  y: number;
  radius: number;
  label: string;
  passed: boolean;
}

export interface GameCollectible {
  mesh: THREE.Group;
  type: 'dkim_shield' | 'click_token' | 'vip_ring';
  z: number;
  x: number;
  y: number;
  radius: number;
  collected: boolean;
}

export function createMatrixWorld(scene: THREE.Scene) {
  // 1. Procedural Grid Floor with glowing neon lines
  const gridHelper = new THREE.GridHelper(300, 60, 0x06b6d4, 0x1e1b4b);
  gridHelper.position.y = -1.2;
  scene.add(gridHelper);

  // Reflective Floor Runway Mesh
  const floorGeo = new THREE.PlaneGeometry(36, 600);
  floorGeo.rotateX(-Math.PI / 2);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    metalness: 0.9,
    roughness: 0.2,
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.position.set(0, -1.25, -200);
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  // 2. Neon Guideway Rails on Left and Right borders
  const railGeo = new THREE.BoxGeometry(0.3, 0.3, 600);
  const railMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });

  const leftRail = new THREE.Mesh(railGeo, railMat);
  leftRail.position.set(-14, -1.05, -200);
  scene.add(leftRail);

  const rightRail = new THREE.Mesh(railGeo, railMat);
  rightRail.position.set(14, -1.05, -200);
  scene.add(rightRail);

  // 3. Instanced Server Rack Columns lining the corridor
  const rackCount = 80;
  const rackGeo = new THREE.BoxGeometry(2.2, 10, 3.5);
  const rackMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.8,
    roughness: 0.3,
  });

  const instancedRacks = new THREE.InstancedMesh(rackGeo, rackMat, rackCount);
  instancedRacks.castShadow = true;
  instancedRacks.receiveShadow = true;

  const dummy = new THREE.Object3D();
  for (let i = 0; i < rackCount / 2; i++) {
    const zPos = -i * 14 - 10;
    // Left column
    dummy.position.set(-16 - Math.random() * 2, 4, zPos);
    dummy.scale.set(1, 0.8 + Math.random() * 0.4, 1);
    dummy.updateMatrix();
    instancedRacks.setMatrixAt(i * 2, dummy.matrix);

    // Right column
    dummy.position.set(16 + Math.random() * 2, 4, zPos);
    dummy.scale.set(1, 0.8 + Math.random() * 0.4, 1);
    dummy.updateMatrix();
    instancedRacks.setMatrixAt(i * 2 + 1, dummy.matrix);
  }
  instancedRacks.instanceMatrix.needsUpdate = true;
  scene.add(instancedRacks);

  // 4. Background Server Neon LED Data Streams (Floating particle dust)
  const particleCount = 200;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const cyanColor = new THREE.Color(0x06b6d4);
  const magentaColor = new THREE.Color(0xec4899);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 32;
    positions[i * 3 + 1] = Math.random() * 12 - 0.5;
    positions[i * 3 + 2] = -Math.random() * 550;

    const chosenColor = Math.random() > 0.5 ? cyanColor : magentaColor;
    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
  });
  const dataParticles = new THREE.Points(particleGeo, particleMat);
  scene.add(dataParticles);

  return { gridHelper, floorMesh, instancedRacks, dataParticles };
}

/**
 * Spawns procedural Spam Filter Gates and Collectibles along the flight path
 */
export function generateObstaclesAndCollectibles(scene: THREE.Scene): {
  obstacles: GameObstacle[];
  collectibles: GameCollectible[];
} {
  const obstacles: GameObstacle[] = [];
  const collectibles: GameCollectible[] = [];

  const SPAM_LABELS = [
    'ALL-CAPS FILTER',
    'TRIGGER KEYWORD FIREWALL',
    'SPOOFED DOMAIN BLOCKER',
    'REPUTATION QUARANTINE',
    'HONEYPOT SPAM TRAP',
  ];

  // Spawn obstacles along Z axis from -40 to -520
  for (let z = -40; z >= -520; z -= 38) {
    const obstacleGroup = new THREE.Group();
    const type = z % 76 === 0 ? 'blacklist_beam' : 'spam_firewall';

    const laneX = (Math.random() - 0.5) * 16;
    const laneY = 0.5 + Math.random() * 2.5;

    // Glowing Red/Amber Barrier Frame
    const frameGeo = new THREE.TorusGeometry(2.0, 0.12, 8, 24);
    const frameMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    obstacleGroup.add(frameMesh);

    // Warning Barrier Grid Inside
    const barGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.8, 8);
    const barMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    for (let b = -1.2; b <= 1.2; b += 0.8) {
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.x = b;
      obstacleGroup.add(bar);
    }

    obstacleGroup.position.set(laneX, laneY, z);
    scene.add(obstacleGroup);

    obstacles.push({
      mesh: obstacleGroup,
      type,
      z,
      x: laneX,
      y: laneY,
      radius: 1.8,
      label: SPAM_LABELS[Math.floor(Math.random() * SPAM_LABELS.length)],
      passed: false,
    });

    // Also spawn a safe collectible ring or token nearby
    const collectibleGroup = new THREE.Group();
    const isShield = Math.random() > 0.65;
    const collType = isShield ? 'dkim_shield' : 'click_token';

    if (isShield) {
      // DKIM Shield / Golden Ring
      const ringGeo = new THREE.TorusGeometry(1.2, 0.1, 12, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 1.2,
        roughness: 0.1,
        metalness: 0.9,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      collectibleGroup.add(ringMesh);
    } else {
      // High-Engagement Click Gem
      const gemGeo = new THREE.OctahedronGeometry(0.55);
      const gemMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.8,
      });
      const gemMesh = new THREE.Mesh(gemGeo, gemMat);
      collectibleGroup.add(gemMesh);
    }

    // Place collectible in clear lane away from obstacle
    const safeX = laneX > 0 ? laneX - 6 : laneX + 6;
    const safeY = 0.8 + Math.random() * 2.2;
    const safeZ = z + 16;

    collectibleGroup.position.set(safeX, safeY, safeZ);
    scene.add(collectibleGroup);

    collectibles.push({
      mesh: collectibleGroup,
      type: collType,
      z: safeZ,
      x: safeX,
      y: safeY,
      radius: 1.4,
      collected: false,
    });
  }

  // Destination Inbox Portal at Z = -580 (Victory Gate)
  const portalGroup = new THREE.Group();
  const portalRingGeo = new THREE.TorusGeometry(5.0, 0.4, 16, 48);
  const portalRingMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  const portalMesh = new THREE.Mesh(portalRingGeo, portalRingMat);
  portalGroup.add(portalMesh);
  portalGroup.position.set(0, 3, -580);
  scene.add(portalGroup);

  return { obstacles, collectibles };
}
