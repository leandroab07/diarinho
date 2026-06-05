import type { BearKind } from "@/components/bears";
import { BEAR_WEIGHT } from "@/components/bears";

/**
 * Mini-simulador 2D pra máquina de pelúcia.
 *
 * Tudo em coordenadas locais da máquina: X em [0, 100] (% da largura),
 * Y em [0, 100] (% da altura). O componente faz o mapping pra pixels.
 *
 * Lei de cada tick:
 * - Aplica gravidade aos ursinhos NÃO presos (vy += g*dt).
 * - Aplica atrito (vx/vy decay).
 * - Resolve colisões circulares entre ursinhos (separação + impulso elástico
 *   leve com fator de restituição baixo, tipo pelúcia mesmo).
 * - Bate em paredes (lateral + chão) com perda de energia.
 * - Garra: target X seguido com inércia → balanço pendular proporcional
 *   à velocidade lateral aplicada. Subida/descida em Y conforme estado.
 * - Ursinho preso: posição segue a base da garra. A cada frame, checa
 *   chance de escapar (peso > grip, balanço grande, ou aleatório).
 */

export type Phase =
  | "idle"
  | "descending"
  | "closing"
  | "ascending"
  | "delivering"
  | "releasing";

export type Body = {
  id: string;
  kind: BearKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;        // raio em % (escala da máquina)
  mass: number;     // gramas
  angle: number;    // rotação visual em rad
  angularVel: number;
};

export type Claw = {
  targetX: number;     // alvo do user (0-100)
  currentX: number;    // posição real (com lag)
  swingAngle: number;  // ângulo pendular em rad
  swingVel: number;
  y: number;           // 0 (topo do trilho) - 100 (chão)
  state: Phase;
  gripping: Body | null;
  gripStrength: number; // gramas máx que ela aguenta com folga
};

export type World = {
  bodies: Body[];
  claw: Claw;
  /** quando state passa pra idle e ursinho foi entregue, aciona callback */
  onDelivered?: (b: Body) => void;
  onMissed?: (reason: "no-target" | "slipped" | "off-mark") => void;
};

export const PHYSICS_CONSTANTS = {
  gravity: 280,           // %/s² (mundo em coordenadas %)
  airDrag: 0.985,
  bearRestitution: 0.18,  // pelúcia não quica muito
  wallRestitution: 0.22,
  friction: 0.88,
  clawSpring: 14,         // mola que puxa pra target X
  clawDamping: 0.82,      // amortecimento do balanço
  clawSwingFromMove: 0.6, // quanto o movimento lateral vira swing
  descendSpeed: 32,       // %/s
  ascendSpeed: 28,        // %/s
  deliverSpeed: 18,
  maxSwingAngle: 0.45,    // rad ≈ 26°
  baseGripStrength: 95,   // gramas — peso médio
  floor: 90,              // y do chão
  ceiling: 8,             // y do trilho da garra
  pileTop: 50,            // onde começa a pilha (pra empilhar)
  prizeX: 8,              // local de entrega
};

export function createBody(id: string, kind: BearKind, x: number, y: number): Body {
  const mass = BEAR_WEIGHT[kind];
  // Raio proporcional à massa^(1/3) com base 6%
  const r = 5 + Math.pow(mass / 60, 1 / 3) * 2.5;
  return {
    id,
    kind,
    x,
    y,
    vx: 0,
    vy: 0,
    r,
    mass,
    angle: ((Math.random() - 0.5) * Math.PI) / 6,
    angularVel: 0,
  };
}

export function createInitialPile(count: number): Body[] {
  const KINDS: BearKind[] = ["honey", "cream", "rose", "lavender", "sage", "skyblue"];
  const out: Body[] = [];
  for (let i = 0; i < count; i++) {
    const kind = KINDS[Math.floor(Math.random() * KINDS.length)];
    const x = 12 + Math.random() * 76;
    const y = 60 + Math.random() * 25;
    const b = createBody(`p${i}-${Math.random().toString(36).slice(2, 7)}`, kind, x, y);
    b.vy = Math.random() * 8;
    out.push(b);
  }
  return out;
}

