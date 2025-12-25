"use client";

import * as React from "react";
import {
  MessageSquare,
  Reply,
  MoreHorizontal,
  Edit2,
  Trash2,
  Check,
  X,
  AtSign,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

export interface CommentUser {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: CommentUser;
  createdAt: Date;
  updatedAt?: Date;
  resolved?: boolean;
  replies?: Comment[];
  mentions?: string[];
}

export interface CommentThreadProps {
  /** Comments in the thread */
  comments: Comment[];
  /** Current user */
  currentUser?: CommentUser;
  /** Available users for mentions */
  users?: CommentUser[];
  /** Callback when comment is added */
  onAddComment?: (content: string, parentId?: string) => void;
  /** Callback when comment is edited */
  onEditComment?: (id: string, content: string) => void;
  /** Callback when comment is deleted */
  onDeleteComment?: (id: string) => void;
  /** Callback when thread is resolved */
  onResolve?: (id: string) => void;
  /** Whether the thread is resolved */
  isResolved?: boolean;
  /** Additional className */
  className?: string;
}

interface CommentItemProps {
  comment: Comment;
  currentUser?: CommentUser;
  users?: CommentUser[];
  onReply?: () => void;
  onEdit?: (content: string) => void;
  onDelete?: () => void;
  isReply?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUser,
  onReply,
  onEdit,
  onDelete,
  isReply = false,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editContent, setEditContent] = React.useState(comment.content);
  const isOwner = currentUser?.id === comment.author.id;

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onEdit?.(editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className={cn("group", isReply && "ml-8 pt-3")}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="shrink-0">
          {comment.author.avatar ? (
            <img
              src={comment.author.avatar}
              alt={comment.author.name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
              {comment.author.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
            </span>
            {comment.updatedAt && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveEdit}>
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
          )}

          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={onReply}
                >
                  <Reply className="h-3.5 w-3.5 mr-1" />
                  Reply
                </Button>
              )}
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentThread = React.forwardRef<HTMLDivElement, CommentThreadProps>(
  (
    {
      comments,
      currentUser,
      users = [],
      onAddComment,
      onEditComment,
      onDeleteComment,
      onResolve,
      isResolved = false,
      className,
    },
    ref
  ) => {
    const [newComment, setNewComment] = React.useState("");
    const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
    const [showMentions, setShowMentions] = React.useState(false);
    const inputRef = React.useRef<HTMLTextAreaElement>(null);

    const handleSubmit = () => {
      if (!newComment.trim()) return;
      onAddComment?.(newComment, replyingTo || undefined);
      setNewComment("");
      setReplyingTo(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === "@") {
        setShowMentions(true);
      }
      if (e.key === "Escape") {
        setShowMentions(false);
        setReplyingTo(null);
      }
    };

    const insertMention = (user: CommentUser) => {
      setNewComment((prev) => prev + `@${user.name} `);
      setShowMentions(false);
      inputRef.current?.focus();
    };

    return (
      <div ref={ref} className={cn("flex flex-col h-full", className)}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="font-medium text-sm">
              {comments.length} Comment{comments.length !== 1 ? "s" : ""}
            </span>
          </div>
          {onResolve && comments.length > 0 && (
            <Button
              variant={isResolved ? "default" : "outline"}
              size="sm"
              onClick={() => onResolve(comments[0].id)}
            >
              <Check className="h-4 w-4 mr-1" />
              {isResolved ? "Resolved" : "Resolve"}
            </Button>
          )}
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              No comments yet
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id}>
                <CommentItem
                  comment={comment}
                  currentUser={currentUser}
                  users={users}
                  onReply={() => setReplyingTo(comment.id)}
                  onEdit={(content) => onEditComment?.(comment.id, content)}
                  onDelete={() => onDeleteComment?.(comment.id)}
                />
                {/* Replies */}
                {comment.replies?.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    currentUser={currentUser}
                    users={users}
                    onEdit={(content) => onEditComment?.(reply.id, content)}
                    onDelete={() => onDeleteComment?.(reply.id)}
                    isReply
                  />
                ))}
              </div>
            ))
          )}
        </div>

        {/* Input */}
        {currentUser && (
          <div className="border-t p-4">
            {replyingTo && (
              <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                <Reply className="h-4 w-4" />
                <span>
                  Replying to{" "}
                  {comments.find((c) => c.id === replyingTo)?.author.name}
                </span>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="ml-auto hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="relative">
              <textarea
                ref={inputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a comment... (⌘+Enter to send)"
                className="w-full px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary pr-20"
                rows={3}
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setShowMentions(!showMentions)}
                >
                  <AtSign className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  className="h-7"
                  disabled={!newComment.trim()}
                  onClick={handleSubmit}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Mentions dropdown */}
              {showMentions && users.length > 0 && (
                <div className="absolute bottom-full left-0 mb-1 w-48 bg-popover border rounded-md shadow-lg z-10">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => insertMention(user)}
                      className="w-full px-3 py-2 text-sm text-left hover:bg-muted flex items-center gap-2"
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-5 h-5 rounded-full"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      {user.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);
CommentThread.displayName = "CommentThread";

export { CommentThread };
