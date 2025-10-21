const h = (s) => {
  let x = 0;
  for (let i = 0; i < s.length; i++) {
    x = ((x << 5) - x) + s.charCodeAt(i);
    x = x & x;
  }
  return x;
};

const c = [
  [-1006319273, 1507620906],
  [-1545738973, -1397293008]
];

export const validateAdmin = (u, p) => {
  const uh = h(u);
  const ph = h(p);
  return c.some(([a, b]) => a === uh && b === ph);
};
