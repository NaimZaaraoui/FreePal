import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { format } from "date-fns";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Shield, MoreVertical, UserMinus, Star } from "lucide-react";
import { CommunityMemberWithRelations } from "../../types";
import Avatar from "../Avatar";
import useCommunity from "../../hooks/useCommunity";
import useAuth from "../../hooks/useAuth";

interface Props {
  member: CommunityMemberWithRelations;
  canManageRoles: boolean;
  canManageMembers: boolean;
}

const MemberCard = ({ member, canManageRoles, canManageMembers }: Props) => {
  const { promoteToAdmin, promoteToModerator, demoteToMember, removeMember } =
    useCommunity(member.community_id, member.user_id);

  const { user } = useAuth();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100/80 transition-colors group">
      <Avatar
        url={member.user.profile_picture_url}
        size="sm"
        username={member.user.username}
      />

      <div className="min-w-0 flex-1">
        <Link
          to={`/users/${member.user.username}`}
          className="font-medium text-gray-900 hover:text-indigo-600 block truncate">
          {member.user.username}
        </Link>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">
            Joined {format(new Date(member.joined_at), "MMM yyyy")}
          </div>
          {member.role === "admin" && (
            <div className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3" />
              Admin
            </div>
          )}
          {member.role === "moderator" && (
            <div className="flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              <Shield className="w-3 h-3" />
              Moderator
            </div>
          )}
        </div>
      </div>

      {/* Member Actions Menu */}
      {(canManageRoles || canManageMembers) && user?.id !== member.user_id && (
        <Menu
          as="div"
          className="relative">
          <MenuButton className="p-1 text-gray-400 hover:text-gray-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200">
            <MoreVertical className="w-4 h-4" />
          </MenuButton>

          <AnimatePresence>
            <MenuItems
              as={motion.div}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
              {/* Promote to Admin */}
              {canManageRoles && member.role !== "admin" && (
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => promoteToAdmin(member.user_id)}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-left text-sm ${
                        active ? "bg-gray-50" : ""
                      }`}>
                      <Star className="w-4 h-4" />
                      Make Admin
                    </button>
                  )}
                </MenuItem>
              )}

              {/* Promote/Demote Moderator */}
              {canManageRoles && member.role !== "admin" && (
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        if (member.role === "moderator") {
                          demoteToMember(member.user_id);
                        } else {
                          promoteToModerator(member.user_id);
                        }
                      }}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-left text-sm ${
                        active ? "bg-gray-50" : ""
                      }`}>
                      <Shield className="w-4 h-4" />
                      {member.role === "moderator"
                        ? "Remove Moderator"
                        : "Make Moderator"}
                    </button>
                  )}
                </MenuItem>
              )}

              {/* Remove Member */}
              {canManageMembers && (
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => removeMember(member.user_id)}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-red-600 ${
                        active ? "bg-red-50" : ""
                      }`}>
                      <UserMinus className="w-4 h-4" />
                      Remove Member
                    </button>
                  )}
                </MenuItem>
              )}
            </MenuItems>
          </AnimatePresence>
        </Menu>
      )}
    </motion.div>
  );
};

export default MemberCard;
