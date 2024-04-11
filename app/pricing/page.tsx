import Pricing from "@/components/Pricing";
import { auth } from "@clerk/nextjs";

const page = async () => {
  const { userId: clerkId } = auth();
  if (!clerkId) return null;

  return <Pricing clerkId={clerkId} />;
};
export default page;
