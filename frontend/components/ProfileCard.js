"use client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState, useRef } from "react";

const ProfileCard = ({ userDetails }) => {
  const [selectedImg, setSelectedImg] = useState(
    userDetails?.profilePic || "/logo.svg"
  );
  const [formData, setFormData] = useState({
    name: userDetails?.name || "",
    email: userDetails?.email || "",
    phone: userDetails?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImg(imageUrl);
    }
  };

  const handleImgClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // try {
    //   const token = localStorage.getItem("token");
    //   const response = await fetch(
    //     `https://your-backend-api.com/update-user/${userDetails.user_id}`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`, // Authenticate with token
    //       },
    //       body: JSON.stringify(formData),
    //     }
    //   );

    //   if (response.ok) {
    //     alert("Profile updated successfully");
    //   } else {
    //     alert("Failed to update profile");
    //   }
    // } catch (error) {
    //   console.error("Error updating profile:", error);
    // }

    try {
      const token = localStorage.getItem("token");
      // const response = await fetch

      if (FAKE_RESPONSE_TRUE.ok) {
        alert("Profile Updated");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col mx-5 shadow-xl rounded-md pt-5 pb-10 mt-5 bg-white">
        <div>
          <div className="px-4 space-y-6 md:px-6">
            <header className="flex items-center justify-between w-full py-2">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedImg}
                  alt="Avatar"
                  width="96"
                  height="96"
                  className="border rounded-full"
                  style={{ aspectRatio: "96/96", objectFit: "cover" }}
                />
                <div className="space-y-1.5">
                  <h1 className="text-2xl font-bold">
                    {formData.name || "USERNAME"}
                  </h1>
                </div>
              </div>
              <div>
                <Button size="sm" onClick={handleImgClick}>
                  Change Picture
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </header>
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Change Password</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      placeholder="Enter your current password"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      placeholder="Enter your new password"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      placeholder="Confirm your new password"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Button size="lg" type="submit">
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProfileCard;
