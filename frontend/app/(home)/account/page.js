"use client";
import ProfileCard from "@/components/ProfileCard";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/hooks/Auth";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:8888/v1/common/user";

const Page = () => {
  const { user, loading } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user && user.user_id) {
        try {
          const response = await fetch(`${API_URL}/${user.user_id}`);
          const data = await response.json();
          console.log("User data fetched:", data);
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
    return null;
  }

  const handleUpdateProfile = async (updatedData) => {
    try {
      const response = await fetch(`${API_URL}/${user.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUserData = await response.json();
      setUserData(updatedUserData);
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="mt-10 flex flex-col">
      <h1 className="text-2xl font-semibold leading-10">Account Details</h1>
      {userData ? (
        <ProfileCard userDetails={userData} onUpdate={handleUpdateProfile} />
      ) : (
        <div>Loading Profile...</div>
      )}
    </div>
  );
};

export default Page;
