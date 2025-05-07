import { PropsWithChildren } from "react";

const Header = ({ children }: PropsWithChildren) => {
  return <div className="text-3xl font-semibold text-black my-4 dark:text-white/90">{children}</div>;
};

export default Header;
