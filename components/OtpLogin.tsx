"use client";

import { useState } from "react";
import Details from "./Details";
import { api } from "@/utils/api";
import axios from "axios";

export default function OtpLogin({ phoneNumber }: { phoneNumber: string }) {
  const [otp, setOtp] = useState("");
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGetStart = async () => {
    const updatedOtp = otp.replace(/\s/g, "");
    if (updatedOtp === "") {
      alert("Please provide OTP, that send to your phone number");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/verify-otp", {
        mobile: phoneNumber,
        otp: updatedOtp,
      });

      if (response.data.success) {
        setStarted(true);
      } else {
        alert(response.data.message || "Failed to verify OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Failed to verify OTP");
      } else {
        alert("Failed to verify OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
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
        alert("OTP Resend successfully");
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
                Enter the code we texted you
              </h2>
              <p className="text-base">
                We&apos;ve sent an SMS to {phoneNumber}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[#5C5C5C] text-xs" htmlFor="otp">
                SMS code
              </label>
              <input
                id={"otp"}
                className="h-16 w-full border border-[#CECECE] rounded-xl px-5"
                value={otp}
                onChange={(e) => {
                  let input = e.target.value.replace(/\D/g, "");
                  if (input.length > 3) {
                    input = input.slice(0, 3) + " " + input.slice(3);
                  }
                  setOtp(input);
                }}
              />
            </div>
            <p className="text-xs text-[#5C5C5C]">
              Your 6 digit code is on its way. This can sometimes take a few
              moments to arrive.
            </p>
            <h3
              className="underline text-base text-[#1C3141] font-semibold cursor-pointer"
              onClick={handleResend}>
              Resend code
            </h3>
          </div>
          <div>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleGetStart()}
              className="btn rounded-[10px] h-[45px] w-full bg-[#1C3141] text-white text-base cursor-pointer">
              {loading ? "Verifying..." : "Get started"}
            </button>
          </div>
        </div>
      ) : (
        <Details phoneNumber={phoneNumber} />
      )}
    </>
  );
}
