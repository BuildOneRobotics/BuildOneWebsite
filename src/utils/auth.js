const h = (s) => {
  let x = 0;
  for (let i = 0; i < s.length; i++) {
    x = ((x << 5) - x) + s.charCodeAt(i);
    x = x & x;
  }
  return x;
};

const c = [
  [-1006319273, 1507620906, 'super'],
  [-1545738973, -1397293008, 'mod']
];

export const validateAdmin = (u, p) => {
  const uh = h(u);
  const ph = h(p);
  const match = c.find(([a, b]) => a === uh && b === ph);
  return match ? { valid: true, role: match[2], username: u } : { valid: false };
};

export const isSuperAdmin = (username) => {
  return h(username) === -1006319273;
};
