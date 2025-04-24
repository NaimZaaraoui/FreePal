import { ChangeEvent, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import {
  UserIcon,
  LockClosedIcon,
  BellIcon,
  SwatchIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import Avatar from "../components/Avatar";
import useAuth from "../hooks/useAuth";
import { Switch } from "@headlessui/react";
import { useUpdateUserMutation } from "../mutations/users";
import { User } from "../types";

interface NotificationPrefs {
  mentions: boolean;
  comments: boolean;
  follows: boolean;
  messages: boolean;
  updates: boolean;
  newsletter: boolean;
  emailDigest: string;
}

interface PrivacySettings {
  profileVisibility: string;
  activityStatus: boolean;
  searchable: boolean;
  dataCollection: boolean;
  twoFactorAuth: boolean;
}

interface AppearanceSettings {
  theme: string;
  reduceMotion: boolean;
  fontSize: string;
  highContrast: boolean;
}

interface UserMetadata {
  username?: string;
  bio?: string;
  website?: string;
  location?: string;
  profile_picture_url?: string;
}

const Settings = () => {
  const { user } = useAuth();
  console.log(user);
  const userMetadata = user?.user_metadata as UserMetadata | undefined;
  const [isUploading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: userMetadata?.username ?? "",
    bio: userMetadata?.bio ?? "",
    email: user?.email ?? "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    website: userMetadata?.website ?? "",
    location: userMetadata?.location ?? "",
    theme: "system",
    language: "english",
  });

  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>(
    {
      mentions: true,
      comments: true,
      follows: true,
      messages: true,
      updates: false,
      newsletter: false,
      emailDigest: "weekly",
    }
  );

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: "public",
    activityStatus: true,
    searchable: true,
    dataCollection: true,
    twoFactorAuth: false,
  });

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] =
    useState<AppearanceSettings>({
      theme: "system",
      reduceMotion: false,
      fontSize: "medium",
      highContrast: false,
    });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(
    user?.user_metadata.profile_picture_url ?? null
  );

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] as File;
    if (file) {
      setProfileImage(file);
      const url = URL.createObjectURL(file);
      setProfilePreviewUrl(url);
      // Revoke the object URL after the component unmounts or when the file changes
      return () => URL.revokeObjectURL(url);
    }
  };

  const { mutate: updateUser, isPending: isUpdating } = useUpdateUserMutation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!user) return;
    const changes: Partial<User> = {
      username: formData.displayName,
      bio: formData.bio,
      website: formData.website,
      location: formData.location,
    };
    updateUser({ userId: user.id, changes, profileImage });
  };

  const tabs = [
    { name: "Profile", icon: UserIcon },
    { name: "Account", icon: LockClosedIcon },
    { name: "Notifications", icon: BellIcon },
    { name: "Appearance", icon: SwatchIcon },
    { name: "Privacy", icon: ShieldCheckIcon },
    { name: "Billing", icon: CreditCardIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Manage your account preferences and profile information
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <TabGroup>
            <div className="flex flex-col md:flex-row">
              {/* Sidebar */}
              <TabList className="bg-gray-50 md:w-64 p-2 md:p-4 flex md:flex-col overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap outline-none ${
                        selected
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-100"
                      }`
                    }>
                    <tab.icon className="w-5 h-5" />
                    {tab.name}
                  </Tab>
                ))}
              </TabList>

              {/* Content Area */}
              <TabPanels className="flex-1 p-6">
                {/* Profile Settings Panel */}
                <TabPanel>
                  <div className="space-y-8">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <h2 className="text-xl font-bold text-gray-900">
                        Profile Settings
                      </h2>
                    </div>

                    {/* Avatar Upload */}
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="relative">
                        <Avatar
                          url={profilePreviewUrl}
                          size="xl"
                          username={formData.displayName}
                          className="border-4 border-white shadow-lg cursor-pointer"
                          onClick={() => {
                            const fileInput =
                              document.getElementById("profileImageInput");
                            if (fileInput) {
                              fileInput.click();
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md text-indigo-600 hover:text-indigo-700"
                          aria-label="edit profile picture"
                          onClick={() => {
                            const fileInput =
                              document.getElementById("profileImageInput");
                            if (fileInput) {
                              fileInput.click();
                            }
                          }}>
                          <UserIcon className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-900">
                          Profile Picture
                        </h3>
                        <p className="text-sm text-gray-500">
                          Upload a new profile picture. JPG, PNG or GIF. Max
                          2MB.
                        </p>
                        <div className="flex gap-3 items-center">
                          <input
                            id="profileImageInput"
                            type="file"
                            accept="image/*"
                            onChange={handleMediaChange}
                            disabled={isUploading}
                            className="hidden"
                            aria-label="Upload profile picture"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const fileInput =
                                document.getElementById("profileImageInput");
                              if (fileInput) {
                                fileInput.click();
                              }
                            }}
                            disabled={isUploading}
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:opacity-90 transition-opacity shadow-sm">
                            Choose File
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setProfileImage(null);
                              setProfilePreviewUrl(
                                user?.user_metadata.profile_picture_url ?? null
                              );
                            }}
                            disabled={isUploading || !profileImage}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Basic Info Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          htmlFor="displayName">
                          Display Name
                        </label>
                        <input
                          id="displayName"
                          type="text"
                          name="displayName"
                          value={formData.displayName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          htmlFor="email">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          htmlFor="bio">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows={4}
                          value={formData.bio}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                          placeholder="Tell others about yourself..."
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Max 160 characters. Brief description that will appear
                          on your profile.
                        </p>
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          htmlFor="website">
                          Website
                        </label>
                        <input
                          id="website"
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://example.com"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          htmlFor="location">
                          Location
                        </label>
                        <input
                          id="location"
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="City, Country"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                      <button
                        type="button"
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 text-white font-medium bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-30"
                        disabled={isUpdating}>
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </TabPanel>

                {/* Account Settings Panel */}
                <TabPanel>
                  <div className="space-y-8">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <h2 className="text-xl font-bold text-gray-900">
                        Account Settings
                      </h2>
                    </div>

                    {/* Password Change Section */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900">
                        Change Password
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="currentPassword">
                            Current Password
                          </label>
                          <input
                            id="currentPassword"
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="newPassword">
                            New Password
                          </label>
                          <input
                            id="newPassword"
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Must be at least 8 characters with 1 uppercase
                            letter, 1 number, and 1 special character.
                          </p>
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="confirmPassword">
                            Confirm New Password
                          </label>
                          <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Account Actions */}
                    <div className="space-y-6 pt-6 border-t border-gray-100">
                      <h3 className="text-lg font-medium text-gray-900">
                        Account Actions
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900">
                            Download Your Data
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Get a copy of all your posts, messages, and account
                            information.
                          </p>
                          <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors">
                            Request Data Export
                          </button>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-medium text-red-800">
                            Deactivate Account
                          </h4>
                          <p className="text-sm text-red-700 mb-3">
                            Temporarily disable your account. You can reactivate
                            anytime by logging in.
                          </p>
                          <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-white rounded-lg border border-red-200 hover:bg-red-50 transition-colors">
                            Deactivate
                          </button>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-medium text-red-800">
                            Delete Account
                          </h4>
                          <p className="text-sm text-red-700 mb-3">
                            Permanently delete your account and all associated
                            data. This action cannot be undone.
                          </p>
                          <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSave()}
                        className="flex items-center gap-2 px-6 py-2 text-white font-medium bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </TabPanel>

                {/* Notifications Panel */}
                <TabPanel>
                  <div className="space-y-8">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <h2 className="text-xl font-bold text-gray-900">
                        Notification Preferences
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Push Notifications
                      </h3>

                      <div className="space-y-3">
                        {/* Notification toggle items */}
                        {[
                          {
                            id: "mentions" as keyof NotificationPrefs,
                            label: "Mentions",
                            desc: "When someone mentions you in a post or comment",
                          },
                          {
                            id: "comments" as keyof NotificationPrefs,
                            label: "Comments",
                            desc: "When someone comments on your posts",
                          },
                          {
                            id: "follows" as keyof NotificationPrefs,
                            label: "New Followers",
                            desc: "When someone follows your account",
                          },
                          {
                            id: "messages" as keyof NotificationPrefs,
                            label: "Direct Messages",
                            desc: "When you receive a new message",
                          },
                          {
                            id: "updates" as keyof NotificationPrefs,
                            label: "App Updates",
                            desc: "Important updates about the platform",
                          },
                        ].map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {item.label}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {item.desc}
                              </p>
                            </div>
                            <Switch
                              checked={Boolean(notificationPrefs[item.id])}
                              onChange={(checked) =>
                                setNotificationPrefs((prev) => ({
                                  ...prev,
                                  [item.id]: checked,
                                }))
                              }
                              className={`${
                                notificationPrefs[item.id]
                                  ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                                  : "bg-gray-200"
                              } relative inline-flex h-6 w-11 items-center rounded-full`}>
                              <span className="sr-only">
                                Enable {item.label}
                              </span>
                              <span
                                className={`${
                                  notificationPrefs[item.id]
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                              />
                            </Switch>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Email Preferences
                      </h3>

                      {/* Email digest frequency */}
                      <div className="space-y-2">
                        <label
                          className="block text-sm font-medium text-gray-700"
                          htmlFor="emailDigest">
                          Email Digest Frequency
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {["daily", "weekly", "monthly"].map((option) => (
                            <div key={option}>
                              <input
                                type="radio"
                                id={option}
                                name="emailDigest"
                                value={option}
                                className="sr-only"
                                checked={
                                  notificationPrefs.emailDigest === option
                                }
                                onChange={() =>
                                  setNotificationPrefs((prev) => ({
                                    ...prev,
                                    emailDigest: option,
                                  }))
                                }
                              />
                              <label
                                htmlFor={option}
                                className={`block w-full p-3 text-center text-sm font-medium rounded-lg cursor-pointer border ${
                                  notificationPrefs.emailDigest === option
                                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}>
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Email notification toggle */}
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Newsletter
                          </h4>
                          <p className="text-sm text-gray-500">
                            Receive our weekly newsletter with platform updates
                            and tips
                          </p>
                        </div>
                        <Switch
                          checked={notificationPrefs.newsletter}
                          onChange={(checked) =>
                            setNotificationPrefs((prev) => ({
                              ...prev,
                              newsletter: checked,
                            }))
                          }
                          className={`${
                            notificationPrefs.newsletter
                              ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                              : "bg-gray-200"
                          } relative inline-flex h-6 w-11 items-center rounded-full`}>
                          <span className="sr-only">Enable newsletter</span>
                          <span
                            className={`${
                              notificationPrefs.newsletter
                                ? "translate-x-6"
                                : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                          />
                        </Switch>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSave()}
                        className="flex items-center gap-2 px-6 py-2 text-white font-medium bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </TabPanel>

                {/* Appearance Panel */}
                <TabPanel>
                  <div className="space-y-8">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <h2 className="text-xl font-bold text-gray-900">
                        Appearance Settings
                      </h2>
                    </div>

                    {/* Theme Selection */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Theme
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {["light", "dark", "system"].map((theme) => (
                          <div
                            key={theme}
                            className="relative">
                            <input
                              type="radio"
                              name="theme"
                              id={`theme-${theme}`}
                              value={theme}
                              checked={appearanceSettings.theme === theme}
                              onChange={() =>
                                setAppearanceSettings((prev) => ({
                                  ...prev,
                                  theme,
                                }))
                              }
                              className="sr-only"
                            />
                            <label
                              htmlFor={`theme-${theme}`}
                              className={`block aspect-video relative rounded-lg border-2 cursor-pointer overflow-hidden
                                ${
                                  appearanceSettings.theme === theme
                                    ? "border-indigo-500 ring-2 ring-indigo-500/20"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}>
                              <div
                                className={`absolute inset-0 ${
                                  theme === "light"
                                    ? "bg-white"
                                    : theme === "dark"
                                    ? "bg-gray-900"
                                    : "bg-gradient-to-br from-white to-gray-900"
                                }`}>
                                {/* Theme preview content */}
                                <div className="absolute top-2 left-2 right-2 h-2 rounded bg-gray-200"></div>
                                <div className="absolute top-6 left-2 w-8 h-2 rounded bg-gray-200"></div>
                                <div className="absolute top-10 left-2 right-2 bottom-2 rounded bg-gray-100"></div>
                              </div>
                              <div className="absolute bottom-2 left-0 right-0 text-center text-xs font-medium">
                                {theme.charAt(0).toUpperCase() + theme.slice(1)}
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Accessibility Options */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Accessibility
                      </h3>

                      <div className="space-y-3">
                        {/* Accessibility toggle items */}
                        {[
                          {
                            id: "reduceMotion" as keyof AppearanceSettings,
                            label: "Reduce Motion",
                            desc: "Minimize animations throughout the app",
                          },
                          {
                            id: "highContrast" as keyof AppearanceSettings,
                            label: "High Contrast",
                            desc: "Increase color contrast for better readability",
                          },
                        ].map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {item.label}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {item.desc}
                              </p>
                            </div>
                            <Switch
                              checked={Boolean(appearanceSettings[item.id])}
                              onChange={(checked) =>
                                setAppearanceSettings((prev) => ({
                                  ...prev,
                                  [item.id]: checked,
                                }))
                              }
                              className={`${
                                appearanceSettings[item.id]
                                  ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                                  : "bg-gray-200"
                              } relative inline-flex h-6 w-11 items-center rounded-full`}>
                              <span className="sr-only">
                                Enable {item.label}
                              </span>
                              <span
                                className={`${
                                  appearanceSettings[item.id]
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                              />
                            </Switch>
                          </div>
                        ))}
                      </div>

                      {/* Font Size Selection */}
                      <div className="space-y-2">
                        <label
                          className="block text-sm font-medium text-gray-700"
                          htmlFor="fontSize">
                          Font Size
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {["small", "medium", "large"].map((size) => (
                            <div key={size}>
                              <input
                                type="radio"
                                id={`fontSize-${size}`}
                                name="fontSize"
                                value={size}
                                className="sr-only"
                                checked={appearanceSettings.fontSize === size}
                                onChange={() =>
                                  setAppearanceSettings((prev) => ({
                                    ...prev,
                                    fontSize: size,
                                  }))
                                }
                              />
                              <label
                                htmlFor={`fontSize-${size}`}
                                className={`block w-full p-3 text-center text-sm font-medium rounded-lg cursor-pointer border ${
                                  appearanceSettings.fontSize === size
                                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}>
                                {size === "small"
                                  ? "Small"
                                  : size === "medium"
                                  ? "Medium"
                                  : "Large"}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Color Accent Selection */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Accent Color
                      </h3>
                      <div className="grid grid-cols-6 gap-3">
                        {[
                          {
                            name: "Default",
                            from: "indigo-500",
                            to: "purple-600",
                          },
                          { name: "Blue", from: "blue-500", to: "cyan-400" },
                          {
                            name: "Green",
                            from: "emerald-500",
                            to: "teal-400",
                          },
                          { name: "Pink", from: "pink-500", to: "rose-400" },
                          {
                            name: "Purple",
                            from: "purple-500",
                            to: "violet-400",
                          },
                          {
                            name: "Orange",
                            from: "orange-500",
                            to: "amber-400",
                          },
                        ].map((color) => (
                          <div
                            key={color.name}
                            className="flex flex-col items-center">
                            <button
                              type="button"
                              className={`w-8 h-8 rounded-full mb-2 shadow-md bg-gradient-to-r from-${color.from} to-${color.to} ring-2 ring-white`}
                              aria-label={`Select ${color.name} accent color`}
                            />
                            <span className="text-xs text-gray-600">
                              {color.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSave()}
                        className="flex items-center gap-2 px-6 py-2 text-white font-medium bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </TabPanel>

                {/* Privacy Panel */}
                <TabPanel>
                  <div className="space-y-8">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <h2 className="text-xl font-bold text-gray-900">
                        Privacy Settings
                      </h2>
                    </div>

                    {/* Profile Privacy */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Profile Privacy
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="profileVisibility">
                            Profile Visibility
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {["public", "followers", "private"].map(
                              (option) => (
                                <div key={option}>
                                  <input
                                    type="radio"
                                    id={`visibility-${option}`}
                                    name="profileVisibility"
                                    value={option}
                                    className="sr-only"
                                    checked={
                                      privacySettings.profileVisibility ===
                                      option
                                    }
                                    onChange={() =>
                                      setPrivacySettings((prev) => ({
                                        ...prev,
                                        profileVisibility: option,
                                      }))
                                    }
                                  />
                                  <label
                                    htmlFor={`visibility-${option}`}
                                    className={`block w-full p-3 text-center text-sm font-medium rounded-lg cursor-pointer border ${
                                      privacySettings.profileVisibility ===
                                      option
                                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}>
                                    {option === "public"
                                      ? "Public"
                                      : option === "followers"
                                      ? "Followers Only"
                                      : "Private"}
                                  </label>
                                </div>
                              )
                            )}
                          </div>
                          <p className="mt-2 text-xs text-gray-500">
                            {privacySettings.profileVisibility === "public"
                              ? "Anyone can view your profile and posts"
                              : privacySettings.profileVisibility ===
                                "followers"
                              ? "Only your followers can view your profile and posts"
                              : "Your profile is completely private"}
                          </p>
                        </div>

                        {/* Privacy toggle items */}
                        <div className="space-y-3 pt-4">
                          {[
                            {
                              id: "activityStatus" as keyof PrivacySettings,
                              label: "Activity Status",
                              desc: "Show when you're active on the platform",
                            },
                            {
                              id: "searchable" as keyof PrivacySettings,
                              label: "Discoverability",
                              desc: "Allow others to find your profile in searches",
                            },
                          ].map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between py-3 border-b border-gray-100">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {item.label}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {item.desc}
                                </p>
                              </div>
                              <Switch
                                checked={Boolean(privacySettings[item.id])}
                                onChange={(checked) =>
                                  setPrivacySettings((prev) => ({
                                    ...prev,
                                    [item.id]: checked,
                                  }))
                                }
                                className={`${
                                  privacySettings[item.id]
                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                                    : "bg-gray-200"
                                } relative inline-flex h-6 w-11 items-center rounded-full`}>
                                <span className="sr-only">
                                  Enable {item.label}
                                </span>
                                <span
                                  className={`${
                                    privacySettings[item.id]
                                      ? "translate-x-6"
                                      : "translate-x-1"
                                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                              </Switch>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Security Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Security
                      </h3>

                      <div className="space-y-4">
                        {/* Two-factor authentication */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Two-Factor Authentication
                              </h4>
                              <p className="text-sm text-gray-600 mb-3">
                                Add an extra layer of security to your account
                                by requiring a verification code in addition to
                                your password.
                              </p>
                            </div>
                            <Switch
                              checked={privacySettings.twoFactorAuth}
                              onChange={(checked) =>
                                setPrivacySettings((prev) => ({
                                  ...prev,
                                  twoFactorAuth: checked,
                                }))
                              }
                              className={`${
                                privacySettings.twoFactorAuth
                                  ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                                  : "bg-gray-200"
                              } relative inline-flex h-6 w-11 items-center rounded-full`}>
                              <span className="sr-only">
                                Enable two-factor authentication
                              </span>
                              <span
                                className={`${
                                  privacySettings.twoFactorAuth
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                              />
                            </Switch>
                          </div>

                          {privacySettings.twoFactorAuth && (
                            <div className="mt-4 border-t border-indigo-100 pt-4">
                              <p className="text-sm font-medium text-gray-700 mb-3">
                                Select your preferred 2FA method:
                              </p>
                              <div className="space-y-2">
                                {["app", "sms", "email"].map((method) => (
                                  <div
                                    key={method}
                                    className="flex items-center">
                                    <input
                                      type="radio"
                                      id={`2fa-${method}`}
                                      name="twoFactorMethod"
                                      value={method}
                                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                    />
                                    <label
                                      htmlFor={`2fa-${method}`}
                                      className="ml-3 text-sm text-gray-700">
                                      {method === "app"
                                        ? "Authenticator App"
                                        : method === "sms"
                                        ? "SMS Text Message"
                                        : "Email"}
                                    </label>
                                  </div>
                                ))}
                              </div>
                              <button
                                type="button"
                                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:opacity-90 transition-opacity">
                                Set Up Two-Factor Authentication
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Data collection consent */}
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Data Collection
                            </h4>
                            <p className="text-sm text-gray-500">
                              Allow us to collect usage data to improve your
                              experience
                            </p>
                          </div>
                          <Switch
                            checked={privacySettings.dataCollection}
                            onChange={(checked) =>
                              setPrivacySettings((prev) => ({
                                ...prev,
                                dataCollection: checked,
                              }))
                            }
                            className={`${
                              privacySettings.dataCollection
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                                : "bg-gray-200"
                            } relative inline-flex h-6 w-11 items-center rounded-full`}>
                            <span className="sr-only">
                              Enable data collection
                            </span>
                            <span
                              className={`${
                                privacySettings.dataCollection
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                            />
                          </Switch>
                        </div>

                        {/* Login history */}
                        <div className="pt-4">
                          <h4 className="font-medium text-gray-900 mb-3">
                            Recent Login Activity
                          </h4>
                          <div className="bg-gray-50 rounded-lg border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                            {[
                              {
                                device: "MacBook Pro",
                                location: "San Francisco, CA",
                                date: "Today, 3:42 PM",
                                current: true,
                              },
                              {
                                device: "iPhone 12",
                                location: "San Francisco, CA",
                                date: "Yesterday, 9:13 AM",
                              },
                              {
                                device: "Windows PC",
                                location: "New York, NY",
                                date: "Apr 21, 2025, 11:52 AM",
                              },
                            ].map((login, idx) => (
                              <div
                                key={idx + 1}
                                className="flex items-center justify-between p-4">
                                <div>
                                  <div className="flex items-center">
                                    <span className="font-medium text-gray-900">
                                      {login.device}
                                    </span>
                                    {login.current && (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        Current
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {login.location} • {login.date}
                                  </div>
                                </div>
                                {!login.current && (
                                  <button
                                    type="button"
                                    className="text-sm text-red-600 hover:text-red-800 font-medium">
                                    Log Out
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end mt-2">
                            <button
                              type="button"
                              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                              View All Activity
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSave()}
                        className="flex items-center gap-2 px-6 py-2 text-white font-medium bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
                        Save Settings
                      </button>
                    </div>
                  </div>
                </TabPanel>

                {/* Billing Panel */}
                <TabPanel>
                  <div className="space-y-8">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <h2 className="text-xl font-bold text-gray-900">
                        Billing & Subscription
                      </h2>
                    </div>

                    {/* Current Plan */}
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              Current Plan
                            </span>
                            <h3 className="text-xl font-bold text-gray-900 mt-1">
                              Pro Plan
                            </h3>
                            <p className="text-gray-600 mt-1">$9.99/month</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:opacity-90 transition-opacity shadow-sm">
                              Upgrade
                            </button>
                            <button
                              type="button"
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
                              Manage
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-indigo-100/50">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Plan Features
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                            {[
                              "Unlimited posts",
                              "Advanced analytics",
                              "Ad-free experience",
                              "Priority support",
                              "Custom themes",
                              "Early access to new features",
                            ].map((feature, idx) => (
                              <li
                                key={idx + 1}
                                className="flex items-center text-gray-700">
                                <CheckIcon className="w-4 h-4 text-indigo-500 mr-2" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 pt-4 border-t border-indigo-100/50">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Next billing date
                              </h4>
                              <p className="text-sm text-gray-600">
                                May 15, 2025
                              </p>
                            </div>
                            <button
                              type="button"
                              className="text-sm text-red-600 hover:text-red-800 font-medium">
                              Cancel Subscription
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          Payment Methods
                        </h3>
                        <button
                          type="button"
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                          Add New
                        </button>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            type: "credit_card",
                            brand: "Visa",
                            last4: "4242",
                            exp: "12/26",
                            default: true,
                          },
                          { type: "paypal", email: "user@example.com" },
                        ].map((method, idx) => (
                          <div
                            key={idx + 1}
                            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center gap-3">
                              <div className="bg-gray-100 p-2 rounded-lg">
                                {method.type === "credit_card" ? (
                                  <CreditCardIcon className="w-5 h-5 text-gray-700" />
                                ) : (
                                  <GlobeAltIcon className="w-5 h-5 text-gray-700" />
                                )}
                              </div>
                              <div>
                                {method.type === "credit_card" ? (
                                  <>
                                    <p className="font-medium text-gray-900">
                                      {method.brand} •••• {method.last4}
                                      {method.default && (
                                        <span className="ml-2 text-xs text-gray-500">
                                          Default
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Expires {method.exp}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="font-medium text-gray-900">
                                      PayPal
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {method.email}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {!method.default &&
                                method.type === "credit_card" && (
                                  <button
                                    type="button"
                                    className="text-sm text-gray-600 hover:text-gray-900">
                                    Set as Default
                                  </button>
                                )}
                              <button
                                type="button"
                                className="text-sm text-red-600 hover:text-red-800">
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Billing History */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Billing History
                      </h3>

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Invoice
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {[
                              {
                                date: "Apr 15, 2025",
                                desc: "Pro Monthly Subscription",
                                amount: "$9.99",
                                status: "Paid",
                              },
                              {
                                date: "Mar 15, 2025",
                                desc: "Pro Monthly Subscription",
                                amount: "$9.99",
                                status: "Paid",
                              },
                              {
                                date: "Feb 15, 2025",
                                desc: "Pro Monthly Subscription",
                                amount: "$9.99",
                                status: "Paid",
                              },
                            ].map((invoice, idx) => (
                              <tr key={idx + 1}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {invoice.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {invoice.desc}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {invoice.amount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
                                    {invoice.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button className="text-indigo-600 hover:text-indigo-900">
                                    Download
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </div>
          </TabGroup>
        </div>
      </div>
    </div>
  );
};

export default Settings;
