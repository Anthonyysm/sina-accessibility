import { MdCheckCircle } from "react-icons/md";
import { Activity } from "@/types/activity";
import Post from "@/components/StudentDashboard/Post/Post";

interface FeedProps {
  activities: Activity[];
  onToggleDone: (id: number) => void;
  onComment: (id: number, text: string) => void;
}

export default function Feed({ activities, onToggleDone, onComment }: FeedProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center px-6 sm:px-8">
        <MdCheckCircle className="text-5xl text-green-300 mb-3" />
        <p className="font-semibold text-[#1e3a5f] text-sm">Tudo em dia!</p>
        <p className="text-xs text-[#9aadca] mt-1">
          Nenhuma atividade nessa categoria.
        </p>
      </div>
    );
  }

  return (
    <div>
      {activities.map((activity) => (
        <Post
          key={activity.id}
          activity={activity}
          onToggleDone={onToggleDone}
          onComment={onComment}
        />
      ))}
    </div>
  );
}
