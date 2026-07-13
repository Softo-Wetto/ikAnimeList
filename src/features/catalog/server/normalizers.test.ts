import { describe, expect, it } from "vitest";
import { normalizeAnime, normalizeManga } from "@/features/catalog/server/normalizers";

describe("catalogue normalizers", () => {
  it("normalizes an anime and its related media into the shared contract", () => {
    const media = normalizeAnime({
      mal_id: 5114,
      url: "https://myanimelist.net/anime/5114",
      title: "Hagane no Renkinjutsushi",
      title_english: "Fullmetal Alchemist: Brotherhood",
      title_japanese: "Fullmetal Alchemist",
      images: { webp: { large_image_url: "https://cdn.myanimelist.net/fmab.webp" }, jpg: {} },
      type: "TV", episodes: 64, status: "Finished Airing", score: 9.1, year: 2009,
      synopsis: "Two brothers search for the Philosopher's Stone.",
      genres: [{ mal_id: 1, name: "Action" }, { mal_id: 8, name: "Drama" }], themes: [{ mal_id: 38, name: "Military" }],
      trailer: { embed_url: "https://www.youtube.com/embed/example" }, aired: { string: "Apr 2009 to Jul 2010" },
      relations: [{ relation: "Alternative version", entry: [{ mal_id: 25, type: "manga", name: "Fullmetal Alchemist", url: "https://myanimelist.net/manga/25" }] }]
    });
    expect(media).toMatchObject({ id: 5114, mediaType: "anime", title: "Fullmetal Alchemist: Brotherhood", format: "TV", progressTotal: 64, genres: ["Action", "Drama"], themes: ["Military"], relations: [{ relation: "Alternative version", id: 25, mediaType: "manga", title: "Fullmetal Alchemist" }] });
    expect(media.imageUrl).toContain("fmab.webp");
  });

  it("normalizes manga chapters and publication year", () => {
    const media = normalizeManga({
      mal_id: 2, url: "https://myanimelist.net/manga/2", title: "Berserk", title_english: null, title_japanese: "Berserk",
      images: { webp: {}, jpg: { large_image_url: "https://cdn.myanimelist.net/berserk.jpg" } }, type: "Manga", chapters: 380, volumes: 42,
      status: "Publishing", score: 9.47, published: { from: "1989-08-25T00:00:00+00:00", string: "Aug 1989 to ?" }, synopsis: "A lone mercenary battles fate.", genres: [{ mal_id: 1, name: "Action" }], themes: []
    });
    expect(media).toMatchObject({ mediaType: "manga", progressTotal: 380, secondaryTotal: 42, year: 1989, title: "Berserk" });
  });
});
