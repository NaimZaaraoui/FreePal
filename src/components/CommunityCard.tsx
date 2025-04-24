import { motion } from "motion/react";
import { Link } from "react-router";
import { Globe, Lock, Users, MessageSquare } from "lucide-react";
import { CommunityWithRelations } from "../types";
import Avatar from "./Avatar";

interface Props {
  community: CommunityWithRelations;
}

const CommunityCard = ({ community }: Props) => {
  const {
    id,
    creator,
    name,
    description,
    members_count,
    posts_count,
    is_public,
  } = community;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-pink-500/[0.02] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content Container */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 p-0.5">
            <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          <div className="flex-1 min-w-0">
            <Link
              to={`/communities/${id}`}
              className="block font-bold text-gray-900 hover:text-indigo-600 truncate transition-colors text-lg">
              {name}
            </Link>
            <motion.div
              initial={false}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 mt-1">
              {is_public ? (
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Public</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-xs font-medium">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Private</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-1 group-hover:text-gray-700 transition-colors">
            {description}
          </p>
        </div>

        {/* Stats & Creator */}
        <div className="grid pt-6 border-t border-gray-100 flex-wrap gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5 text-indigo-600">
              <Users className="w-4 h-4" />
              <span className="font-medium">{members_count}</span>
              <span className="text-gray-400 font-normal">members</span>
            </div>
            <div className="flex items-center gap-1.5 text-pink-600">
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">{posts_count}</span>
              <span className="text-gray-400 font-normal">posts</span>
            </div>
          </div>

          <Link
            to={`/users/${creator.username}`}
            className="flex items-center gap-2 group/creator">
            <Avatar
              url={creator.profile_picture_url}
              size="xs"
              username={creator.username}
              className="ring-2 ring-offset-2 ring-indigo-100"
            />
            <span className="text-gray-500 text-sm group-hover/creator:text-indigo-600 transition-colors">
              @{creator.username}
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CommunityCard;
