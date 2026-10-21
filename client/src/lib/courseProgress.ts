/** Only published, evaluable units count toward the learner's progress.
 * Planned modules and hours are catalogue projections, not earned credits.
 */
export function countCompletedPublishedUnits(indices: readonly number[], publishedUnits: number): number {
  if (!Number.isSafeInteger(publishedUnits) || publishedUnits <= 0) return 0;
  return new Set(indices.filter((index) =>
    Number.isSafeInteger(index) && index >= 0 && index < publishedUnits
  )).size;
}

export function publishedProgress(indices: readonly number[], publishedUnits: number): number {
  if (!Number.isSafeInteger(publishedUnits) || publishedUnits <= 0) return 0;
  return countCompletedPublishedUnits(indices, publishedUnits) / publishedUnits;
}
