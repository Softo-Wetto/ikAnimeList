import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MediaCast } from "@/features/catalog/components/media-cast";
import { MediaDetails } from "@/features/catalog/components/media-details";
import { MediaGallery } from "@/features/catalog/components/media-gallery";
import { MoreLikeThis } from "@/features/catalog/components/more-like-this";
import type { MediaDetails as MediaDetailsModel } from "@/features/catalog/model";
import { getAnimeStaff, getMediaCharacters, getMediaDetails, getMediaPictures, getMediaRecommendations } from "@/features/catalog";
import { isJikanNotFound } from "@/features/catalog/server/jikan-client";
import { MediaCommunity } from "@/features/social/components/media-community";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try { const media = await getMediaDetails("anime", Number(id)); return { title: media.title, description: media.synopsis?.slice(0, 155) }; }
  catch { return { title: "Anime details" }; }
}

export default async function AnimeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) notFound();
  let media: MediaDetailsModel;
  try {
    media = await getMediaDetails("anime", id);
  } catch (error) {
    if (isJikanNotFound(error)) notFound();
    throw error;
  }
  const [characters, staff, recommendations, pictures] = await Promise.all([
    getMediaCharacters("anime", id),
    getAnimeStaff(id),
    getMediaRecommendations("anime", id),
    getMediaPictures("anime", id)
  ]);
  return (
    <>
      <MediaDetails media={media} />
      <MediaCast characters={characters} staff={staff} />
      <MediaGallery pictures={pictures} title={media.title} />
      <MoreLikeThis items={recommendations} />
      <MediaCommunity media={media} />
    </>
  );
}
