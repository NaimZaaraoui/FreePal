import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseClient";
import { User } from "../types";
import useApp from "../hooks/useApp";

interface UpdateUserParams {
  userId: string;
  changes: Partial<User>;
  profileImage?: File | null;
}

const updateUser = async ({
  userId,
  changes,
  profileImage,
}: UpdateUserParams) => {
  // Check if the userId is valid
  if (!userId) throw new Error("Invalid user ID");
  // Get the current user's info
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("profile_picture_url")
    .eq("id", userId);
  if (userError) throw userError;
  if (userData.length === 0) throw new Error("User not found");

  // Upload profile image if provided

  let profileImageUrl: string | null = userData[0].profile_picture_url;
  if (profileImage) {
    const filePath = `${userId}/${profileImage.name}`;

    // Upload the file to Supabase Storage
    const { error } = await supabase.storage
      .from("profile-pictures")
      .upload(filePath, profileImage);

    if (error) throw error;

    // Get the public URL of the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);

    profileImageUrl = publicUrl;
  }

  const { data, error } = await supabase
    .from("users")
    .update({ ...changes, profile_picture_url: profileImageUrl })
    .eq("id", userId);

  if (error) throw error;
  return data;
};

export const useUpdateUserMutation = () => {
  const { showToast, setError } = useApp();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      showToast({
        type: "success",
        title: "Updated successfully",
        message: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      setError(error.message);
    },
  });
};

const inviteUser = async (email: string) => {
  // Check if the email is valid
  if (!email) throw new Error("Invalid email address");

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);

  if (error) throw error;
  return data;
};

export const useInviteUserMutation = () => {
  const { showToast, setError } = useApp();

  return useMutation({
    mutationFn: inviteUser,
    onSuccess: () => {
      showToast({
        type: "success",
        title: "Invite sent",
        message: "Your invite has been sent successfully.",
      });
    },
    onError: (error) => {
      setError(error.message);
    },
  });
};
