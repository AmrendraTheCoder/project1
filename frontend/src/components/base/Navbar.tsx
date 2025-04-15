import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import NavbarClient from "../common/NavbarClient";

async function Navbar() {
  const session = await getServerSession(authOptions);

  return <NavbarClient session={session} />;
}

export default Navbar;
