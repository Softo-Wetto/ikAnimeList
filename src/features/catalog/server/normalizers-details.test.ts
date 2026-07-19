import { describe, expect, it } from "vitest";
import { normalizeAnime, normalizeManga } from "@/features/catalog/server/normalizers";

const images = { jpg: { large_image_url: "https://cdn.example.test/cover.jpg" }, webp: {} };

describe("catalogue detail normalizers", () => {
  it("keeps the title variants, broadcast data, links and themes from Jikan", () => {
    const media = normalizeAnime({
      mal_id: 1, url: "https://myanimelist.net/anime/1", title: "Cowboy Bebop", title_english: "Cowboy Bebop",
      title_japanese: "カウボーイビバップ", title_synonyms: ["Cowboy Bebop: The Series"], titles: [{ type: "English", title: "Cowboy Bebop" }, { type: "Japanese", title: "カウボーイビバップ" }], images,
      type: "TV", status: "Finished Airing", score: 8.7, scored_by: 100, synopsis: "A crew travels through space.", background: "A classic space western.",
      source: "Original", season: "spring", year: 1998, broadcast: { string: "Saturdays at 01:00 (JST)" }, rating: "R - 17+", duration: "24 min per ep.",
      episodes: 26, genres: [{ mal_id: 1, name: "Action" }], themes: [{ mal_id: 50, name: "Adult Cast" }], explicit_genres: [], demographics: [{ mal_id: 27, name: "Shounen" }],
      studios: [{ mal_id: 14, name: "Sunrise" }], producers: [{ mal_id: 23, name: "Bandai" }], licensors: [{ mal_id: 1, name: "Funimation" }],
      theme: { openings: ["Tank!"], endings: ["The Real Folk Blues"] }, external: [{ name: "Official site", url: "https://example.test" }],
      streaming: [{ name: "Crunchyroll", url: "https://example.test/watch" }]
    });

    expect(media).toMatchObject({
      originalTitle: "カウボーイビバップ", titleSynonyms: ["Cowboy Bebop: The Series"], source: "Original", scoredBy: 100,
      background: "A classic space western.", season: "spring", broadcast: "Saturdays at 01:00 (JST)", licensors: ["Funimation"],
      demographics: ["Shounen"], openings: ["Tank!"], endings: ["The Real Folk Blues"],
      externalLinks: [{ name: "Official site", url: "https://example.test" }], streamingLinks: [{ name: "Crunchyroll", url: "https://example.test/watch" }]
    });
  });

  it("keeps manga serializations and publication metadata", () => {
    const media = normalizeManga({
      mal_id: 2, url: "https://myanimelist.net/manga/2", title: "Berserk", title_english: null, title_japanese: "ベルセルク", title_synonyms: [], titles: [{ type: "Default", title: "Berserk" }], images,
      type: "Manga", status: "Publishing", score: 9.4, scored_by: 50, synopsis: "A mercenary fights monsters.", background: "Published over decades.", source: "Original",
      chapters: 380, volumes: 42, published: { from: "1989-08-25T00:00:00+00:00", string: "Aug 1989 to ?" },
      genres: [{ mal_id: 1, name: "Action" }], themes: [], explicit_genres: [], demographics: [], authors: [{ mal_id: 1, name: "Kentaro Miura" }],
      serializations: [{ mal_id: 2, name: "Young Animal" }], external: [{ name: "Official", url: "https://example.test" }]
    });

    expect(media).toMatchObject({ serializations: ["Young Animal"], creators: ["Kentaro Miura"], source: "Original", scoredBy: 50, background: "Published over decades." });
  });
});
