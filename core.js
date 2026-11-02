export const STATUSES = ['new', 'saved', 'applied', 'accepted', 'declined'];
export function safeUrl(value) { try { const url = new URL(value); return url.protocol === 'https:' ? url.href : '#'; } catch { return '#'; } }
export function effectiveAvailability(item, today = new Date().toISOString().slice(0,10)) { return item.availability === 'open' && ((item.deadline && item.deadline < today) || (item.dateEnd && item.dateEnd < today)) ? 'closed' : item.availability; }
export function filterOpportunities(items, filters, records = {}, today) { return items.filter(item => {
const text = [item.title,item.host,item.location,item.summary,...item.topics].join(' ').toLowerCase();
return (!filters.query || text.includes(filters.query.toLowerCase())) && (filters.availability === 'all' || effectiveAvailability(item,today) === filters.availability) && (filters.funding === 'all' || item.funding === filters.funding) && (!filters.topic || filters.topic === 'all' || item.topics.includes(filters.topic)) && (filters.region === 'all' || (filters.region === 'International' ? !['UAE','Armenia'].includes(item.region) : item.region === filters.region)) && (filters.status === 'all' || (records[item.id]?.status || 'new') === filters.status);
}).sort((a,b)=>(a.deadline || '9999').localeCompare(b.deadline || '9999')); }
export function validateBackup(input) {
if (!input || input.version !== 1 || typeof input.records !== 'object' || input.records === null || Array.isArray(input.records)) throw new Error('Choose an Opportunity Tracker backup (version 1).');
const records = Object.create(null);
for (const [id,record] of Object.entries(input.records)) {
if (!/^[a-z0-9-]{1,100}$/.test(id) || !record || !STATUSES.includes(record.status) || typeof record.notes !== 'string' || record.notes.length > 10000) throw new Error('Backup contains invalid records. Nothing was changed.');
records[id] = {status:record.status,notes:record.notes}; }
return records;
}
export function readRecords(storage) { try { const value=storage.getItem('opportunities.records.v1'); return value ? validateBackup(JSON.parse(value)) : {}; } catch { return {}; } }
export function writeRecords(storage, records) { storage.setItem('opportunities.records.v1', JSON.stringify({version:1,records})); }
