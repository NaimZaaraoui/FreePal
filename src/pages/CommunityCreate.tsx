import { motion } from "motion/react";
import { Users, Lock, Globe, Gavel, FileText, LinkIcon } from "lucide-react";
import { useCreateCommunityMutation } from "../mutations";
import { useState } from "react";
import { Link } from "react-router";
import { slugify } from "../utils";

const CommunityCreate = () => {
  const [isPublic, setIsPublic] = useState(true);
  const [slug, setSlug] = useState("");

  const { mutate: createCommunity, isPending } = useCreateCommunityMutation();

  const createCommunityAction = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const rules = formData.get("rules") as string;

    createCommunity({
      name,
      description,
      rules,
      is_public: isPublic,
      slug,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="container py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-black mb-4">
              Create Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
                Community
              </span>
            </h1>
            <p className="text-gray-600 text-lg">
              Build a space where people can connect and share their interests
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container max-w-2xl -mt-8 px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          {/* Form */}
          <form
            action={createCommunityAction}
            className="divide-y divide-gray-100">
            {/* Community Name Section */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Community Name
                  </h2>
                  <p className="text-sm text-gray-500">
                    Choose a unique name for your community
                  </p>
                </div>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="e.g. Tech Enthusiasts"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                onChange={e => setSlug(slugify(e.target.value))}
              />
            </div>

            {/* Community Slug Section */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Community Slug</h2>
                  <p className="text-sm text-gray-500">
                    Choose a unique URL for your community
                  </p>
                </div>
              </div>
              <input
                type="text"
                id="slug"
                name="slug"
                required
                placeholder="e.g. tech-enthusiasts"
                value={slug}
                onChange={e => setSlug(slugify(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            {/* Description Section */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-pink-500" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Description</h2>
                  <p className="text-sm text-gray-500">
                    Tell people what your community is about
                  </p>
                </div>
              </div>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                placeholder="What's your community about?"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
              />
            </div>

            {/* Rules Section */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Gavel className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Community Rules
                  </h2>
                  <p className="text-sm text-gray-500">
                    Set guidelines for your community members
                  </p>
                </div>
              </div>
              <textarea
                id="rules"
                name="rules"
                required
                rows={4}
                placeholder="Set some ground rules for your community"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
              />
            </div>

            {/* Visibility Section */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                  {isPublic ? (
                    <Globe className="w-6 h-6 text-pink-500" />
                  ) : (
                    <Lock className="w-6 h-6 text-pink-500" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Visibility</h2>
                  <p className="text-sm text-gray-500">
                    Choose who can join your community
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setIsPublic(true)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isPublic
                      ? "border-indigo-500 bg-indigo-50 text-indigo-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <Globe className="w-5 h-5 mx-auto mb-2" />
                  <div className="font-medium">Public</div>
                  <div className="text-sm text-gray-500">Anyone can join</div>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublic(false)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    !isPublic
                      ? "border-indigo-500 bg-indigo-50 text-indigo-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <Lock className="w-5 h-5 mx-auto mb-2" />
                  <div className="font-medium">Private</div>
                  <div className="text-sm text-gray-500">
                    By invitation only
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 flex gap-4">
              <Link
                to="/communities"
                className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </Link>
              <motion.button
                type="submit"
                disabled={isPending}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex-1 px-6 py-3 text-white font-medium bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl
                         hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {isPending ? "Creating Community..." : "Create Community"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityCreate;
