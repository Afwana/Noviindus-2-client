import { api } from "@/utils/api";
import axios from "axios";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Details({ phoneNumber }: { phoneNumber: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [qualification, setQualification] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setProfilePicture(null);
    setPreviewUrl(null);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!qualification.trim()) {
      newErrors.qualification = "Qualification is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleGetStart = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("mobile", phoneNumber);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("qualification", qualification);
      if (profilePicture) {
        formData.append("file", profilePicture);
      }

      const response = await api.post("/auth/create-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        router.push("/instructions");
      } else {
        alert(response.data.message || "Profile creation failed");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Failed to create profile");
      } else {
        alert("Failed to create profile");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(profilePicture);

  return (
    <>
      <div className="flex flex-col justify-between h-full p-7">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 text-[#1C3141]">
            <h2 className="text-2xl font-semibold">Add Your Details</h2>
          </div>
          <div className="flex flex-col gap-5 overflow-y-scroll h-[340px]">
            <div className="relative flex justify-center">
              <label htmlFor="profile-picture" className="cursor-pointer">
                <div className="relative flex items-center justify-center border border-dashed border-[#CECECE] rounded-lg h-32 w-[132px] overflow-hidden">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="profile-picture"
                      objectFit="cover"
                      width={120}
                      height={117}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <ImagePlus className="w-6 h-6" color="#343330" />
                      <p className="text-[#CECECE] text-[9px] font-medium mt-2">
                        Add Your Profile picture
                      </p>
                    </div>
                  )}
                </div>
              </label>
              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 bg-[#1C3141] text-white rounded-full p-1 hover:bg-[#324a63]">
                  <X size={16} />
                </button>
              )}
            </div>
            <input
              id="profile-picture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex flex-col gap-3">
              <label className="text-xs" htmlFor="name">
                Name*
              </label>
              <input
                id={"name"}
                className="h-16 w-full border border-[#CECECE] rounded-xl px-5"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-xs" htmlFor="email">
                Email
              </label>
              <input
                id={"email"}
                className="h-16 w-full border border-[#CECECE] rounded-xl px-5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-xs" htmlFor="qualification">
                Your Qualification*
              </label>
              <select
                id="qualification"
                className="h-16 w-full border border-[#CECECE] rounded-xl px-5 text-[#6B7280]" // Added some text color
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}>
                <option value="">Select your qualification</option>
                <option value="10th">10th Grade</option>
                <option value="12th">12th Grade</option>
                <option value="UG">Under Graduate</option>
                <option value="PG">Post Graduate</option>
                <option value="diploma">Diploma</option>
              </select>
              {errors.qualification && (
                <p className="text-red-500 text-xs">{errors.qualification}</p>
              )}
            </div>
          </div>
        </div>
        <div>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleGetStart()}
            className="btn rounded-[10px] h-[45px] w-full bg-[#1C3141] text-white text-base cursor-pointer">
            {isSubmitting ? "Loading..." : "Get started"}
          </button>
        </div>
      </div>
    </>
  );
}
