"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getThreadById, updateThread } from "@/lib/thread.db";
import { FaQuestionCircle } from "react-icons/fa";

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
  const router = useRouter();
  const { id } = useParams<Params>();

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

  if (!thread) {
    return (
      <div className="flex pt-16 text-center justify-center mx-auto text-lg font-medium">
        Loading...
      </div>
    );
  }

 

  return (
    <>
      <div className="w-full mx-auto pl-12 px-6 max-w-6xl my-8 pt-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground text-lg p-4 bg-stone-50 flex items-center">
                  {thread.title}
                  {thread.isQnA && (
                    <FaQuestionCircle className="h-6 w-6 text-yellow-600 ml-2" />
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{thread.description}</TableCell>
              </TableRow>
            </TableBody>
            <TableBody>
                <TableRow className="bg-stone-50">
                    <TableCell className="font-bold text-yellow-700">
                        By {thread.creator.name}
                    </TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="mx-auto w-full pl-12 px-6 my-8 max-w-6xl">
        <div className="rounded-md border">
          {thread.isQnA && (
            <Comments
              comments={comments}
              threadId={thread.id}
              threadCreatorId={thread.creator.id}
              answered={answered}
              setAnswered={setAnswered}
              handleAnswered={handleMarkAsAnswered}
              answeredCommentId={answeredCommentId ?? null}
              isQnA={thread.isQnA}
            />
          )}
        </div>
      </div>
      <div className="w-full pl-12 px-6 py-8 absolute bottom-0 bg-slate-200">
        <div className="mx-auto max-w-3xl">
          <NewCommentForm
            id={thread.id}
            onCommentSubmit={handleCommentSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default ThreadDetailsPage;
