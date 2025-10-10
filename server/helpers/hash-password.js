const crypto = require('crypto');
const { promisify } = require('util');
const scrypt = promisify(crypto.scrypt);

async function hashPassword(password) {
  // generate a random 16-byte salt
  const salt = crypto.randomBytes(16).toString('hex');
  // derive a 64-byte key from the password + salt
  const derivedKey = await scrypt(password, salt, 64);
  // store salt and key together (you’ll need both to verify)
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password, storedHash) {
  const [salt, keyHex] = storedHash.split(':');
  const derivedKey = await scrypt(password, salt, 64);
  const storedKey = Buffer.from(keyHex, 'hex');

  // use timingSafeEqual to prevent timing attacks
  return crypto.timingSafeEqual(derivedKey, storedKey);
}


module.exports = { hashPassword, verifyPassword }