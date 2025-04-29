"use client";

import { useState } from "react";
import OtpLogin from "./OtpLogin";
import axios from "axios";
import { api } from "@/utils/api";

export default function GetStarted() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGetStart = async () => {
    if (phoneNumber === "") {
      alert("Please provide a phone number");
      return;
    }

    const phoneRegex = /^\+91\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert("Invalid mobile number, please provide valid one");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/send-otp", {
        mobile: phoneNumber,
      });

      if (response.data.success) {
        setStarted(true);
      } else {
        alert(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Failed to send OTP");
      } else {
        alert("Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!started ? (
        <div className="flex flex-col justify-between h-full p-7">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 text-[#1C3141]">
              <h2 className="text-2xl font-semibold">
                Enter your phone number
              </h2>
              <p className="text-base">
                We use your mobile number to identify your account
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[#5C5C5C] text-xs" htmlFor="phoneNumber">
                phone number
              </label>
              <input
                id={"phoneNumber"}
                className="h-16 w-full border border-[#CECECE] rounded-xl px-5"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value.replace(/\s+/g, ""))
                }
              />
            </div>
            <p className="text-xs">
              <span>By tapping Get started, you agree to the</span>{" "}
              <span className="font-medium">Terms & Conditions</span>
            </p>
          </div>
          <div>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleGetStart()}
              className="btn rounded-[10px] h-[45px] w-full bg-[#1C3141] text-white text-base cursor-pointer">
              {loading ? "Send OTP..." : "Get started"}
            </button>
          </div>
        </div>
      ) : (
        <OtpLogin phoneNumber={phoneNumber} />
      )}
    </>
  );
}
