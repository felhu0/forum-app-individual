"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  deleteThread,
  getThreadById,
  lockThread,
  updateThread,
} from "@/lib/thread.db";
import { FaUnlock, FaLock } from "react-icons/fa";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Comments } from "@/app/_components/Comments";
import { NewCommentForm } from "@/app/_components/NewCommentForm";
import { Thread, Comment } from "@/app/types/thread";
import { User } from "@/app/types/user";
import { useAuth } from "@/app/_components/authProvider";
import { Badge } from "@/components/ui/badge";
import Loading from "@/app/_components/Loading";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MarkedAsAnswered } from "@/app/_components/MarkedAsAnswered";
import { auth } from "@/firebase.config";
import { set } from "zod";

type Params = {
  id: string;
};

const ThreadDetailsPage = () => {
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [answered, setAnswered] = useState<boolean>(false);
  const [answeredCommentId, setAnsweredCommentId] = useState<string | null>(
    null
  );
  const [threadCreatorId, setThreadCreatorId] = useState<User | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams<Params>();
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    const fetchThread = async () => {
      if (id) {
        try {
          const fetchedThread = await getThreadById(id);
          if (fetchedThread) {
            setThread(fetchedThread);
            setComments(fetchedThread.comments);
            setThreadCreatorId(fetchedThread.creator);
            setAnswered(fetchedThread.isAnswered ?? false);
            setAnsweredCommentId(fetchedThread.answeredCommentId ?? null);
          } else {
            console.log("No thread found with the given ID.");
            router.push("/404");
          }
        } catch (error) {
          console.error("Error fetching thread data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("ID is not available in search parameters.");
      }
    };

    fetchThread();
  }, [id, router]);

  const handleCommentSubmit = async (newComment: Comment) => {
    if (thread) {
      setComments([...comments, newComment]);
    }
  };

  const handleMarkAsAnswered = async (commentId: string) => {
    try {
      if (!thread) {
        console.error("Thread not found.");
        return;
      }

      const newIsAnswered = answeredCommentId !== commentId;

      const fieldsToUpdate: Partial<Thread> = {
        isAnswered: newIsAnswered,
      };

      if (newIsAnswered) {
        fieldsToUpdate.answeredCommentId = commentId;
      } else {
        fieldsToUpdate.answeredCommentId = null;
      }

      await updateThread(thread.id, fieldsToUpdate);

      setAnswered(newIsAnswered);
      setAnsweredCommentId(newIsAnswered ? commentId : null);
    } catch (error) {
      console.error("Error toggling comment as answered:", error);
    }
  };

  const handleToggleLock = async () => {
    if (!thread) return;

    try {
      await lockThread(thread.id, !thread.isLocked);
      setThread({ ...thread, isLocked: !thread.isLocked });
    } catch (error) {
      console.error("Failed to lock/unlock thread.", error);
    }
  };

  const handleDelete = async (threadId: string) => {
    try {
      const threadDelete = await deleteThread(threadId);
      if (threadDelete) {
        console.log("Thread deleted");
        setDeleted(true);
      } else {
        console.error("Thread not found");
      }
    } catch (error) {
      console.error("Error deleting thread:", error);
    }
  };

  if (deleted) {
    return (
      <div className="h-24 text-center">
        <p>No thread found.</p>
      </div>
    );
  }

  if (loading || !thread) return <Loading />;

  const canEdit = user && (user.id === thread.creator.id || user.isModerator);

  return (
    <main className="flex flex-col justify-between ">
      <div className="w-full mx-auto pl-12 px-6 max-w-6xl my-8 pt-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-stone-600 text-sm font-semibold p-4 bg-stone-50 flex items-center justify-between h-auto w-full">
                  <div>
                    <p>{thread.title}</p>
                  </div>
                  <div
                    className="
                                    mr-2"
                  >
                    {canEdit && (
                      <button onClick={handleToggleLock} className="mr-2">
                        {thread.isLocked ? (
                          <Badge
                            variant="destructive"
                            className="rounded-full p-3"
                          >
                            <FaLock className="h-3 w-3" />
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="rounded-full p-3 transition-all duration-300 hover:scale-105"
                          >
                            <FaUnlock className="h-3 w-3" />
                          </Badge>
                        )}
                      </button>
                    )}
                    {canEdit && thread?.id && (
                      <Badge
                        className="cursor-pointer"
                        onClick={() => handleDelete(thread.id)}
                      >
                        Delete
                      </Badge>
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div className="py-3 pl-1 pr-6 text-base">
                    {thread.description}
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
            <TableBody>
              <TableRow className="bg-stone-50">
                <TableCell>
                  <div className="flex justify-between items-center">
                    <span className="flex gap-1 text-muted-foreground">
                      By
                      <p className="font-bold text-indigo-700">
                        {" "}
                        {thread.creator.name}
                      </p>
                    </span>

                    {thread.isQnA && <Badge variant="qna">Q&A</Badge>}
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="rounded-md border mt-6">
          {thread && (
            <Comments
              comments={comments}
              threadId={thread.id}
              threadCreatorId={thread.creator.id}
              answered={answered}
              setAnswered={setAnswered}
              handleAnswered={handleMarkAsAnswered}
              answeredCommentId={answeredCommentId ?? null}
              isQnA={thread.isQnA ?? false}
              isLocked={thread.isLocked}
            />
          )}
        </div>
      </div>

      {!thread.isLocked && user && (
        <div className="w-full pl-12 px-6 py-8 bg-gray-200">
          <div className="mx-auto max-w-3xl">
            <NewCommentForm
              id={thread.id}
              onCommentSubmit={handleCommentSubmit}
            />
          </div>
        </div>
      )}

      {thread.isLocked && (
        <div className="w-full max-w-3xl mx-auto pl-12 px-6 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>This thread is locked.</AlertTitle>
            <AlertDescription>
              No further comments can be added.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </main>
  );
};

export default ThreadDetailsPage;
