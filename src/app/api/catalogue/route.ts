import { NextResponse } from "next/server";
import { searchMedia } from "@/features/catalog";
import { parseCatalogueSearchParams } from "@/features/catalog/server/catalogue-search";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const result = await searchMedia(parseCatalogueSearchParams(url.searchParams));
    return NextResponse.json(result, { headers: { "Cache-Control": "private, max-age=0, s-maxage=60, stale-while-revalidate=300" } });
  } catch {
    return NextResponse.json({ message: "Catalogue data is temporarily unavailable." }, { status: 503 });
  }
}
