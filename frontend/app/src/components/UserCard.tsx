import clsx from "clsx";
import { MessageCircle } from "lucide-react";

type UserCardProps = {
  id: number;
  name: string;
  email: string;
  color: string;
  className?: string;
  onChat?: (userId: number) => void;
};

export default function UserCard({
  id,
  name,
  email,
  color,
  className,
  onChat,
}: UserCardProps) {
  const firstLetter = name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      className={clsx(
        "bg-bg rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      <div className="flex flex-col items-center px-5 py-6">
        {/* Avatar */}
        <div
          className="
            w-20 h-20 md:w-24 md:h-24 rounded-full
            flex items-center justify-center
            text-white text-2xl md:text-3xl font-bold
            shadow-sm select-none
          "
          style={{ backgroundColor: color || "#3B82F6" }}
        >
          {firstLetter}
        </div>

        {/* Name */}
        <h3 className="mt-4 text-base md:text-lg font-semibold text-text text-center line-clamp-1">
          {name}
        </h3>

        {/* Email */}
        <p className="mt-1 text-sm text-text-secondary text-center line-clamp-1">
          {email}
        </p>

        {/* Chat button */}
        <button
          type="button"
          onClick={() => onChat?.(id)}
          className="
            mt-5 w-full rounded-full bg-primary px-5 py-2.5
            text-sm font-semibold text-white
            hover:bg-primary/85 active:scale-[0.98]
            transition-all cursor-pointer
            flex items-center justify-center gap-2
          "
        >
          <MessageCircle size={17} />
          Chat
        </button>
      </div>
    </div>
  );
}