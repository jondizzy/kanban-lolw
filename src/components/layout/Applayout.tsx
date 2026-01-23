import React from "react";
import { Outlet } from "react-router";

const Applayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Applayout;
