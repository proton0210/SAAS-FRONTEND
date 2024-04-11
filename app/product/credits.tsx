import Link from "next/link";
import React from "react";

const Credits = ({ credits }: { credits: number }) => {
  return (
    <div className="absolute top-20 font-sans ">
      Number of credits Available:
      {credits}
      <div>
        <Link href="/pricing" className="text-indigo-500 text-sm">
          Buy more credits
        </Link>
      </div>
    </div>
  );
};

export default Credits;
