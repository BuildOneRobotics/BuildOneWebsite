export const validateAdmin = async (u, p) => {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { valid: false };
  }
};

export const isSuperAdmin = (username) => {
  return username === 'bensteels';
};
