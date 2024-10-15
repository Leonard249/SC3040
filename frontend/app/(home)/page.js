"use client";
import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/hooks/Auth";
import LogoutButton from "@/components/LogoutButton";

const HomePage = () => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>Welcome Home!</h1>
      <p>You are logged in as {user?.user_id}</p>
      <LogoutButton /> {/* Add a logout button */}
    </div>
  );
};
export default HomePage;
