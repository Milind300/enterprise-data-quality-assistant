import { finding, type Item, type Finding } from '../model.js';
export type CategorySuggestion = Readonly<{expectedCategory: string; explanation: string; confidence: number}>;
export interface CategoryAdvisor { suggest(item: Item): Promise<CategorySuggestion | null>; }
// This deterministic stub simulates the boundary, not a trained model.
export class SimulatedCategoryAdvisor implements CategoryAdvisor {
 async suggest(item: Item): Promise<CategorySuggestion | null> { const description=(item.item_description ?? '').toLowerCase(); const category=(item.category ?? '').toLowerCase(); if (/\b(bearing|valve)\b/u.test(description) && category === 'electrical') return {expectedCategory:'Mechanical',explanation:'The description mentions a bearing or valve, while the category is Electrical.',confidence:0.7}; return null; }
}
export async function categoryMismatch(item: Item, advisor: CategoryAdvisor): Promise<Finding[]> { const s=await advisor.suggest(item); if (!s) return []; if (!s.expectedCategory.trim() || !s.explanation.trim() || !Number.isFinite(s.confidence) || s.confidence < 0 || s.confidence > 1) throw new Error('Invalid category advisor output'); return [finding(item,{issue_type:'category_mismatch_candidate',severity:'low',confidence:s.confidence,explanation:s.explanation,suggested_action:`Review whether category ${s.expectedCategory} is appropriate before approval.`,source:'simulated_ai'})]; }
