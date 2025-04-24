import { motion } from "framer-motion";
import { Globe, Lock, Loader2, Settings } from "lucide-react";
import { FaUsers, FaCalendar } from "react-icons/fa";
import { Link } from "react-router";
import { CommunityMemberWithRelations, CommunityWithRelations } from "../../types";
import Avatar from "../Avatar";
import { format } from "date-fns";

interface Props {
  community: CommunityWithRelations;
  isCreator: boolean;
  isAdmin: boolean;
  member?: CommunityMemberWithRelations;
  isJoining?: boolean;
  onJoin: () => void;
}

const getButtonText = (status?: string) => {
  if (status === "pending") return "Cancel Request";
  else if (status === "approved") return "Leave Community";
  return "Join Community";
};

const CommunityHero = ({
  community,
  isCreator,
  isAdmin,
  member,
  isJoining,
  onJoin,
}: Props) => {
  return (
    <>
      <div className="h-48 bg-gradient-to-r from-indigo-500 to-pink-500" />
      <div className="container max-w-4xl -mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm">
          <div className="p-6">
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white">
                <FaUsers className="w-12 h-12" />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {community.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      {community.is_public ? (
                        <Globe className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      <span>
                        {community.is_public ? "Public" : "Private"} Community
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!isCreator && (
                      <button
                        onClick={onJoin}
                        disabled={isJoining}
                        className={`px-6 py-2 font-medium rounded-xl transition-all ${
                          member
                            ? "text-gray-700 bg-gray-100 hover:bg-gray-200"
                            : "text-white bg-gradient-to-r from-indigo-500 to-pink-500 hover:shadow-lg hover:shadow-indigo-500/25"
                        }`}>
                        {isJoining ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {isJoining ? "Joining..." : "Leaving..."}
                          </span>
                        ) : (
                          getButtonText(member?.status)
                        )}
                      </button>
                    )}
                    {(isCreator || isAdmin) && (
                      <Link
                        to={`/communities/${community.slug}/settings`}
                        className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <Settings className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Avatar
                      url={community.creator?.profile_picture_url}
                      size="xs"
                    />
                    Created by @{community.creator?.username}
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCalendar className="w-4 h-4" />
                    Created{" "}
                    {format(new Date(community.created_at), "MMMM yyyy")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default CommunityHero;
