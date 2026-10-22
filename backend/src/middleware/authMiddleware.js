const crypto = require('crypto');

// Secret key from environment or fallback
const getSecret = () => process.env.JWT_SECRET || 'etromo-production-default-secret-key-32chars';

/**
 * Creates a signed cryptographic token: base64(payload).signature
 */
function createAdminToken(payload = { role: 'super_admin' }) {
  const secret = getSecret();
  const data = {
    ...payload,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  const body = Buffer.from(JSON.stringify(data)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${signature}`;
}

/**
 * Verifies a token and returns the payload if valid, null otherwise
 */
function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return null;

  // Backward compatibility with legacy transition token
  if (token === 'admin-jwt-token-secure-123') {
    return { role: 'super_admin', legacy: true };
  }

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [body, signature] = parts;
  const secret = getSecret();
  const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('base64url');

  try {
    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Express middleware to guard administrative routes
 */
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers['x-admin-token'] || '';
  let token = authHeader;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  }

  const payload = verifyAdminToken(token);
  if (!payload) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Valid admin authentication required.'
    });
  }

  req.adminUser = payload;
  next();
}

/**
 * Safe password hashing using PBKDF2 (built-in Node.js crypto)
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Safe password verification with backward compatibility for legacy plain text passwords
 */
function verifyPassword(password, storedHash) {
  if (!storedHash || !password) return false;

  // Check if hash is in salt:hash format
  if (storedHash.includes(':')) {
    const [salt, key] = storedHash.split(':');
    try {
      const derived = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
      const keyBuf = Buffer.from(key, 'hex');
      const derivedBuf = Buffer.from(derived, 'hex');
      if (keyBuf.length !== derivedBuf.length) return false;
      return crypto.timingSafeEqual(keyBuf, derivedBuf);
    } catch {
      return false;
    }
  }

  // Fallback for legacy demo plaintext passwords (e.g. 'client123')
  return password === storedHash;
}

module.exports = {
  createAdminToken,
  verifyAdminToken,
  requireAdminAuth,
  hashPassword,
  verifyPassword
};
