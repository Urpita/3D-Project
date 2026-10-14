# Deliverability Flight 3D: Cyberpunk Matrix Run

An immersive Three.js 3D flight game seamlessly integrated into CampaignForge AI, where players pilot an email packet drone through a cyberpunk neon server matrix, dodging spam filter firewalls and collecting clean deliverability nodes to achieve 100% inbox placement.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during Phase 1 interactive clarification:

- **Confirmed Integration & Theme**: Deliverability flight game where players pilot an email packet dodging spam filters, quarantine firewalls, and reputation blacklists.
- **Confirmed Camera & Flight Physics**: Dynamic third-person 3D chase camera with aerodynamic banking, roll tilt, and speed-responsive field-of-view (FOV).
- **Confirmed Aesthetic & Atmosphere**: Cyberpunk neon server matrix with deep obsidian infrastructure, glowing electric cyan and magenta data streams, volumetric server racks, and horizon fog falloff.
- **Game Shell Architecture**: Full-viewport Game Shell (`Title Screen` with live cinematic orbit -> `Active Flight 60fps Loop` -> `Deliverability Report / Victory / Quarantine Over` modal) with 1-click seamless toggle back to the Campaign Studio.

---

## 1. Overview & Core Concept

- **What It Does**: Gamifies email deliverability by placing marketers and players in the cockpit of an "Email Dispatch Drone" navigating the corporate spam gauntlet. Dodge aggressive Spam Traps, CAPTCHA hurdles, and Keyword Firewalls while collecting High-Reputation Whitelist Rings, SPF/DKIM Tokens, and Conversion Clicks.
- **Game Goal**: Reach the Destination Primary Inbox with maximum deliverability health score (0–100%) and highest conversion clicks.
- **Campaign Studio Synergy**: Winning or completing runs unlocks deliverability perks and bonus email subject lines in CampaignForge AI.
- **Target Audience**: Email marketers, founders, copywriters, and casual arcade players who want an engaging, tactile experience of email deliverability physics.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Launch from Studio**: Player clicks the `"Deliverability Flight 3D"` launcher button in the top navigation or Deliverability Guard panel.
2. **Title Screen**: Fullscreen cyberpunk server environment with an atmospheric camera pan around the 3D Email Drone, high-score records, sound toggle, and "Press Space / Click Launch" prompt.
3. **Flight Gameplay (60fps)**:
   - **Controls**: `A/D` or `Left/Right Arrows` (horizontal banking), `W/S` or `Up/Down` (pitch altitude), `Space` (turbo speed burst), `P` / `Esc` (pause). Touch/mouse drag controls for mobile/trackpad.
   - **Hazards**: Red/Orange glowing Spam Filter Gates ("ALL-CAPS Firewall", "Banned Keywords Barrier", "Blacklist Radar Beams").
   - **Collectibles**: Cyan DKIM/SPF Shield Nodes, Golden VIP Inboxes, and Emerald High-Engagement Clicks.
   - **HUD**: Low-occlusion perimeter telemetry: Deliverability Health Gauge (`tabular-nums`), Distance to Inbox, Clicks Harvested, Speedometer, and Combo Multiplier.
4. **Game Over / Victory Debrief**:
   - Primary Inbox Delivered: Victory screen with Deliverability Rating (e.g. 98.4% Inbox Placement), final score, and actionable tips that sync directly to the email campaign.
   - Quarantine Caught: Crash sequence with soft camera shake, detailed post-mortem ("Caught by Subject Line Spam Trap"), and instant "Retry" or "Return to Campaign Studio".

### Visual Identity & Theme
- **Dominant Palette**: Deep server obsidian `#090D16`, deep indigo `#1E1B4B`, electric cyan `#06B6D4`, neon magenta `#EC4899`, and deliverability emerald `#10B981`.
- **Lighting Rig**: Studio PBR with warm key directional light, cool sky hemisphere fill, `RoomEnvironment` reflections on brushed metallic drone parts, and distance exponential fog matching the deep server horizon.
- **Composite Procedural 3D Models**:
   - **Email Dispatch Drone (`THREE.Group` 8 parts)**: Aerodynamic delta fuselage, dual ion thruster nacelles, glowing holographic envelope crest, cockpit visor, twin stabilizer rudders, and particle exhaust trail.
   - **Server Matrix Corridor**: Procedural server racks with blinking LED arrays (`InstancedMesh`), glowing fiber optic floor grid, and floating holographic gate rings.
- **Audio Synthesizer**: Zero-dependency Web Audio API procedural sound engine generating engine hums, collect chimes, hit thuds, and victory fanfares.

---

## 3. Key Product Decisions & Trade-Offs

- **Three.js Standalone Canvas Container**: Mounts in an isolated ref container outside React re-renders to guarantee rock-solid 60fps performance without garbage collection spikes.
- **Zero External 404 Dependencies**: 100% procedural canvas textures, geometry extrusions, and Web Audio oscillators. No external `.glb` or audio files that can fail to load.
- **Keyboard + Touch/Mouse Dual Input**: Supports full desktop WASD/Arrow navigation plus responsive pointer tracking on mobile/tablet viewports.
- **Non-Destructive Campaign Integration**: The game runs as an overlay state that preserves all currently edited email text, visuals, and chatbot conversation history in the studio.

---

## 4. Technical Architecture & Data Strategy

### System Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CampaignForge Application                       │
├──────────────────────────────────┬─────────────────────────────────────┤
│      Studio Workbench View       │     Deliverability Flight 3D        │
│  - Email Subject Lab             │  ┌────────────────────────────────┐ │
│  - 1K/2K/4K Hero Visuals         │  │       GameShell Container      │ │
│  - Live HTML Preview (Desktop/   │  │   (Title -> Play -> Victory)   │ │
│    Mobile/Inbox)                 │  └───────────────┬────────────────┘ │
│  - Multi-Turn Gemini Copilot     │                  │                  │
└──────────────────────────────────┴──────────────────┼──────────────────┘
                                                      │
                       ┌──────────────────────────────┴────────────────────────────┐
                       ▼                                                           ▼
         ┌───────────────────────────────┐                       ┌───────────────────────────────────┐
         │     Three.js 3D Engine        │                       │    Procedural Audio & State       │
         │  - WebGLRenderer (r160+)      │                       │  - Web Audio Oscillator Synthesizer│
         │  - RoomEnvironment & PMREM    │                       │  - Score, Health, Combo State     │
         │  - 8-Part Procedural Drone    │                       │  - Keyboard & Pointer Listeners   │
         │  - Instanced Server Columns   │                       │  - Return-to-Studio Sync          │
         │  - Damped 3rd-Person Camera   │                       │                                   │
         └───────────────────────────────┘                       └───────────────────────────────────┘
```

### Data Model & State
```ts
interface GameState {
  mode: 'title' | 'playing' | 'paused' | 'gameover' | 'victory';
  health: number; // 0 to 100%
  score: number;
  distanceRemaining: number; // 1000m to 0m
  speed: number;
  combo: number;
  unlockedPerk?: string;
}

interface Obstacle {
  position: THREE.Vector3;
  type: 'spam_gate' | 'blacklist_beam' | 'filter_barrier';
  boundingRadius: number;
  passed: boolean;
}

interface Collectible {
  position: THREE.Vector3;
  type: 'dkim_shield' | 'click_token' | 'reputation_star';
  boundingRadius: number;
  collected: boolean;
}
```
