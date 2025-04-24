import { cloneElement, ReactElement } from "react";
import { NavLink } from "react-router";
import { motion } from "motion/react";

interface Props {
  icon: ReactElement<{ className?: string }>;
  label: string;
  to: string;
  badge?: number;
  showLabel?: boolean;
}

const NavItem = ({ icon, label, to, badge, showLabel = false }: Props) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}>
      <NavLink
        to={to}
        className={({ isActive }) => `
        relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all
        ${showLabel ? "min-w-[100px] justify-start" : "justify-center"}
        ${
          isActive
            ? "bg-indigo-50 text-indigo-600"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }
      `}
        aria-label={label}>
        {cloneElement(icon, {
          className: `w-5 h-5 ${showLabel ? "mr-1" : ""}`,
        })}

        {showLabel && <span className="text-sm font-medium">{label}</span>}

        {!showLabel && <span className="sr-only">{label}</span>}

        {badge && (
          <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-medium">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </NavLink>
    </motion.div>
  );
};

export default NavItem;
