import React from "react";

import { LoaderIcon } from "lucide-react";

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className=" font-semibold text-3xl tracking-tight italic">FitWell</p>

      <LoaderIcon className="animate-spin absolute bottom-10" />
    </div>
  );
}

export default Loader;
