// backend/redis.js
const cache = new Map();
const timers = new Map();

const setCache = (key, data, ttl = 600) => {
  if (timers.has(key)) clearTimeout(timers.get(key));
  cache.set(key, data);
  timers.set(key, setTimeout(() => cache.delete(key), ttl * 1000));
};

const getCache = (key) => cache.get(key) || null;

const deleteCache = (key) => {
  if (timers.has(key)) clearTimeout(timers.get(key));
  cache.delete(key);
};

module.exports = { setCache, getCache, deleteCache };
