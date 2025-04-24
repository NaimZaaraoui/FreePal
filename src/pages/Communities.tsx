import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useCommunitiesQuery } from "../queries";
import {
  Plus,
  Search,
  FilterX,
  ArrowDownAZ,
  Sparkles,
  Users,
  Globe,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import CommunityCard from "../components/CommunityCard";

const Communities = () => {
  const { data: communities, isLoading } = useCommunitiesQuery();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSort, setActiveSort] = useState("popular");

  // Filter options
  const filterOptions = [
    {
      id: "all",
      label: "All Communities",
      icon: <Globe className="w-4 h-4" />,
    },
    {
      id: "joined",
      label: "My Communities",
      icon: <Users className="w-4 h-4" />,
    },
    { id: "public", label: "Public Only", icon: <Globe className="w-4 h-4" /> },
  ];

  // Sort options
  const sortOptions = [
    { id: "popular", label: "Most Popular" },
    { id: "recent", label: "Most Recent" },
    { id: "active", label: "Most Active" },
  ];

  // Filter communities based on search and active filter
  const filteredCommunities = communities?.filter((community) => {
    // Search filter
    const matchesSearch =
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesFilter =
      activeFilter === "all"
        ? true
        : activeFilter === "joined"
        ? community.members?.some((m) => m.user_id === user?.id)
        : activeFilter === "public"
        ? community.is_public
        : true;

    return matchesSearch && matchesFilter;
  });

  // Sort communities
  const sortedCommunities = [...(filteredCommunities || [])].sort((a, b) => {
    if (activeSort === "popular")
      return (b.members_count || 0) - (a.members_count || 0);
    if (activeSort === "recent")
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (activeSort === "active")
      return (b.posts_count || 0) - (a.posts_count || 0);
    return 0;
  });

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  // Track scroll for hero section effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section with Parallax Effect */}
      <div
        className={`bg-gradient-to-br from-indigo-50 via-white to-pink-50 transition-all duration-300 ${
          scrolled ? "pt-12 pb-16" : "py-24"
        }`}>
        <div className="container relative overflow-hidden">
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

          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center relative z-10">
            <motion.h1
              className="text-5xl md:text-6xl font-black mb-4"
              animate={{ scale: scrolled ? 0.95 : 1 }}
              transition={{ duration: 0.3 }}>
              Find Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
                Community
              </span>
            </motion.h1>
            <motion.p
              className="text-gray-600 text-lg md:text-xl mb-8"
              animate={{ opacity: scrolled ? 0.8 : 1 }}
              transition={{ duration: 0.3 }}>
              Connect with people who share your interests, passions, and goals
            </motion.p>

            {/* Search Input */}
            <motion.div
              className="relative max-w-xl mx-auto mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label="Clear search">
                  <FilterX className="h-5 w-5" />
                </button>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}>
              {user && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/communities/create"
                    className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
                    <Plus className="w-4 h-4" />
                    Create Community
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-16 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="container py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center overflow-x-auto no-scrollbar gap-3">
              {filterOptions.map((filter) => (
                <motion.button
                  key={filter.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    activeFilter === filter.id
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}>
                  {filter.icon}
                  {filter.label}
                </motion.button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all">
                <ArrowDownAZ className="w-4 h-4" />
                <span>
                  Sort by: {sortOptions.find((s) => s.id === activeSort)?.label}
                </span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg shadow-indigo-100/40 border border-gray-100 overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setActiveSort(option.id)}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-indigo-50 transition-colors ${
                      activeSort === option.id
                        ? "text-indigo-600 font-medium bg-indigo-50/50"
                        : "text-gray-700"
                    }`}>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        activeSort === option.id
                          ? "bg-indigo-500"
                          : "bg-gray-300"
                      }`}></span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Communities Grid */}
      <div className="container py-12">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i + 1}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
                <div className="h-16 bg-gray-200 rounded-xl mb-4" />
                <div className="flex justify-between items-center">
                  <div className="h-8 bg-gray-200 rounded w-1/3" />
                  <div className="h-8 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedCommunities?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-indigo-300" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No communities found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Try searching with different keywords"
                : "Be the first to create a community"}
            </p>
            {user && (
              <Link
                to="/communities/create"
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
                <Plus className="w-4 h-4" />
                Create Community
              </Link>
            )}
          </motion.div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchTerm
                  ? `Search results for "${searchTerm}"`
                  : activeFilter === "joined"
                  ? "Your Communities"
                  : activeFilter === "public"
                  ? "Public Communities"
                  : "All Communities"}
              </h2>
              <div className="text-gray-500 text-sm">
                {sortedCommunities.length}{" "}
                {sortedCommunities.length === 1 ? "community" : "communities"}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sortedCommunities?.map((community, i) => (
                <motion.div
                  key={community.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible">
                  <CommunityCard community={community} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Communities;
