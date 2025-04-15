import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import LoginPage from "@/components/auth/LoginPage";
import { redirect } from "next/navigation"; // Correct import for redirect

async function loginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return <LoginPage session={session} />;
}

export default loginPage;
