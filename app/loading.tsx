import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
};

export default Loading;
