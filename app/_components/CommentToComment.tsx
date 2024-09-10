import React, { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { addCommentToComment, addCommentToThread } from "@/lib/thread.db";
import { Comment } from "../types/thread";
import { User } from "../types/user";
import { offensiveWords } from "@/lib/offensiveWords";
import { censoredComment } from "@/lib/censoredComment";

type CommentToCommentProps = {
  threadId: string;
  currentUser: User | null;
  comments: Comment[];
  setAllComments: (comments: Comment[]) => void;
  parentCommentId?: string;
  onCancel?: () => void;
  isLocked: boolean;
};

export const handleComment = async (
  threadId: string,
  currentUser: User | null,
  newCommentContent: string,
  selectedCommentId: string | null,
  parentCommentId: string | undefined,
  comments: Comment[],
  setAllComments: (comments: Comment[]) => void
) => {
  if (newCommentContent.trim() !== "" && currentUser) {
    const censoredContent = censoredComment(newCommentContent, offensiveWords);

    const newComment: Comment = {
      id: uuidv4(),
      content: censoredContent,
      creationDate: Timestamp.now(),
      creator: currentUser,
      comment: 0,
      newComments: [],
    };

    if (parentCommentId !== undefined) {
      try {
        await addCommentToComment(threadId, parentCommentId, newComment);

        const updatedComments = comments.map((comment) =>
          comment.id === parentCommentId
            ? {
                ...comment,
                comment: comment.comment + 1,
                newComments: [...(comment.newComments || []), newComment],
              }
            : comment
        );
        console.log("newCommentnewComment", newComment);

        setAllComments(updatedComments);
        console.log("updatedComments:", updatedComments);
      } catch (error) {
        toast.error("Failed to add comment: " + (error as Error).message);
      }
    } else {
      try {
        await addCommentToThread(threadId, newComment);
        setAllComments([...comments, newComment]);
        console.log("...comments", ...comments);
      } catch (error) {
        toast.error("Failed to add comment: " + (error as Error).message);
      }
    }
  } else {
    toast.error("You must be logged in to write a comment.");
  }
};

export const CommentToComment: React.FC<CommentToCommentProps> = ({
  threadId,
  currentUser,
  comments,
  setAllComments,
  parentCommentId,
  onCancel,
  isLocked,
}) => {
  const [newCommentContent, setNewCommentContent] = useState<string>("");
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null
  );
  const [isReplying, setIsReplying] = useState<boolean>(false);

  const handleSubmit = async () => {
    await handleComment(
      threadId,
      currentUser,
      newCommentContent,
      selectedCommentId,
      parentCommentId,
      comments,
      setAllComments
    );
    setIsReplying(false);
    setNewCommentContent("");
  };

  return (
    <div>
      {!isReplying && !isLocked && (
        <button
          className="border-[1px] rounded-full m-2 px-4 py-2 bg-yellow-200 text-xs"
          onClick={() => setIsReplying(true)}
        >
          Reply
        </button>
      )}
      {isReplying && (
        <>
          <textarea
            className="w-full h-24 p-2"
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            placeholder="Write your reply..."
          />
          <div className="flex justify-end">
            <button
              className="border-[1px] rounded-full m-2 px-4 py-2 bg-red-400 text-xs"
              onClick={() => {
                setIsReplying(false);
                if (onCancel) onCancel();
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-sm btn-primary border-[1px] rounded-full m-2 px-4 py-2 bg-green-400 text-xs"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
};
