"use client";

import { UserCheck, UserPlus } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { followUser, unfollowUser } from "@/features/social/server/actions";

export function FollowButton({ targetId, initialFollowing }: { targetId: string; initialFollowing: boolean }) {
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, startTransition] = useTransition();
  return <Button disabled={pending} onClick={() => startTransition(async () => { if (following) await unfollowUser(targetId); else await followUser(targetId); setFollowing(!following); })} variant={following ? "secondary" : "primary"}>{following ? <UserCheck size={16} /> : <UserPlus size={16} />}{following ? "Following" : "Follow"}</Button>;
}
