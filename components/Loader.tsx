import { LoaderCircle } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center w-full h-[calc(100vh-100px)]">
      <LoaderCircle className="animate-spin h-5 w-5 text-foreground" />
    </div>
  );
};

export default Loader;
