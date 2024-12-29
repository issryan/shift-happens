import React from "react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ paths }) => (
  <nav className="flex text-sm text-gray-600 mb-4">
    {paths.map((path, index) => (
      <span key={index} className="flex items-center">
        {path.to ? (
          <Link to={path.to} className="text-blue-500 hover:underline">
            {path.label}
          </Link>
        ) : (
          <span>{path.label}</span>
        )}
        {index < paths.length - 1 && <span className="mx-2">/</span>}
      </span>
    ))}
  </nav>
);

export default Breadcrumbs;