"use client";

import Header from "@/components/layout/Header";
import { Copy, CopyCheck, CopySlash, CopyX } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const totalMark = 100;
  const markOptained = 90;
  const totalQuestions = 100;
  const correctAns = 56;
  const incorrecrAns = 19;
  const notAttend = 25;
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <Header />
      <div className="flex justify-center items-start mx-auto w-full bg-[#F4FCFF]">
        <div className="flex flex-col gap-3 p-5">
          <div className="h-[150px] w-full md:w-[430px] bg-gradient-to-br from-[#177A9C] to-[#1C3141] rounded-lg flex justify-center items-center text-white p-3">
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg font-medium">Marks Obtained:</p>
              <p className="text-[68px] font-medium">{`${markOptained} / ${totalMark}`}</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-[31px] w-[31px] flex items-center justify-center bg-[#DDA428] rounded-[6px]">
                <Copy color="white" size={14} />
              </div>
              <p className="text-sm text-[#1C3141]">Total Questions:</p>
            </div>
            <p className="text-lg font-bold">{totalQuestions}</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-[31px] w-[31px] flex items-center justify-center bg-[#4CAF50] rounded-[6px]">
                <CopyCheck color="white" size={14} />
              </div>
              <p className="text-sm text-[#1C3141]">Correct Answers:</p>
            </div>
            <p className="text-lg font-bold">{correctAns}</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-[31px] w-[31px] flex items-center justify-center bg-[#EE3535] rounded-[6px]">
                <CopyX color="white" size={14} />
              </div>
              <p className="text-sm text-[#1C3141]">Incorrect Answers:</p>
            </div>
            <p className="text-lg font-bold">{incorrecrAns}</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-[31px] w-[31px] flex items-center justify-center bg-[#5C5C5C] rounded-[6px]">
                <CopySlash color="white" size={14} />
              </div>
              <p className="text-sm text-[#1C3141]">Not Attended Questions:</p>
            </div>
            <p className="text-lg font-bold">{notAttend}</p>
          </div>

          <div className="mt-5 flex justify-center items-center">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="btn rounded-[10px] h-[46px] w-full md:w-[429px] bg-[#1C3141] text-white text-base cursor-pointer">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
