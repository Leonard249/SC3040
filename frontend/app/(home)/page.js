"use client";
import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/hooks/Auth";
import LogoutButton from "@/components/LogoutButton";
import Home from "@/components/Home";

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
      <Home></Home>
    </div>
  );
};
export default HomePage;
