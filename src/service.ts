import type { Item, Finding } from './model.js';
import { missingPart } from './rules/missingPart.js';
import { weakDescription } from './rules/weakDescription.js';
import { duplicates } from './rules/duplicates.js';
import { categoryMismatch, type CategoryAdvisor } from './rules/category.js';
export async function review(items: ReadonlyArray<Item>, advisor: CategoryAdvisor): Promise<Finding[]> { const results: Finding[]=[]; for (const item of items) { results.push(...missingPart(item),...weakDescription(item),...await categoryMismatch(item,advisor)); } return [...results,...duplicates(items)]; }
