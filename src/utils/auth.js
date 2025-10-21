const e = (s) => btoa(s);

const creds = [
  { u: 'YmVuc3RlZWxz', p: 'MjQxMjIwMTI=', r: 'super' },
  { u: 'ZXRoYW5wYXRtb3Jl', p: 'MTAxMg==', r: 'mod' }
];

export const validateAdmin = (u, p) => {
  const eu = e(u);
  const ep = e(p);
  const match = creds.find(c => c.u === eu && c.p === ep);
  return match ? { valid: true, role: match.r, username: u } : { valid: false };
};

export const isSuperAdmin = (username) => {
  return e(username) === 'YmVuc3RlZWxz';
};
