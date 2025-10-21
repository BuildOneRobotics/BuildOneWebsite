const h = (s) => {
  let x = 0;
  for (let i = 0; i < s.length; i++) {
    x = ((x << 5) - x) + s.charCodeAt(i);
    x = x & x;
  }
  return x;
};

const c = [
  [h('bensteels'), h('2412')],
  [h('ethanpatmore'), h('1012')]
];

export const validateAdmin = (u, p) => {
  const uh = h(u);
  const ph = h(p);
  return c.some(([a, b]) => a === uh && b === ph);
};