/** Step da simulação, modifica `world` in-place. */
export function step(world: World, dtSec: number) {
  const C = PHYSICS_CONSTANTS;
  const dt = Math.min(dtSec, 1 / 30); // clamp pra evitar tunneling em frame drop
  const { bodies, claw } = world;

  // ── 1. CLAW DYNAMICS ─────────────────────────────────────────────
  // X target → swing pendular
  const prevX = claw.currentX;
  const dx = claw.targetX - claw.currentX;
  // velocidade que aplica swing
  const xVel = dx * C.clawSpring * dt;
  claw.currentX += dx * Math.min(1, 4 * dt);

  // swing: pêndulo. A velocidade horizontal "puxa" o ângulo na direção
  // oposta (inércia). E sempre tem força restauradora pra zero.
  const lateralMove = claw.currentX - prevX;
  claw.swingVel += -lateralMove * C.clawSwingFromMove;
  claw.swingVel -= claw.swingAngle * 6 * dt; // restauradora
  claw.swingVel *= C.clawDamping;             // amortecimento
  claw.swingAngle += claw.swingVel * dt;
  // clamp safety
  if (Math.abs(claw.swingAngle) > 1.2) {
    claw.swingAngle = Math.sign(claw.swingAngle) * 1.2;
    claw.swingVel *= 0.5;
  }

  // Y conforme estado
  switch (claw.state) {
    case "descending": {
      claw.y += C.descendSpeed * dt;
      // tentar pegar quando chega no fundo OU bate em algum urso
      const lowEdge = claw.y + 2;
      // procura urso na zona horizontal da garra
      const reachX = clawWorldX(claw);
      const candidate = bodies
        .filter((b) => Math.abs(b.x - reachX) < b.r + 3 && b.y > lowEdge - 8)
        .sort((a, b) => Math.abs(a.x - reachX) - Math.abs(b.x - reachX))[0];

      if (claw.y >= C.floor - 4 || (candidate && lowEdge >= candidate.y - candidate.r)) {
        claw.state = "closing";
        // tentar agarrar: precisa estar à vista
        if (candidate) {
          const xOffset = Math.abs(candidate.x - reachX);
          // ângulo precisa estar relativamente parado
          const tooSwingy = Math.abs(claw.swingAngle) > C.maxSwingAngle;
          const offMark = xOffset > candidate.r + 1;
          if (!tooSwingy && !offMark) {
            claw.gripping = candidate;
            candidate.vx = 0;
            candidate.vy = 0;
          } else if (offMark) {
            // empurra o urso pro lado
            const dir = candidate.x - reachX > 0 ? 1 : -1;
            candidate.vx = dir * 40;
            candidate.vy = -20;
          }
        }
      }
      break;
    }
    case "closing": {
      // pausa rápida (handled by component via timeout); aqui não mexe Y
      break;
    }
    case "ascending": {
      claw.y -= C.ascendSpeed * dt;
      if (claw.gripping) {
        // chance de escapar: peso vs grip + balanço
        const overweight = Math.max(0, claw.gripping.mass - claw.gripStrength);
        const swingFactor = Math.abs(claw.swingAngle) / C.maxSwingAngle;
        // chance por segundo de escapar
        const slipPerSec = overweight * 0.012 + swingFactor * 0.5 + 0.05;
        if (Math.random() < slipPerSec * dt) {
          // SLIP!
          const slipped = claw.gripping;
          slipped.vy = 40 + Math.random() * 40;
          slipped.vx = (Math.random() - 0.5) * 30;
          claw.gripping = null;
          world.onMissed?.("slipped");
        }
      }
      if (claw.y <= C.ceiling) {
        claw.y = C.ceiling;
        if (claw.gripping) {
          claw.state = "delivering";
        } else {
          claw.state = "idle";
          world.onMissed?.("no-target");
        }
      }
      break;
    }
    case "delivering": {
      const target = C.prizeX;
      const dxd = target - claw.targetX;
      claw.targetX += Math.sign(dxd) * Math.min(Math.abs(dxd), C.deliverSpeed * dt);
      if (Math.abs(claw.currentX - target) < 1.5) {
        if (claw.gripping) {
          const b = claw.gripping;
          world.onDelivered?.(b);
        }
        claw.gripping = null;
        claw.state = "idle";
      }
      break;
    }
    case "idle":
    case "releasing":
    default:
      break;
  }
  claw.y = Math.max(C.ceiling, Math.min(C.floor, claw.y));

  // ── 2. BODY DYNAMICS ─────────────────────────────────────────────
  for (const b of bodies) {
    if (claw.gripping?.id === b.id) {
      const cx = clawWorldX(claw);
      b.x = cx;
      b.y = claw.y + 6 + b.r;
      b.angle = claw.swingAngle;
      b.vx = 0;
      b.vy = 0;
      continue;
    }
    b.vy += C.gravity * dt;
    b.vx *= C.airDrag;
    b.vy *= C.airDrag;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.angle += b.angularVel * dt;
    b.angularVel *= 0.94;
  }

  // ── 3. BODY-BODY COLLISIONS ───────────────────────────────────────
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i];
      const b = bodies[j];
      if (claw.gripping?.id === a.id || claw.gripping?.id === b.id) continue;
      const ddx = b.x - a.x;
      const ddy = b.y - a.y;
      const dist2 = ddx * ddx + ddy * ddy;
      const minDist = a.r + b.r;
      if (dist2 < minDist * minDist && dist2 > 0.0001) {
        const dist = Math.sqrt(dist2);
        const nx = ddx / dist;
        const ny = ddy / dist;
        const overlap = minDist - dist;
        // separa proporcional à massa do oposto
        const totalMass = a.mass + b.mass;
        const aMove = (b.mass / totalMass) * overlap;
        const bMove = (a.mass / totalMass) * overlap;
        a.x -= nx * aMove;
        a.y -= ny * aMove;
        b.x += nx * bMove;
        b.y += ny * bMove;
        // impulso elástico
        const dvx = b.vx - a.vx;
        const dvy = b.vy - a.vy;
        const speedAlongNormal = dvx * nx + dvy * ny;
        if (speedAlongNormal < 0) {
          const e = C.bearRestitution;
          const jImp = -(1 + e) * speedAlongNormal / (1 / a.mass + 1 / b.mass);
          const ix = jImp * nx;
          const iy = jImp * ny;
          a.vx -= ix / a.mass;
          a.vy -= iy / a.mass;
          b.vx += ix / b.mass;
          b.vy += iy / b.mass;
          // angular nudge
          a.angularVel += (Math.random() - 0.5) * 0.2;
          b.angularVel += (Math.random() - 0.5) * 0.2;
        }
      }
    }
  }

  // ── 4. WALLS / FLOOR ─────────────────────────────────────────────
  for (const b of bodies) {
    if (claw.gripping?.id === b.id) continue;
    if (b.x - b.r < 1) {
      b.x = 1 + b.r;
      b.vx = -b.vx * C.wallRestitution;
    }
    if (b.x + b.r > 99) {
      b.x = 99 - b.r;
      b.vx = -b.vx * C.wallRestitution;
    }
    if (b.y + b.r > C.floor) {
      b.y = C.floor - b.r;
      if (Math.abs(b.vy) < 4) {
        b.vy = 0;
      } else {
        b.vy = -b.vy * C.wallRestitution;
      }
      b.vx *= C.friction;
      b.angularVel *= 0.7;
    }
  }
}

export function clawWorldX(claw: Claw): number {
  // base da garra com swing: o cabo de comprimento dependente de Y move o tip
  const cableLen = (claw.y - PHYSICS_CONSTANTS.ceiling) * 0.5 + 8;
  return claw.currentX + Math.sin(claw.swingAngle) * cableLen * 0.05;
}
