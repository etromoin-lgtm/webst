// Rate Limiter for Login Endpoints
// Enforces:
// 1. Sliding-window brute-force lockout: Max 5 failed attempts per 15 minutes per IP
// 2. High-frequency throttle: Max 10 requests per minute per IP

const FAILED_ATTEMPTS_LIMIT = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BURST_LIMIT = 10;
const BURST_WINDOW_MS = 60 * 1000; // 1 minute

// In-memory tracking maps
const failedAttempts = new Map(); // ip -> { count, firstFailedAt, lastFailedAt }
const requestBurst = new Map();   // ip -> [timestamps]

// Clean up stale entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of failedAttempts.entries()) {
    if (now - data.lastFailedAt > LOCKOUT_WINDOW_MS) {
      failedAttempts.delete(ip);
    }
  }
  for (const [ip, timestamps] of requestBurst.entries()) {
    const valid = timestamps.filter(t => now - t < BURST_WINDOW_MS);
    if (valid.length === 0) {
      requestBurst.delete(ip);
    } else {
      requestBurst.set(ip, valid);
    }
  }
}, 10 * 60 * 1000);

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1';
};

const loginRateLimiter = (req, res, next) => {
  const ip = getClientIp(req);
  const now = Date.now();

  // 1. High-frequency burst check (Max 10 requests / 1 min)
  let timestamps = requestBurst.get(ip) || [];
  timestamps = timestamps.filter(t => now - t < BURST_WINDOW_MS);
  if (timestamps.length >= BURST_LIMIT) {
    const oldest = timestamps[0];
    const waitSeconds = Math.ceil((BURST_WINDOW_MS - (now - oldest)) / 1000);
    res.setHeader('Retry-After', waitSeconds);
    return res.status(429).json({
      success: false,
      error: `Too many requests from this IP. Please slow down and wait ${waitSeconds}s before retrying.`,
      retryAfterSeconds: waitSeconds,
      rateLimited: true
    });
  }
  timestamps.push(now);
  requestBurst.set(ip, timestamps);

  // 2. Lockout check for repeated failed credentials (Max 5 failed attempts / 15 mins)
  const failureRecord = failedAttempts.get(ip);
  if (failureRecord && failureRecord.count >= FAILED_ATTEMPTS_LIMIT) {
    const elapsed = now - failureRecord.lastFailedAt;
    if (elapsed < LOCKOUT_WINDOW_MS) {
      const waitSeconds = Math.ceil((LOCKOUT_WINDOW_MS - elapsed) / 1000);
      const waitMinutes = Math.ceil(waitSeconds / 60);
      res.setHeader('Retry-After', waitSeconds);
      res.setHeader('X-RateLimit-Limit', FAILED_ATTEMPTS_LIMIT);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', Math.floor((failureRecord.lastFailedAt + LOCKOUT_WINDOW_MS) / 1000));
      return res.status(429).json({
        success: false,
        error: `Security Lockout: Too many failed login attempts. Access is locked for ${waitMinutes} minute(s). Try again later.`,
        retryAfterSeconds: waitSeconds,
        locked: true
      });
    } else {
      // Window expired, reset record
      failedAttempts.delete(ip);
    }
  }

  // Attach helper methods to req
  req.recordLoginSuccess = () => {
    failedAttempts.delete(ip);
  };

  req.recordLoginFailure = () => {
    const current = failedAttempts.get(ip) || { count: 0, firstFailedAt: now, lastFailedAt: now };
    current.count += 1;
    current.lastFailedAt = now;
    failedAttempts.set(ip, current);

    const remaining = Math.max(0, FAILED_ATTEMPTS_LIMIT - current.count);
    return {
      count: current.count,
      remaining,
      isLocked: current.count >= FAILED_ATTEMPTS_LIMIT,
      lockoutMinutes: Math.ceil(LOCKOUT_WINDOW_MS / 60000)
    };
  };

  req.getRemainingAttempts = () => {
    const current = failedAttempts.get(ip);
    if (!current) return FAILED_ATTEMPTS_LIMIT;
    return Math.max(0, FAILED_ATTEMPTS_LIMIT - current.count);
  };

  next();
};

module.exports = {
  loginRateLimiter,
  getClientIp
};
