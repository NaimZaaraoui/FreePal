import { cloneElement, ReactElement } from "react";
import { Link } from "react-router";

interface Props {
  icon: ReactElement<{ className?: string }>;
  label: string;
  to: string;
  onClick?: () => void;
}

const MenuLink = ({ icon, label, to, onClick }: Props) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
      onClick={onClick}>
      {cloneElement(icon, { className: "w-5 h-5" })}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default MenuLink;
