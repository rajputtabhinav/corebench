"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { relativeTime } from "@/lib/format";
import type { Comment } from "@/lib/data";

function CommentNode({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  return (
    <div className={depth ? "ml-6 mt-4 border-l border-border pl-4" : ""}>
      <div className="flex gap-3">
        <Avatar name={comment.author} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-[13px]">
            <span className="font-semibold text-foreground">{comment.author}</span>{" "}
            <span className="text-subtle-foreground">· {relativeTime(comment.createdAt)}</span>
          </p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-foreground/90">{comment.body}</p>
        </div>
      </div>
      {comment.replies?.map((r) => <CommentNode key={r.id} comment={r} depth={depth + 1} />)}
    </div>
  );
}

export function Comments({ comments, author }: { comments: Comment[]; author: string }) {
  const [list, setList] = useState<Comment[]>(comments);
  const [text, setText] = useState("");

  function submit() {
    const body = text.trim();
    if (!body) return;
    setList((prev) => [
      ...prev,
      { id: `local-${prev.length}-${body.length}`, author, body, createdAt: new Date().toISOString() },
    ]);
    setText("");
  }

  return (
    <div>
      <div className="space-y-5">
        {list.length ? (
          list.map((c) => <CommentNode key={c.id} comment={c} />)
        ) : (
          <p className="text-[13px] text-muted-foreground">No comments yet — start the discussion.</p>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <Avatar name={author} size="sm" />
        <div className="flex-1">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment…"
            rows={2}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
            }}
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-subtle-foreground">⌘↵ to send</span>
            <Button size="sm" variant="accent" onClick={submit} disabled={!text.trim()}>
              Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
