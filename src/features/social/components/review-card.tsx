"use client";

import { Heart, ShieldAlert, Star } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { likeReview } from "@/features/social/server/actions";

type ReviewCardData = {
  id: string;
  title: string;
  body: string;
  rating: number;
  spoiler: boolean;
  authorName: string;
  authorUsername: string | null;
  createdAt: Date;
  likes?: number;
};

const reviewDateFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC"
});

export function ReviewCard({ review }: { review: ReviewCardData }) {
  const [revealed, setRevealed] = useState(!review.spoiler);
  const [pending, startTransition] = useTransition();

  return (
    <article className="rounded-3xl border border-white/8 bg-white/[.025] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-amber-200">
            <Star fill="currentColor" size={14} />
            <strong>{review.rating}/10</strong>
          </div>
          <h3 className="mt-2 text-lg font-black">{review.title}</h3>
          <p className="mt-1 text-xs text-zinc-500">
            by {review.authorUsername ? (
              <Link className="hover:text-violet-300" href={`/users/${review.authorUsername}`}>
                {review.authorName}
              </Link>
            ) : review.authorName}
          </p>
        </div>
      </div>

      {revealed ? (
        <p className="mt-5 whitespace-pre-line text-sm leading-7 text-zinc-300">{review.body}</p>
      ) : (
        <button
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-300/15 bg-amber-300/8 p-5 text-sm font-semibold text-amber-100"
          onClick={() => setRevealed(true)}
        >
          <ShieldAlert size={16} /> Reveal spoiler review
        </button>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-white/7 pt-4">
        <span className="text-xs text-zinc-600">{reviewDateFormatter.format(new Date(review.createdAt))}</span>
        <Button
          disabled={pending}
          onClick={() => startTransition(async () => { await likeReview(review.id); })}
          size="sm"
          variant="ghost"
        >
          <Heart size={14} /> {review.likes ?? 0}
        </Button>
      </div>
    </article>
  );
}
