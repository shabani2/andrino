"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart, UserPlus } from "lucide-react";
import { submitComment, toggleFollow, toggleLike, type CommentState } from "@/actions/engagement";
import type { PublicComment } from "@/lib/engagement";

const initial: CommentState = { error: null, success: false };

export function PostEngagement({ entryId, locale, likes, followers, liked, following, comments }: {
  entryId: string; locale: string; likes: number; followers: number; liked: boolean; following: boolean; comments: PublicComment[];
}) {
  const fr = locale === "fr";
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [commentState, commentAction, commentPending] = useActionState(submitComment.bind(null, entryId), initial);
  const [likedLocal, setLikedLocal] = useState(liked);
  const [followingLocal, setFollowingLocal] = useState(following);
  const [likeCount, setLikeCount] = useState(likes);
  const [followCount, setFollowCount] = useState(followers);

  function changeLike() {
    setLikedLocal(!likedLocal);
    setLikeCount(Math.max(0, likeCount + (likedLocal ? -1 : 1)));
    startTransition(async () => { await toggleLike(entryId); router.refresh(); });
  }
  function changeFollow() {
    setFollowingLocal(!followingLocal);
    setFollowCount(Math.max(0, followCount + (followingLocal ? -1 : 1)));
    startTransition(async () => { await toggleFollow(); router.refresh(); });
  }
  return <section className="post-engagement">
    <div className="post-reactions">
      <button type="button" disabled={pending} aria-pressed={likedLocal} onClick={changeLike}>
        <Heart size={19} fill={likedLocal ? "currentColor" : "none"} aria-hidden="true" />
        {likedLocal ? (fr ? "Retirer le j’aime" : "Remove like") : (fr ? "Aimer" : "Like")} · {likeCount}
      </button>
      <button type="button" disabled={pending} aria-pressed={followingLocal} onClick={changeFollow}>
        <UserPlus size={19} aria-hidden="true" />
        {followingLocal ? (fr ? "Ne plus suivre" : "Unfollow") : (fr ? "Suivre Andrino" : "Follow Andrino")} · {followCount}
      </button>
    </div>
    <div className="post-comments">
      <h2>{fr ? "Commentaires" : "Comments"} {comments.length > 0 && <span>{comments.length}</span>}</h2>
      {comments.length > 0 && <div className="post-comment-list">{comments.map((comment) =>
        <article key={comment.id} className="post-comment">
          <div><strong>{comment.author_name}</strong><time dateTime={comment.created_at}>
            {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(comment.created_at))}
          </time></div>
          <p>{comment.body}</p>
        </article>)}</div>}
      <form action={commentAction} className="post-comment-form">
        <h3>{fr ? "Écrire un commentaire" : "Write a comment"}</h3>
        <label>{fr ? "Nom" : "Name"}<input name="name" required minLength={2} maxLength={60} /></label>
        <label>{fr ? "Commentaire" : "Comment"}<textarea name="body" required minLength={3} maxLength={1500} rows={5} /></label>
        <input className="post-honeypot" tabIndex={-1} autoComplete="off" name="website" aria-hidden="true" />
        {commentState.error && <p role="alert" className="post-comment-error">{commentState.error}</p>}
        {commentState.success && <p role="status">{fr ? "Commentaire reçu." : "Comment received."}</p>}
        <button type="submit" disabled={commentPending}>{commentPending ? (fr ? "Envoi…" : "Sending…") : (fr ? "Envoyer le commentaire" : "Send comment")}</button>
      </form>
    </div>
  </section>;
}
