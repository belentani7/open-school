import { guides, officialSources, TOPICS, type Topic } from "@shared/latam-data";

export type CatalogFilters = {
  query?: string;
  topic?: Topic;
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");

function containsQuery(values: string[], query: string) {
  return normalize(values.join(" ")).includes(query);
}

export function getCatalog(filters: CatalogFilters = {}) {
  const query = filters.query?.trim() ? normalize(filters.query.trim()) : "";
  const topic = filters.topic;

  const matchingGuides = guides.filter(guide => {
    const matchesTopic = !topic || guide.topic === topic;
    const matchesQuery = !query || containsQuery([
      guide.title,
      guide.description,
      guide.eyebrow,
      ...guide.steps,
      ...guide.requirements,
    ], query);
    return matchesTopic && matchesQuery;
  });

  const matchingSources = officialSources.filter(source => {
    const matchesTopic = !topic || source.category === topic;
    const matchesQuery = !query || containsQuery([
      source.entity,
      source.title,
      source.note,
    ], query);
    return matchesTopic && matchesQuery;
  });

  return {
    guides: matchingGuides,
    sources: matchingSources,
    topics: TOPICS,
    checkedAt: Math.max(...officialSources.map(source => new Date(source.lastCheckedAt).getTime())),
  };
}
