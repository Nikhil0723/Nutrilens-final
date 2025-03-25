"use client";

import dynamic from "next/dynamic";
import React from "react";

const ScanPage = dynamic(() => import("@/components/ScanPage"), {
  ssr: false,
});

const Page = () => {
  return <ScanPage />;
};

export default Page;
