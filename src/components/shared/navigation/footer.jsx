import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="w-full p-4 border-t border-default shadow-sm bg-card md:flex md:items-center md:justify-between md:p-6"
      role="contentinfo"
    >
      {/* Left Section */}
      <span className="block text-sm text-body text-center sm:w-full md:max-w-sm md:text-left lg:max-w-fit">
        All Rights Reserved © {new Date().getFullYear()} Designed and Developed
        by{" "}
        <a
          href="https://nimittech.com"
          className="hover:underline ml-1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Nimit Technologies Private Limited website"
        >
          Nimit Technologies Private Limited
        </a>
      </span>

      {/* Right Section */}
      <ul
        className="flex justify-center md:justify-end mt-3 md:mt-0 text-sm font-medium text-body space-x-4"
        aria-label="Footer navigation"
      >
        <li>
          <Link
            to="/developer-support"
            className="hover:underline"
            aria-label="Developer support page"
          >
            Developer Support
          </Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
