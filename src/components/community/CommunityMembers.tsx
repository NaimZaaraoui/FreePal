import { useState } from "react";
import { UserPlus } from "lucide-react";
import { CommunityMemberWithRelations } from "../../types";

import MemberCard from "./MemberCard";
import InviteMembersModal from "./InviteMembersModal";
import useAuth from "../../hooks/useAuth";
import useCommunity from "../../hooks/useCommunity";
import { AnimatePresence } from "motion/react";

interface Props {
  members: CommunityMemberWithRelations[];
  communityId: string;
}

const CommunityMembers = ({ members, communityId }: Props) => {
  const { user } = useAuth();
  const { canManageMembers, canManageRoles } = useCommunity(
    communityId,
    user?.id
  );

  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Members Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {members.length} {members.length === 1 ? "member" : "members"}
        </div>
        {canManageMembers && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
            <UserPlus className="w-4 h-4" />
            Invite Members
          </button>
        )}
      </div>

      {/* Members Grid */}
      <div className="grid gap-4">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            canManageRoles={canManageRoles}
            canManageMembers={canManageMembers}
          />
        ))}
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <InviteMembersModal
            communityId={communityId}
            onClose={() => setShowInviteModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityMembers;
