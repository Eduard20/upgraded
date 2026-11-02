export const STATUSES = ['new', 'saved', 'applied', 'accepted', 'declined'];
export const INTERESTS = ['like', 'dislike'];
export const KINDS = ['Conference', 'Speaker call', 'Fellowship', 'Leadership programme', 'Scholarship', 'Course', 'Language', 'Festival & culture', 'Sport & wellbeing', 'Competition'];
export function safeUrl(value) { try { const url = new URL(value); return url.protocol === 'https:' ? url.href : '#'; } catch { return '#'; } }
export function effectiveAvailability(item, today = new Date().toISOString().slice(0,10)) { return item.availability === 'open' && ((item.deadline && item.deadline < today) || (item.dateEnd && item.dateEnd < today)) ? 'closed' : item.availability; }
function matchesInterest(filter, interest) {
if (!filter || filter === 'all') return true;
if (filter === 'hide-disliked') return interest !== 'dislike';
if (filter === 'unrated') return !interest;
return interest === filter; }
export function filterOpportunities(items, filters, records = {}, today) { return items.filter(item => {
const text = [item.title,item.host,item.location,item.summary,item.kind,...item.topics].join(' ').toLowerCase();
const availability = effectiveAvailability(item,today);
return (!filters.query || text.includes(filters.query.toLowerCase())) && (filters.availability === 'all' || availability === filters.availability || (filters.availability === 'open' && availability === 'ongoing')) && (filters.funding === 'all' || item.funding === filters.funding) && (!filters.topic || filters.topic === 'all' || item.topics.includes(filters.topic)) && (!filters.kind || filters.kind === 'all' || item.kind === filters.kind) && (filters.region === 'all' || (filters.region === 'International' ? !['UAE','Armenia'].includes(item.region) : item.region === filters.region)) && (filters.status === 'all' || (records[item.id]?.status || 'new') === filters.status) && matchesInterest(filters.interest, records[item.id]?.interest);
}).sort((a,b)=>(a.deadline || '9999').localeCompare(b.deadline || '9999')); }
export function setInterest(records, id, interest) {
const current = records[id] || {status:'new',notes:''};
const next = {status:current.status,notes:current.notes};
if (interest && current.interest !== interest) next.interest = interest;
return {...records,[id]:next}; }
export function feedbackSummary(items, records) {
const line = item => `- ${item.title} [${item.kind}; ${item.topics.join(', ')}; ${item.region}; funding: ${item.funding}]${records[item.id]?.notes ? ` — note: ${records[item.id].notes.replace(/\s+/g,' ').slice(0,300)}` : ''}`;
const group = interest => items.filter(item => records[item.id]?.interest === interest);
const liked = group('like'), disliked = group('dislike');
return [`Open doors feedback · ${new Date().toISOString().slice(0,10)}`, '', `LIKED (${liked.length})`, ...liked.map(line), '', `NOT FOR ME (${disliked.length})`, ...disliked.map(line)].join('\n'); }
export function validateBackup(input) {
if (!input || input.version !== 1 || typeof input.records !== 'object' || input.records === null || Array.isArray(input.records)) throw new Error('Choose an Opportunity Tracker backup (version 1).');
const records = Object.create(null);
for (const [id,record] of Object.entries(input.records)) {
if (!/^[a-z0-9-]{1,100}$/.test(id) || !record || !STATUSES.includes(record.status) || typeof record.notes !== 'string' || record.notes.length > 10000 || (record.interest !== undefined && !INTERESTS.includes(record.interest))) throw new Error('Backup contains invalid records. Nothing was changed.');
records[id] = {status:record.status,notes:record.notes};
if (record.interest) records[id].interest = record.interest; }
return records;
}
export function readRecords(storage) { try { const value=storage.getItem('opportunities.records.v1'); return value ? validateBackup(JSON.parse(value)) : {}; } catch { return {}; } }
export function writeRecords(storage, records) { storage.setItem('opportunities.records.v1', JSON.stringify({version:1,records})); }
