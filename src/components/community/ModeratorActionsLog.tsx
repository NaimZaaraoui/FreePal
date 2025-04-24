import { motion } from "framer-motion";
import { Link } from "react-router";
import { format } from "date-fns";
import Avatar from "../Avatar";
import { ModeratorActionWithRelations } from "../../types/communities";
import { AlertTriangle, MessageSquareOff, Trash2 } from "lucide-react";

interface Props {
  actions: ModeratorActionWithRelations[];
}

const actionIcons = {
  warn: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  mute: <MessageSquareOff className="w-4 h-4 text-red-500" />,
  remove_post: <Trash2 className="w-4 h-4 text-red-500" />,
  remove_comment: <Trash2 className="w-4 h-4 text-red-500" />,
};

const actionTexts = {
  warn: "Warning issued",
  mute: "User muted",
  remove_post: "Post removed",
  remove_comment: "Comment removed",
};

export default function ModeratorActionsLog({ actions }: Props) {
  if (actions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No moderation actions taken yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actions.map((action) => (
        <motion.div
          key={action.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex-shrink-0">{actionIcons[action.action_type]}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">
                {actionTexts[action.action_type]}
              </span>
              <span className="text-gray-400">•</span>
              <time className="text-sm text-gray-500">
                {format(new Date(action.created_at), "MMM d, yyyy 'at' h:mm a")}
              </time>
              {action.expires_at && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    Expires{" "}
                    {format(
                      new Date(action.expires_at),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{action.reason}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">By</span>
                <Link
                  to={`/users/${action.moderator.username}`}
                  className="flex items-center gap-2 hover:text-indigo-600">
                  <Avatar
                    url={action.moderator.profile_picture_url}
                    username={action.moderator.username}
                    size="xs"
                  />
                  <span className="font-medium">
                    @{action.moderator.username}
                  </span>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Against</span>
                <Link
                  to={`/users/${action.target_user.username}`}
                  className="flex items-center gap-2 hover:text-indigo-600">
                  <Avatar
                    url={action.target_user.profile_picture_url}
                    username={action.target_user.username}
                    size="xs"
                  />
                  <span className="font-medium">
                    @{action.target_user.username}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
