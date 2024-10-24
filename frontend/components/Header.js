import React from "react";
import HeaderLogo from "./HeaderLogo";
import Navigation from "./Navigation";

const Header = () => {
  return (
    <header className="bg-gradient-to-b from-bananaYellow to-bananaYellow-light px-4 py-8 lg:px-14 pb-18">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-5">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <Navigation />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
