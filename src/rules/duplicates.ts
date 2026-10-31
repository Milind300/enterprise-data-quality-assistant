import { finding, type Item, type Finding } from '../model.js';
const normalized = (value: string | null): string => (value ?? '').normalize('NFKC').toLocaleLowerCase('en-US').replace(/[^\p{L}\p{N}]/gu, '');
export function duplicates(items: ReadonlyArray<Item>): Finding[] {
 const groups = new Map<string, Item[]>();
 for (const item of items) { const maker=normalized(item.manufacturer), part=normalized(item.manufacturer_part_number); if (!maker || !part) continue; const key=JSON.stringify([maker,part]); const group=groups.get(key) ?? []; group.push(item); groups.set(key,group); }
 const out: Finding[]=[];
 for (const group of groups.values()) for (const item of group) { const others=group.filter(other => other !== item && normalized(other.source_system) !== normalized(item.source_system)); if (others.length) out.push(finding(item,{issue_type:'possible_duplicate',severity:'medium',confidence:0.8,explanation:'The normalized manufacturer and part number match records from other source systems.',suggested_action:'Compare the records and source context before any consolidation.',source:'heuristic',related_items:others.map(other=>({item_id:other.item_id,source_system:other.source_system}))})); }
 return out;
}
