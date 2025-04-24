import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "react-router";
import {
  useCommunityByIdQuery,
  useGetJoinRequestsQuery,
  useModeratorActionsQuery,
} from "../queries/communities";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import {
  Loader2,
  ArrowLeft,
  Users,
  Settings,
  Bell,
  Share2,
  Info,
  Bookmark,
  Shield,
  FileText,
  UserPlus,
  MessageCircle,
  BookOpen,
  Calendar,
  Award,
  User,
} from "lucide-react";
import { FaPlus, FaCompass } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import { useJoinCommunityMutation } from "../mutations";
import CommunityMembers from "../components/community/CommunityMembers";
import CommunityJoinRequests from "../components/community/CommunityJoinRequests";
import ModeratorActionsLog from "../components/community/ModeratorActionsLog";
import PostsGrid from "../components/PostsGrid";
import CreatePostModal from "../components/CreatePostModal";
import useCommunity from "../hooks/useCommunity";

const SingleCommunity = () => {
  const { id } = useParams<{ id: string }>();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  const {
    data: community,
    isLoading,
    isError,
    error,
  } = useCommunityByIdQuery(id!);

  const {
    userData,
    isCreator,
    isCommunityAdmin,
    isModerator,
    isMember,
    canManageMembers,
    canModerate,
  } = useCommunity(community?.id ?? "", user?.id);

  const { mutate: joinCommunity, isPending: isJoining } =
    useJoinCommunityMutation();

  const { data: joinRequests } = useGetJoinRequestsQuery(community?.id ?? "", {
    enabled: canManageMembers,
  });

  const { data: moderatorActions } = useModeratorActionsQuery(
    community?.id ?? ""
  );

  const canPost = isMember || isCreator || isCommunityAdmin;

  // Track scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  const tabs = [
    {
      name: "Posts",
      icon: <MessageCircle className="w-4 h-4" />,
      count: community?.posts_count,
    },
    { name: "About", icon: <Info className="w-4 h-4" /> },
    {
      name: "Members",
      icon: <Users className="w-4 h-4" />,
      count: community?.members_count,
    },
    { name: "Rules", icon: <FileText className="w-4 h-4" /> },
    ...(!community?.is_public && canManageMembers
      ? [
          {
            name: "Requests",
            icon: <UserPlus className="w-4 h-4" />,
            count: joinRequests?.length,
          },
        ]
      : []),
    ...(canModerate
      ? [{ name: "Moderation", icon: <Shield className="w-4 h-4" /> }]
      : []),
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4 text-gray-600">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <p className="font-medium">Loading community...</p>
        </motion.div>
      </div>
    );
  }

  if (isError || !community) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="container max-w-lg mx-auto h-full flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <ArrowLeft className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error instanceof Error ? error.message : "Community Not Found"}
            </h2>
            <p className="text-gray-500 mb-6">
              The community you're looking for might not exist or you may not
              have permission to view it.
            </p>
            <Link
              to="/communities"
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
              <ArrowLeft className="w-4 h-4" />
              Back to Communities
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section with Parallax Effect */}
      <div
        className={`relative bg-gradient-to-br from-indigo-50 via-white to-pink-50 transition-all duration-300 ${
          scrolled ? "pt-12 pb-32" : "py-24"
        }`}>
        <div className=" relative overflow-hidden">
          {/* Background Shapes */}
          <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
            <motion.div
              animate={{
                rotate: [0, 15],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-300 to-indigo-400"
            />
            <motion.div
              animate={{
                rotate: [0, -10],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-r from-pink-300 to-purple-300"
            />
          </div>

          {/* Back Link */}
          <Link
            to="/communities"
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 text-gray-600 hover:text-indigo-600 font-medium rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Communities
          </Link>

          {/* Community Header Content */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
              {/* Community Avatar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center text-white text-4xl font-bold">
                {community.name.charAt(0)}
              </motion.div>

              {/* Community Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <h1 className="text-3xl md:text-4xl font-black">
                    {community.name}
                  </h1>
                  {community.is_public ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-100">
                      Public
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">
                      Private
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 mt-2 justify-center md:justify-start">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">
                      {community.members_count} members
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">
                      {community.posts_count} posts
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-gray-600 line-clamp-2">
                  {community.description}
                </p>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap items-center gap-3 justify-center md:justify-start">
                  {!isCreator &&
                    (isMember ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-5 py-2.5 text-indigo-600 bg-indigo-50 font-medium rounded-xl hover:bg-indigo-100 transition-colors">
                        <span className="flex items-center gap-2">
                          <Bookmark className="w-4 h-4" />
                          Joined
                        </span>
                      </motion.button>
                    ) : userData?.status === "pending" ? (
                      <span className="px-5 py-2.5 text-indigo-600 bg-indigo-50 font-medium rounded-xl hover:bg-indigo-100 transition-colors">
                        <User className="w-4 h-4" />
                        Pending
                      </span>
                    ) : (
                      <motion.button
                        onClick={() =>
                          joinCommunity({
                            communityId: community.id,
                            slug: community.slug,
                          })
                        }
                        disabled={isJoining}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-5 py-2.5 text-white font-medium bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-70 transition-all">
                        <span className="flex items-center gap-2">
                          {isJoining ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <UserPlus className="w-4 h-4" />
                          )}
                          {community.is_public
                            ? "Join Community"
                            : "Request to Join"}
                        </span>
                      </motion.button>
                    ))}

                  {/* Creator badge */}
                  {isCreator && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-100">
                      <Bookmark className="w-4 h-4" />
                      Creator
                    </span>
                  )}

                  {isCommunityAdmin && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-100">
                      <Shield className="w-4 h-4" />
                      Admin
                    </span>
                  )}

                  {isModerator && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-100">
                      <Shield className="w-4 h-4" />
                      Moderator
                    </span>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <Bell className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </motion.button>

                  {(isCreator || isCommunityAdmin) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <Settings className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section with Sidebar */}
      <div className=" py-12">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="md:w-64 lg:w-72 shrink-0">
            <div className="space-y-6">
              {/* Community Quick Info Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                {/* Community Stats */}
                <div className="pb-4 mb-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Community Info
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Members</span>
                      <span className="font-medium text-gray-900">
                        {community.members_count}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Posts</span>
                      <span className="font-medium text-gray-900">
                        {community.posts_count}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created</span>
                      <span className="font-medium text-gray-900">
                        {new Date(community.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type</span>
                      <span className="font-medium text-gray-900">
                        {community.is_public ? "Public" : "Private"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Quick Actions
                  </h3>
                  <div className="space-y-1">
                    {canPost && (
                      <button
                        onClick={() => setShowCreatePost(true)}
                        className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <FaPlus className="w-4 h-4 text-indigo-500" />
                        <span className="font-medium">Create Post</span>
                      </button>
                    )}
                    <button className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      <FaCompass className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium">Explore Topics</span>
                    </button>
                    <button className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      <Bell className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium">Notifications</span>
                    </button>
                    <button className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium">Share Community</span>
                    </button>
                    {(isCreator || isCommunityAdmin) && (
                      <button className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <Settings className="w-4 h-4 text-indigo-500" />
                        <span className="font-medium">Manage Community</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Moderators Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-500" />
                  Community Leaders
                </h3>
                <div className="space-y-3">
                  {/* Creator */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm">
                      C
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        Creator Name
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Creator
                      </div>
                    </div>
                  </div>

                  {/* You would map through moderators here */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
                      M
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        ModeratorName
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Moderator
                      </div>
                    </div>
                  </div>
                  {/* Add more moderators */}
                </div>
              </div>

              {/* Upcoming Events Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  Upcoming Events
                </h3>
                <div className="text-sm text-gray-500 mb-2">
                  No upcoming events scheduled.
                </div>
                {(isCreator || isCommunityAdmin) && (
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1">
                    <FaPlus className="w-3 h-3" />
                    Create Event
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Tabs & Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <TabGroup>
                <div className="bg-white border-b border-gray-100 shadow-sm w-full">
                  <TabList className="px-6 w-full">
                    <div className="w-full flex overflow-hidden no-scrollbar gap-2 -mb-px flex-wrap">
                      {tabs.map((tab) => (
                        <Tab
                          key={tab.name}
                          className={({ selected }) =>
                            `flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap outline-none ${
                              selected
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`
                          }>
                          {tab.icon}
                          <span>{tab.name}</span>
                          {tab.count != null && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              {tab.count}
                            </span>
                          )}
                        </Tab>
                      ))}
                    </div>
                  </TabList>
                </div>

                <TabPanels className="p-6">
                  {/* Posts Tab */}
                  <TabPanel>
                    <div className="space-y-6">
                      {canPost && (
                        <motion.button
                          onClick={() => setShowCreatePost(true)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full px-6 py-4 flex items-center gap-3 text-gray-500 bg-gradient-to-r from-gray-50/80 to-gray-50 hover:from-gray-100/80 hover:to-gray-100 border border-gray-200 rounded-xl text-left transition-all shadow-sm">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/10 to-pink-500/10 flex items-center justify-center">
                            <span className="text-indigo-500">+</span>
                          </div>
                          <span>Share something with the community...</span>
                        </motion.button>
                      )}
                      <PostsGrid
                        type="community"
                        communityId={community.id}
                      />
                    </div>
                  </TabPanel>

                  {/* About Tab */}
                  <TabPanel>
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      custom={1}
                      variants={fadeInUp}
                      className="bg-gradient-to-r from-gray-50/50 to-white rounded-xl p-6 border border-gray-100 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-500" />
                        About this community
                      </h3>
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-wrap text-gray-700">
                          {community.description}
                        </p>
                      </div>
                    </motion.div>
                  </TabPanel>

                  {/* Members Tab */}
                  <TabPanel>
                    <CommunityMembers
                      members={community.members}
                      communityId={community.id}
                    />
                  </TabPanel>

                  {/* Rules Tab */}
                  <TabPanel>
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      custom={1}
                      variants={fadeInUp}
                      className="bg-gradient-to-r from-gray-50/50 to-white rounded-xl p-6 border border-gray-100 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-indigo-500" />
                        Community Rules
                      </h3>
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700">
                          {community.rules}
                        </div>
                      </div>
                    </motion.div>
                  </TabPanel>

                  {/* Join Requests Tab */}
                  {!community.is_public && canManageMembers && (
                    <TabPanel>
                      <CommunityJoinRequests
                        requests={joinRequests ?? []}
                        communityId={community.id}
                      />
                    </TabPanel>
                  )}

                  {/* Moderation Tab */}
                  {isModerator && (
                    <TabPanel>
                      <ModeratorActionsLog actions={moderatorActions ?? []} />
                    </TabPanel>
                  )}
                </TabPanels>
              </TabGroup>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <CreatePostModal
            communityId={community.id}
            onClose={() => setShowCreatePost(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SingleCommunity;
