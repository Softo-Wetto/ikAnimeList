import { describe, expect, it } from "vitest";
import { normalizeKitsuResponse, type KitsuCollectionResponse } from "@/features/catalog/server/kitsu-normalizer";

describe("Kitsu catalogue fallback", () => {
  it("maps Kitsu resources back to MAL routes and the shared media contract", () => {
    const payload: KitsuCollectionResponse = {
      data: [{
        id: "1", type: "anime",
        attributes: {
          canonicalTitle: "Cowboy Bebop", titles: { en: "Cowboy Bebop", ja_jp: "カウボーイビバップ" },
          synopsis: "A crew travels through space.", posterImage: { large: "https://media.kitsu.app/anime/1/large.jpg" },
          subtype: "TV", status: "finished", averageRating: "82.26", userCount: 162073, favoritesCount: 5167,
          startDate: "1998-04-03", episodeCount: 26, episodeLength: 25, ageRating: "R"
        },
        relationships: {
          mappings: { data: [{ type: "mappings", id: "mal-map" }] },
          genres: { data: [{ type: "genres", id: "action" }] }
        }
      }],
      included: [
        { id: "mal-map", type: "mappings", attributes: { externalSite: "myanimelist/anime", externalId: "1" } },
        { id: "action", type: "genres", attributes: { name: "Action" } }
      ],
      meta: { count: 1 }
    };

    expect(normalizeKitsuResponse(payload, "anime")).toMatchObject({
      items: [{ id: 1, mediaType: "anime", title: "Cowboy Bebop", originalTitle: "カウボーイビバップ", malUrl: "https://myanimelist.net/anime/1", score: 8.226, status: "Finished Airing", progressTotal: 26, genres: ["Action"] }],
      total: 1, source: "kitsu"
    });
  });

  it("drops fallback resources that have no MAL mapping instead of creating broken links", () => {
    const payload: KitsuCollectionResponse = { data: [{ id: "2", type: "manga", attributes: { canonicalTitle: "Unmapped" } }], included: [], meta: { count: 1 } };
    expect(normalizeKitsuResponse(payload, "manga").items).toEqual([]);
  });
});
