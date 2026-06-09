// src/lib/db.js
// Static data loader for InfinityFree static export
import staticContent from '@/data/staticContent.json';

// Returns the same shape as the original DB function but reads from static JSON
export async function getAllPortfolioContent() {
  // The JSON file already contains an array of all portfolio items
  return staticContent;
}

// Export dummy functions to keep imports safe (no-op)
export function getPool() {
  throw new Error('Database pool unavailable in static export');
}
export function parseContent(row) { return row; }
export function parseMedia(media) { return media; }
export function parseGenericId(id) { return { type: null, id: null }; }
export function toGeneric(type, row) { return row; }
