import LandingPage from "@/components/home/LandingPage";
import { createClient } from "@/utils/supabase/server";

const Home = async () => {
  // const supabase = await createClient();

  // const { error, data: user } = await supabase.auth.getUser();

  return <LandingPage />;
};

export default Home;
