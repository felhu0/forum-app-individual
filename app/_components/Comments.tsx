"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Comment } from "../types/thread";
import { useAuth } from "./authProvider";
import { FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MarkedAsAnswered } from "./MarkedAsAnswered";
import { timeDifference } from "@/lib/relativeDateTime";
import { FaCircleUser } from "react-icons/fa6";
import { useState } from "react";
import { CommentToComment } from "./CommentToComment";

type CommentsProps = {
  comments: Comment[];
  threadId: string;
  threadCreatorId: string;
  answered: boolean;
  answeredCommentId: string | null;
  setAnswered: (answered: boolean) => void;
  handleAnswered: (commentId: string) => Promise<void>;
  isQnA: boolean;
  isLocked: boolean;
  creator: string;
};

export const Comments: React.FC<CommentsProps> = ({
  comments = [],
  answeredCommentId,
  handleAnswered,
  isQnA,
  isLocked,
  threadId,
  creator,
}) => {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [allComments, setAllComments] = useState<Comment[]>(comments);
  const answeredComment = comments.find(
    (comment) => comment.id === answeredCommentId
  );

  const { user } = useAuth();

  const canEdit = user && (user.id === creator || user.isModerator);

  return (
    <>
      {isQnA && answeredComment && (
        <MarkedAsAnswered key={answeredComment.id} comment={answeredComment} />
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="bg-stone-50 border-t-1">Comments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allComments.map((comment, index) => {
            const isAnswered = comment.id === answeredCommentId;
            return (
              <React.Fragment key={comment.id || index}>
                <TableRow className="comment-hover">
                  <div className="pl-4 p-6 w-full border border-collapse">
                    {comment.content}
                  </div>
                  <div>
                    <p className="m-3">New Comments</p>
                    {comment.newComments &&
                      Array.isArray(comment.newComments) && (
                        <div>
                          {comment.newComments.map((newComment) => (
                            <div
                              key={newComment.id}
                              className="ml-4 border-l-2 pl-4"
                            >
                              <div className="m-2 border p-2">
                                <div className="mb-2">
                                  Comment:{" "}
                                  <p className="text-xs  text-blue-800">
                                    {newComment.content}
                                  </p>
                                </div>
                                <div className="mb-2 flex">
                                  <FaCircleUser className="text-muted-foreground mr-1" />
                                  <p className="text-xs text-blue-800">
                                    {newComment.creator.username}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                  <div className="flex justify-between items-center px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="flex gap-1 items-center">
                        <FaCircleUser className="text-muted-foreground" />
                        <span className="text-xs font-semibold">
                          {comment.creator?.username}
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {timeDifference(
                          new Date(),
                          new Date(comment.creationDate.toDate())
                        )}
                      </span>
                    </div>

                    {canEdit && (
                      <div className="">
                        {isQnA &&
                          (isAnswered ? (
                            <span
                              className={`flex items-center ${
                                isLocked
                                  ? "text-green-600/70"
                                  : "text-green-600"
                              }`}
                            >
                              <FaCheck className="mr-2" />
                              Answered
                            </span>
                          ) : (
                            <button
                              className={`flex items-center ${
                                isLocked ? "text-gray-400" : "text-gray-600"
                              }`}
                              onClick={() => {
                                if (!currentUser) {
                                  router.push("/log-in");
                                  toast.error(
                                    "You need to log in to mark a comment as answered."
                                  );
                                  return;
                                }

                                if (
                                  currentUser.id !== creator &&
                                  !currentUser.isModerator
                                ) {
                                  toast.error(
                                    "Only the thread creator or a moderator can mark a comment as answered."
                                  );
                                  return;
                                }

                                handleAnswered(comment.id);
                              }}
                              disabled={isLocked}
                            >
                              <FaCheck className="mr-2" />
                              Mark as Answered
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </TableRow>
                <CommentToComment
                  threadId={threadId}
                  currentUser={currentUser}
                  comments={allComments}
                  setAllComments={setAllComments}
                  parentCommentId={comment.id}
                  isLocked={isLocked}
                />
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
