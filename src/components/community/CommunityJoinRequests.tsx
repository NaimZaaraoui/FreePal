import { motion } from "framer-motion";
import { Link } from "react-router";
import { format } from "date-fns";
import Avatar from "../Avatar";
import { CommunityMemberWithRelations } from "../../types";
import { useApproveJoinRequestMutation } from "../../mutations";

interface Props {
  requests: CommunityMemberWithRelations[];
  communityId: string;
}

const CommunityJoinRequests = ({ requests, communityId }: Props) => {
  const { mutate: handleRequest, isPending } = useApproveJoinRequestMutation();

  return (
    <div className="grid gap-4">
      {requests?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No pending requests</p>
        </div>
      ) : (
        requests?.map((request) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100/80 transition-colors">
            <div className="flex items-center gap-3">
              <Avatar
                url={request.user.profile_picture_url}
                size="sm"
                username={request.user.username}
              />
              <div>
                <Link
                  to={`/users/${request.user.username}`}
                  className="font-medium text-gray-900 hover:text-indigo-600">
                  {request.user.username}
                </Link>
                <div className="text-sm text-gray-500">
                  Requested {format(new Date(request.joined_at), "MMM d, yyyy")}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  handleRequest({
                    communityId,
                    userId: request.user_id,
                    status: "approved",
                  })
                }
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Approve
              </button>
              <button
                onClick={() =>
                  handleRequest({
                    communityId,
                    userId: request.user_id,
                    status: "rejected",
                  })
                }
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Reject
              </button>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default CommunityJoinRequests;
