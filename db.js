// lib/db.js — helper PostgREST (Supabase) via fetch, TANPA dependency npm
const SUPA = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY;

async function q(table, opts = {}) {
  let url = SUPA + '/rest/v1/' + table;
  const p = new URLSearchParams();
  if (opts.select) p.set('select', opts.select);
  if (opts.filters) for (const [k, v] of Object.entries(opts.filters)) p.set(k, 'eq.' + v);
  if (opts.order) p.set('order', opts.order);
  if (opts.limit) p.set('limit', String(opts.limit));
  const qs = p.toString();
  if (qs) url += '?' + qs;
  const r = await fetch(url, {
    headers: {
      apikey: KEY,
      Authorization: 'Bearer ' + KEY,
      'Content-Type': 'application/json',
      Prefer: opts.prefer || 'return=representation'
    },
    ...opts.init
  });
  if (!r.ok) { const t = await r.text(); throw new Error(r.status + ' ' + t); }
  if (r.status === 204) return null;
  return r.json();
}

module.exports = {
  q,
  insert: (table, rows) => q(table, { init: { method: 'POST', body: JSON.stringify(rows) } }),
  update: (table, filters, patch) => q(table, { filters, init: { method: 'PATCH', body: JSON.stringify(patch) } })
};
