import { useMemo } from "react";
import { FaUser } from "react-icons/fa";

interface Props {
  url?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  username?: string;
  className?: string;
  onClick?: () => void;
}

const Avatar = ({ url, size = "md", username, className, onClick }: Props) => {
  const dimensions = useMemo(() => {
    switch (size) {
      case "xs":
        return "w-6 h-6";
      case "sm":
        return "w-8 h-8";
      case "md":
        return "w-10 h-10";
      case "lg":
        return "w-12 h-12";
      case "xl":
        return "w-16 h-16";
      default:
        return "w-10 h-10";
    }
  }, [size]);

  const iconSize = useMemo(() => {
    switch (size) {
      case "xs":
        return "w-3 h-3";
      case "sm":
        return "w-4 h-4";
      case "md":
        return "w-5 h-5";
      case "lg":
        return "w-6 h-6";
      case "xl":
        return "w-8 h-8";
      default:
        return "w-5 h-5";
    }
  }, [size]);

  if (!url) {
    return (
      <div
        className={`${dimensions} rounded-full bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 flex items-center justify-center ${className}`}
        title={username}>
        <FaUser className={`${iconSize} text-white/80`} />
      </div>
    );
  }

  return (
    <div
      className={`${dimensions} rounded-full overflow-hidden bg-gray-800`}
      onClick={onClick}>
      <img
        src={url}
        alt={username ?? "Avatar"}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = ""; // Clear the broken image
          e.currentTarget.onerror = null; // Prevent infinite loop
        }}
      />
    </div>
  );
};

export default Avatar;
