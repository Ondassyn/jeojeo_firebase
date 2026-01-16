import React from "react";
import "./loader.css";

const Loader = ({ colorClass = "text-neutral-700" }) => {
  return (
    <div
      className={`loader ${colorClass}`}
      style={
        {
          // This tells the CSS to use the "currentColor" of the Tailwind class
          "--loader-color": "currentColor",
        } as React.CSSProperties
      }
    />
  );
};

export default Loader;
