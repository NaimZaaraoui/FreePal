import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import { useGetUserQuery } from "../queries/users";
import {
  FaMapMarker,
  FaCalendar,
  FaLink,
  FaEdit,
  FaUsers,
  FaCamera,
  FaPaperPlane,
} from "react-icons/fa";
import {
  BadgeCheck,
  MessageSquare,
  Share2,
  BookmarkPlus,
  Grid,
  Users,
  Heart,
  Camera,
  Award,
} from "lucide-react";
import Avatar from "../components/Avatar";
import PostsGrid from "../components/PostsGrid";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import useAuth from "../hooks/useAuth";
import { format } from "date-fns";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { data: profile, isLoading } = useGetUserQuery(username!);
  const { user } = useAuth();

  const navigateTo = useNavigate();

  const isOwnProfile = user?.user_metadata.username === username;

  const tabs = [
    {
      name: "Posts",
      count: profile?.posts_count,
      icon: <Grid className="w-4 h-4" />,
    },
    {
      name: "Communities",
      count: profile?.communities_count,
      icon: <Users className="w-4 h-4" />,
    },
    {
      name: "Likes",
      count: profile?.likes_count,
      icon: <Heart className="w-4 h-4" />,
    },
    {
      name: "Media",
      count: profile?.media_count,
      icon: <Camera className="w-4 h-4" />,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="h-64 bg-gradient-to-r from-indigo-500 to-pink-500 animate-pulse" />
        <div className="container max-w-5xl -mt-20">
          <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/20 p-6">
            {/* Profile Header Skeleton */}
            <div className="flex items-start gap-6">
              <div className="w-36 h-36 rounded-2xl bg-gray-200 animate-pulse" />
              <div className="flex-1 space-y-4 py-1">
                <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* Enhanced Cover Image Area */}
      <div className="h-64 relative overflow-hidden">
        {profile?.cover_image_url ? (
          <img
            src={profile.cover_image_url}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            {/* Animated bubble effects */}
            <motion.div
              className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white opacity-10"
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute bottom-10 right-32 w-40 h-40 rounded-full bg-white opacity-10"
              animate={{
                y: [0, 20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>
        )}

        {/* Cover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Edit cover button */}
        {isOwnProfile && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-4 right-4 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-xl text-sm flex items-center gap-2 text-gray-700 hover:bg-white transition-colors shadow-lg">
            <FaCamera className="w-4 h-4" />
            Edit Cover
          </motion.button>
        )}
      </div>

      <div className="container max-w-5xl -mt-24 relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white backdrop-blur-lg bg-opacity-90 rounded-3xl shadow-xl shadow-indigo-100/30 border border-white/50 mb-6">
          {/* Profile Header - Enhanced */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative">
                <Avatar
                  url={profile?.profile_picture_url}
                  size="xl"
                  username={profile?.username}
                  className="ring-4 ring-white w-36 h-36 md:w-40 md:h-40"
                />
                {profile?.verified && (
                  <div className="absolute -right-2 -bottom-2 bg-gradient-to-r from-indigo-500 to-pink-500 p-1 rounded-full">
                    <BadgeCheck className="w-5 h-5 text-white" />
                  </div>
                )}
                {isOwnProfile && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer">
                    <FaCamera className="w-4 h-4 text-gray-600" />
                  </motion.div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-black text-gray-900">
                        {profile?.username}
                      </h1>
                      {profile?.premium && (
                        <div className="inline-flex px-2 py-1 text-xs font-medium bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-full">
                          PRO
                        </div>
                      )}
                    </div>
                    {profile?.name && (
                      <p className="text-gray-600 font-medium">
                        {profile.name}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 md:mt-0">
                    {isOwnProfile ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 flex items-center gap-2 shadow-sm"
                        onClick={() => navigateTo("/settings")}>
                        <FaEdit className="w-4 h-4" />
                        Edit Profile
                      </motion.button>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
                          <FaUsers className="w-4 h-4" />
                          Follow
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Message
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="mt-6 inline-flex bg-gray-50 rounded-xl p-2 gap-2">
                  <div className="px-4 py-2 text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {profile?.followers_count || 0}
                    </div>
                    <div className="text-xs text-gray-500">Followers</div>
                  </div>
                  <div className="px-4 py-2 text-center border-l border-r border-gray-200">
                    <div className="text-lg font-bold text-gray-900">
                      {profile?.following_count || 0}
                    </div>
                    <div className="text-xs text-gray-500">Following</div>
                  </div>
                  <div className="px-4 py-2 text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {profile?.posts_count || 0}
                    </div>
                    <div className="text-xs text-gray-500">Posts</div>
                  </div>
                </div>

                {/* Bio - Enhanced */}
                {profile?.bio && (
                  <div className="mt-4 bg-gradient-to-r from-indigo-50 to-pink-50 p-4 rounded-xl border border-indigo-100/50">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {profile.bio}
                    </p>
                  </div>
                )}

                {/* Profile Meta - Enhanced layout */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                  {profile?.location && (
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <FaMapMarker className="w-4 h-4 text-indigo-500" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <FaCalendar className="w-4 h-4 text-pink-500" />
                    <span>
                      Joined{" "}
                      {format(
                        new Date(profile?.created_at as string),
                        "MMMM yyyy"
                      )}
                    </span>
                  </div>
                  {profile?.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg text-indigo-600 hover:text-indigo-700 hover:bg-gray-100 transition-colors">
                      <FaLink className="w-4 h-4" />
                      <span>{new URL(profile.website).hostname}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          {!isOwnProfile && (
            <div className="px-8 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="text-sm text-gray-500">
                {profile?.last_active
                  ? `Last seen ${format(
                      new Date(profile.last_active),
                      "MMM d, h:mm a"
                    )}`
                  : ""}
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                  <Share2 className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                  <BookmarkPlus className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                  <FaPaperPlane className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          )}

          {/* Enhanced Tabs with Icons */}
          <TabGroup>
            <div className="px-8 border-t border-gray-100">
              <TabList className="flex flex-wrap -mb-px">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }) =>
                      `flex gap-2 py-4 px-6 text-sm font-medium border-b-2 transition-colors outline-none ${
                        selected
                          ? "border-indigo-500 text-indigo-600 bg-gradient-to-r from-indigo-50/50 to-transparent"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`
                    }>
                    {tab.icon}
                    <span>{tab.name}</span>
                    {tab.count !== undefined && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          tab.count > 0
                            ? "bg-gray-100 text-gray-700"
                            : "bg-gray-50 text-gray-400"
                        }`}>
                        {tab.count || 0}
                      </span>
                    )}
                  </Tab>
                ))}
              </TabList>
            </div>

            <TabPanels className="p-8 border-t border-gray-100">
              <TabPanel>
                <PostsGrid type="my" />
              </TabPanel>

              <TabPanel>
                {/* Communities - Enhanced Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {profile?.communities?.length ? (
                    profile.communities.map((community) => (
                      <motion.div
                        key={community.id}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-indigo-500 to-pink-500 relative">
                          {community.cover_image_url && (
                            <img
                              src={community.cover_image_url}
                              alt={community.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 flex items-center justify-center text-white font-bold">
                              {community.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800">
                                {community.name}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {community.members_count} members
                              </p>
                            </div>
                          </div>
                          {community.description && (
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                              {community.description}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        No Communities Yet
                      </h3>
                      <p className="text-gray-500 mt-2">
                        Join some communities to connect with like-minded people
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg">
                        Discover Communities
                      </motion.button>
                    </div>
                  )}
                </div>
              </TabPanel>

              <TabPanel>
                {/* Likes Panel */}
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-pink-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Liked Content
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Content you've liked will appear here
                  </p>
                </div>
              </TabPanel>

              <TabPanel>
                {/* Media Panel */}
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <Camera className="w-8 h-8 text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Media Gallery
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Photos and videos will appear here
                  </p>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </motion.div>

        {/* Achievements Section - New Feature */}
        {profile?.achievements?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-lg shadow-indigo-100/30 p-6 mb-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Award className="w-5 h-5 mr-2 text-indigo-500" />
                Achievements
              </h2>
              <button className="text-sm text-indigo-600">View All</button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {(profile?.achievements || []).map((achievement, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="min-w-[180px] bg-gradient-to-br from-indigo-50 to-pink-50 rounded-xl p-4 border border-indigo-100/40">
                  <div className="w-12 h-12 mb-3 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800">
                    {achievement.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {achievement.description}
                  </p>
                  <div className="mt-2 text-xs text-indigo-600">
                    {achievement.date}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;
