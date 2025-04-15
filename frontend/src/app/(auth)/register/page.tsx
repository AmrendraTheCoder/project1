import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import LoginPage from "@/components/auth/LoginPage";
import { redirect } from "next/navigation"; // Correct import for redirect
import Register from "@/components/auth/RegisterPage";

async function registerPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return <Register />;
}

export default registerPage;
