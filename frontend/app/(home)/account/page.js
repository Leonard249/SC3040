"use client";
import ProfileCard from "@/components/ProfileCard";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/hooks/Auth";
import { FAKE_USER } from "@/lib/constants";
import { useRouter } from "next/navigation";

const page = () => {
  const { user, loading } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user && user.user_id) {
        try {
          const token = localStorage.getItem("token");
          // const response = await fetch(`
          // const data = await response.json()
          const data = FAKE_USER;
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    if (!loading) {
      fetchUserDetails();
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading ...</div>;
  }

  if (!user) {
    router.push("/sign-in");
  }

  return (
    <div className="mt-10 flex flex-col">
      <h1 className="text-2xl font-semibold leading-10">Account Details</h1>
      {userData ? (
        <ProfileCard userData={userData} />
      ) : (
        <div>Loading Profile...</div>
      )}
    </div>
  );
};

export default page;
