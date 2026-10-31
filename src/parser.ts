import { z } from 'zod';
import type { Item } from './model.js';
const optionalText = z.union([z.string().max(500), z.null()]).optional().transform(v => typeof v === 'string' ? v.trim() || null : null);
const requiredText = z.string().max(100).trim().min(1);
const row = z.object({item_id: requiredText, source_system: requiredText, item_description: optionalText, manufacturer: optionalText, manufacturer_part_number: optionalText, category: optionalText, unit_of_measure: optionalText}).strict();
const schema = z.array(row).min(1).max(500);
export function parseItems(input: unknown): ReadonlyArray<Item> { return schema.parse(input); }
