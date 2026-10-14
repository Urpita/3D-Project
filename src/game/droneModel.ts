import * as THREE from 'three';

/**
 * Creates an 8-part composite procedural Email Dispatch Drone
 * Adheres strictly to the Three.js skill guidelines:
 * - 3-12 distinct parts across primary silhouette, secondary read, and accent details
 * - Varied roughness and metalness across adjacent parts
 * - Emissive holographic envelope insignia
 * - Radial contact shadow plane at bottom-center
 */
export function createEmailDroneGroup(): {
  droneGroup: THREE.Group;
  updateThrusters: (time: number, speedRatio: number) => void;
  exhaustPlumes: THREE.Mesh[];
} {
  const droneGroup = new THREE.Group();
  droneGroup.name = 'EmailDispatchDrone';

  // --- Materials with varied PBR properties ---
  // 1. Brushed Cyber Armor Hull (Metalness 0.85, Roughness 0.25)
  const hullMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.85,
    roughness: 0.25,
  });

  // 2. High-Tech Secondary Trim (Matte Slate, Metalness 0.3, Roughness 0.6)
  const trimMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.3,
    roughness: 0.6,
  });

  // 3. Optical Glass Cockpit Visor (High reflectivity, Clearcoat)
  const visorMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x06b6d4,
    metalness: 0.95,
    roughness: 0.08,
    transmission: 0.4,
    transparent: true,
    opacity: 0.85,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });

  // 4. Emissive Envelope Hologram Badge (Glowing Deliverability Insignia)
  const badgeMaterial = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    emissive: 0x818cf8,
    emissiveIntensity: 1.5,
    roughness: 0.2,
  });

  // 5. Thruster Exhaust Nozzle (Dark Titanium, Roughness 0.4)
  const nozzleMaterial = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.9,
    roughness: 0.35,
  });

  // 6. Thruster Jet Plume (Cyan Glow Emissive)
  const plumeMaterial = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.85,
  });

  // --- PART 1: Main Delta Wing Fuselage (Primary Silhouette) ---
  const fuselageShape = new THREE.Shape();
  fuselageShape.moveTo(0, 1.4); // Nose
  fuselageShape.lineTo(0.9, -0.8); // Starboard wingtip
  fuselageShape.lineTo(0.4, -0.6); // Inner wing joint
  fuselageShape.lineTo(-0.4, -0.6); // Inner port joint
  fuselageShape.lineTo(-0.9, -0.8); // Port wingtip
  fuselageShape.closePath();

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.28,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.08,
    bevelThickness: 0.08,
  };

  const fuselageGeo = new THREE.ExtrudeGeometry(fuselageShape, extrudeSettings);
  fuselageGeo.rotateX(-Math.PI / 2);
  fuselageGeo.center();
  const fuselageMesh = new THREE.Mesh(fuselageGeo, hullMaterial);
  fuselageMesh.castShadow = true;
  fuselageMesh.receiveShadow = true;
  droneGroup.add(fuselageMesh);

  // --- PART 2: Upper Cockpit Canopy / Sensor Visor (Secondary Read) ---
  const visorGeo = new THREE.SphereGeometry(0.32, 16, 12);
  visorGeo.scale(0.8, 0.45, 1.6);
  const visorMesh = new THREE.Mesh(visorGeo, visorMaterial);
  visorMesh.position.set(0, 0.2, 0.15);
  visorMesh.castShadow = true;
  droneGroup.add(visorMesh);

  // --- PART 3: Holographic Envelope Crest (Deliverability Icon) ---
  // Create an email envelope emblem on the dorsal spine
  const envelopeGroup = new THREE.Group();
  const envBodyGeo = new THREE.BoxGeometry(0.45, 0.04, 0.3);
  const envBodyMesh = new THREE.Mesh(envBodyGeo, badgeMaterial);
  envelopeGroup.add(envBodyMesh);

  // Envelope flap triangular accent
  const flapShape = new THREE.Shape();
  flapShape.moveTo(-0.2, 0.14);
  flapShape.lineTo(0.2, 0.14);
  flapShape.lineTo(0, 0);
  flapShape.closePath();
  const flapGeo = new THREE.ShapeGeometry(flapShape);
  flapGeo.rotateX(-Math.PI / 2);
  const flapMesh = new THREE.Mesh(
    flapGeo,
    new THREE.MeshBasicMaterial({ color: 0xc7d2fe, side: THREE.DoubleSide })
  );
  flapMesh.position.set(0, 0.025, 0);
  envelopeGroup.add(flapMesh);

  envelopeGroup.position.set(0, 0.28, -0.15);
  droneGroup.add(envelopeGroup);

  // --- PART 4 & 5: Port & Starboard Ion Thruster Nacelles ---
  const nacelleGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.8, 12);
  nacelleGeo.rotateX(Math.PI / 2);

  const portNacelle = new THREE.Mesh(nacelleGeo, trimMaterial);
  portNacelle.position.set(-0.48, 0.04, -0.4);
  portNacelle.castShadow = true;
  droneGroup.add(portNacelle);

  const stbdNacelle = new THREE.Mesh(nacelleGeo, trimMaterial);
  stbdNacelle.position.set(0.48, 0.04, -0.4);
  stbdNacelle.castShadow = true;
  droneGroup.add(stbdNacelle);

  // --- PART 6 & 7: Exhaust Nozzle Rings ---
  const nozzleGeo = new THREE.CylinderGeometry(0.13, 0.14, 0.12, 12);
  nozzleGeo.rotateX(Math.PI / 2);

  const portNozzle = new THREE.Mesh(nozzleGeo, nozzleMaterial);
  portNozzle.position.set(-0.48, 0.04, -0.82);
  droneGroup.add(portNozzle);

  const stbdNozzle = new THREE.Mesh(nozzleGeo, nozzleMaterial);
  stbdNozzle.position.set(0.48, 0.04, -0.82);
  droneGroup.add(stbdNozzle);

  // --- PART 8: Twin Canted Stabilizer Rudders (Angled Fins) ---
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(0.1, 0.45);
  finShape.lineTo(0.35, 0.38);
  finShape.lineTo(0.25, 0);
  finShape.closePath();

  const finGeo = new THREE.ShapeGeometry(finShape);

  // Port Fin
  const portFin = new THREE.Mesh(finGeo, hullMaterial);
  portFin.position.set(-0.52, 0.1, -0.45);
  portFin.rotation.y = Math.PI / 2;
  portFin.rotation.z = 0.25; // Canted outward
  portFin.castShadow = true;
  droneGroup.add(portFin);

  // Starboard Fin
  const stbdFin = new THREE.Mesh(finGeo, hullMaterial);
  stbdFin.position.set(0.52, 0.1, -0.45);
  stbdFin.rotation.y = Math.PI / 2;
  stbdFin.rotation.z = -0.25; // Canted outward
  stbdFin.castShadow = true;
  droneGroup.add(stbdFin);

  // --- PART 9: Thruster Jet Plumes (Dynamic Animated) ---
  const plumeGeo = new THREE.ConeGeometry(0.11, 0.6, 8);
  plumeGeo.rotateX(-Math.PI / 2);

  const portPlume = new THREE.Mesh(plumeGeo, plumeMaterial);
  portPlume.position.set(-0.48, 0.04, -1.15);
  droneGroup.add(portPlume);

  const stbdPlume = new THREE.Mesh(plumeGeo, plumeMaterial);
  stbdPlume.position.set(0.48, 0.04, -1.15);
  droneGroup.add(stbdPlume);

  const exhaustPlumes = [portPlume, stbdPlume];

  // --- PART 10: Soft Radial Contact Shadow Plane (Grounding) ---
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const ctx = shadowCanvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
  });
  const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
  contactShadow.position.y = -0.7; // Under the drone
  droneGroup.add(contactShadow);

  // Scaled for comfortable flight bounds
  droneGroup.scale.set(1.1, 1.1, 1.1);

  // Animation update loop for thrusters
  const updateThrusters = (time: number, speedRatio: number) => {
    const flicker = 0.9 + Math.sin(time * 35) * 0.15 + speedRatio * 0.4;
    portPlume.scale.set(flicker, flicker, flicker * (1.2 + speedRatio));
    stbdPlume.scale.set(flicker, flicker, flicker * (1.2 + speedRatio));
    contactShadow.scale.set(1 + speedRatio * 0.1, 1, 1 + speedRatio * 0.1);
  };

  return { droneGroup, updateThrusters, exhaustPlumes };
}
