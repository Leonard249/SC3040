"use client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState, useRef, useEffect } from "react";

const ProfileCard = ({ userDetails, onUpdate }) => {
  // State for all database fields
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    pic_url: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  // Update form data when userDetails prop changes
  useEffect(() => {
    if (userDetails) {
      setFormData({
        username: userDetails.username || "",
        email: userDetails.email || "",
        phone: userDetails.phone || "",
        pic_url: userDetails.pic_url || "/logo.svg",
      });
    }
  }, [userDetails]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        pic_url: imageUrl,
      }));
      setIsEditing(true);
    }
  };

  const handleImgClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create submission object with only the database fields
    const submissionData = {
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      pic_url: formData.pic_url,
    };

    // Only submit if there are actual changes
    if (isEditing) {
      await onUpdate(submissionData);
      setIsEditing(false);
      window.location.reload();
    }
  };

  const hasChanges = () => {
    return (
      formData.username !== userDetails?.username ||
      formData.email !== userDetails?.email ||
      formData.phone !== userDetails?.phone ||
      formData.pic_url !== userDetails?.pic_url
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col mx-5 shadow-xl rounded-md pt-5 pb-10 mt-5 bg-white">
        <div>
          <div className="px-4 space-y-6 md:px-6">
            <header className="flex items-center justify-between w-full py-2">
              <div className="flex items-center space-x-4">
                <img
                  src={formData.pic_url}
                  alt="Avatar"
                  width="96"
                  height="96"
                  className="border rounded-full"
                  style={{ aspectRatio: "96/96", objectFit: "cover" }}
                />
                <div className="space-y-1.5">
                  <h1 className="text-2xl font-bold">
                    {formData.username || "USERNAME"}
                  </h1>
                </div>
              </div>
              <div>
                <Button type="button" size="sm" onClick={handleImgClick}>
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
                    <Label htmlFor="username">Name</Label>
                    <Input
                      id="username"
                      placeholder="Enter your name"
                      value={formData.username}
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
            </div>
            <div className="mt-8">
              <Button
                size="lg"
                type="submit"
                disabled={!isEditing || !hasChanges()}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProfileCard;
