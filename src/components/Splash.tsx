"use client";

import React, { useEffect, useState } from "react";

const Splash: React.FC = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return <div className="splash-screen"></div>;
};

export default Splash;
