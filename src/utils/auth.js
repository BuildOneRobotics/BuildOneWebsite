const h = (s) => {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash | 0;
  }
  return hash;
};

const d = [
  [h('bensteels'), h('24122012'), 's'],
  [h('ethanpatmore'), h('1012'), 'm']
];

export const validateAdmin = (u, p) => {
  const uh = h(u);
  const ph = h(p);
  const match = d.find(([a, b]) => a === uh && b === ph);
  return match ? { valid: true, role: match[2] === 's' ? 'super' : 'mod', username: u } : { valid: false };
};

export const isSuperAdmin = (username) => {
  return h(username) === h('bensteels');
};
