import React from "react";
import { LoadingSpinner } from "../shared/LoadingSpinner";

export default function LoadingScreen() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    </div>
  );
}
