// Hash function for basic obfuscation
const hashPin = (pin) => {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    hash = ((hash << 5) - hash) + pin.charCodeAt(i);
    hash = hash & hash;
  }
  return hash.toString();
};

// Stored as hashed values
const ADMIN_HASHES = {
  bensteels: '-1397292976',
  ethanpatmore: '-1397293008'
};

export const validateAdmin = (username, pin) => {
  return ADMIN_HASHES[username] === hashPin(pin);
};
