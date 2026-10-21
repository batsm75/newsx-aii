// lib/auth.js — JWT HS256 minimal + password hash scrypt (built-in crypto, tanpa dependency)
const crypto = require('crypto');
const SECRET = process.env.JWT_SECRET || 'ganti-dengan-random-string-panjang';

function b64(o) { return Buffer.from(o).toString('base64url'); }

function sign(payload) {
  const h = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const p = b64(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 7 * 86400 }));
  const sig = crypto.createHmac('sha256', SECRET).update(h + '.' + p).digest('base64url');
  return h + '.' + p + '.' + sig;
}

function verify(tok) {
  try {
    const [h, p, s] = tok.split('.');
    const expect = crypto.createHmac('sha256', SECRET).update(h + '.' + p).digest('base64url');
    if (s !== expect) return null;
    const payload = JSON.parse(Buffer.from(p, 'base64url').toString());
    if (payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch (e) { return null; }
}

function hashPw(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  const h = crypto.scryptSync(pw, salt, 64).toString('hex');
  return salt + ':' + h;
}

function verifyPw(pw, stored) {
  try {
    const [salt, h] = stored.split(':');
    const hh = crypto.scryptSync(pw, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(h, 'hex'), Buffer.from(hh, 'hex'));
  } catch (e) { return false; }
}

function userFromReq(req) {
  const auth = req.headers.authorization || '';
  const tok = auth.replace('Bearer ', '');
  return verify(tok);
}

const isAdmin = (u) => u && (u.role === 'Super Admin' || u.role === 'Admin Biasa');

module.exports = { sign, verify, hashPw, verifyPw, userFromReq, isAdmin };
