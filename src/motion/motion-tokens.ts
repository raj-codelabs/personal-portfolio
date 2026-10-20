// motion-tokens.ts (mass = 1)
export const spring = {
  settle:   { type: "spring" as const, stiffness: 170, damping: 26 }, // default, ~critically damped
  soft:     { type: "spring" as const, stiffness: 100, damping: 20 }, // large panels, rules, mask reveals
  snap:     { type: "spring" as const, stiffness: 300, damping: 35 }, // small controls, hover, press
  physical: { type: "spring" as const, stiffness: 170, damping: 18 }, // underdamped (~0.7). Badge flip ONLY
} as const;

export const distance = { reveal: 12 } as const;   // px, translateY for reveals
export const stagger  = { text: 0.04, card: 0.05, cap: 0.4 } as const; // seconds; total stagger never exceeds cap
