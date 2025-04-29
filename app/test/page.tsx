"use client";

import Header from "@/components/layout/Header";
import { Clock, LetterText, StepForward } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ComprehensiveModal from "@/components/ComprehensiveModal";
import SubmitTestModal from "@/components/SubmitTestModal";
import { api } from "@/utils/api";

interface IQuestionOption {
  key: string;
  value: string;
}

interface Questions {
  id: number;
  ques: string;
  attachments: string;
  options: IQuestionOption[];
  correctAnswer: string;
  marks: number;
  negativeMark: number;
}

// interface IQuestionApiResponse {
//   success: boolean;
//   questions_count: number;
//   total_marks: number;
//   total_time: number;
//   time_for_each_question: number;
//   mark_per_each_answer: number;
//   negative_mark: number;
//   instruction: string;
//   questions: Questions[];
// }

export default function Page() {
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [questionStatus, setQuestionStatus] = useState<Record<number, string>>(
    {}
  );
  const [timeLeft, setTimeLeft] = useState(90 * 60);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        console.log(token);

        const response = await api.get("/question/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuestions(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again later.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenSubmitModal = () => {
    setIsTimerRunning(false);
    setIsSubmitModalOpen(true);
  };

  const handleCloseSubmitModal = () => {
    setIsTimerRunning(true);
    setIsSubmitModalOpen(false);
  };

  const handleOptionChange = (key: string) => {
    setSelectedOption(key);
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption) {
      setQuestionStatus((prev) => ({
        ...prev,
        [currentQuestion.id]: "attended",
      }));
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedOption,
      }));
    } else {
      setQuestionStatus((prev) => ({
        ...prev,
        [currentQuestion.id]: "not-attended",
      }));
    }
    setSelectedOption(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleOpenSubmitModal();
    }
  };

  const handleMarkForReview = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption) {
      setQuestionStatus((prev) => ({
        ...prev,
        [currentQuestion.id]: "answered-marked",
      }));
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedOption,
      }));
    } else {
      setQuestionStatus((prev) => ({
        ...prev,
        [currentQuestion.id]: "marked",
      }));
    }
    setSelectedOption(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      handleOpenSubmitModal();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const answeredCount =
    Object.keys(questionStatus).filter(
      (key) => questionStatus[Number(key)] === "attended"
    ).length +
    Object.keys(questionStatus).filter(
      (key) => questionStatus[Number(key)] === "answered-marked"
    ).length;
  const markedForReviewCount = Object.keys(questionStatus).filter(
    (key) => questionStatus[Number(key)] === "marked"
  ).length;

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsTimerRunning(false);
      handleOpenSubmitModal();
    }
  }, [timeLeft]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-sm">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-sm">No questions available</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  return (
    <div className="flex flex-col gap-2 w-full">
      <Header />
      <div className="flex flex-col md:flex-row w-full justify-between items-start bg-[#F4FCFF] pt-3">
        <div className="flex flex-col gap-3 md:border-r border-[#E9EBEC] px-5">
          <div className="flex justify-between items-center p-2">
            <p className="text-lg font-medium text-[#1C3141]">
              Ancient Indian History MCQ
            </p>
            <p className="bg-white rounded-sm text-[16px] font-medium p-2 shadow-lg">
              {`${currentQuestion.id}/100`}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 bg-white rounded-[10px] p-5 shadow-lg">
              <button
                type="button"
                onClick={handleOpenModal}
                className="btn rounded-[10px] h-11 w-[293px] bg-[#177A9C] cursor-pointer flex justify-between items-center">
                <div className="flex justify-center items-center w-5 h-5 bg-white rounded-sm ms-4">
                  <LetterText size={14} color="#177A9C" className="" />
                </div>
                <span className="text-white text-[13px] font-medium">
                  Read Comprehensive Paragraph
                </span>
                <div className="flex justify-center items-center w-3.5 h-2 me-4">
                  <StepForward color="white" />
                </div>
              </button>
              <p className="text-lg font-medium text-[#1C3141]">
                {`${currentQuestion?.id}. ${currentQuestion?.ques}`}
              </p>
              {currentQuestion.attachments && (
                <div className="relative h-[161px] w-[288px]">
                  <Image
                    src={currentQuestion.attachments}
                    alt="attachment"
                    fill
                    objectFit="cover"
                    className="rounded-[10px]"
                  />
                </div>
              )}
            </div>
            <p className="text-[#5C5C5C] text-sm font-medium">
              Choose the answer:
            </p>
            {currentQuestion.options.map((opt) => (
              <label
                key={opt.key}
                className="flex items-center justify-between border border-[#CECECE] rounded-[8px] w-full h-14 px-5 cursor-pointer">
                <span>{`${opt.key}. ${opt.value}`}</span>
                <input
                  type="radio"
                  value={opt.key}
                  checked={selectedOption === opt.key}
                  onChange={() => handleOptionChange(opt.key)}
                  className="w-5 h-5"
                  color="#49454F"
                />
              </label>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleMarkForReview}
              className="btn rounded-[10px] h-[46px] w-full bg-[#800080] text-white text-base cursor-pointer">
              Mark for review
            </button>
            <button
              type="button"
              onClick={handlePrevious}
              className="btn rounded-[10px] h-[46px] w-full bg-[#CECECE] text-black text-base cursor-pointer"
              disabled={currentQuestionIndex === 0}>
              Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="btn rounded-[10px] h-[46px] w-full bg-[#1C3141] text-white text-base cursor-pointer">
              {currentQuestionIndex === questions.length - 1 ? "Save" : "Next"}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3 p-3 w-full md:w-[674px] ms-4 md:ms-0">
          <div className="flex justify-between items-center">
            <p className="text-base font-medium text-[#1C3141]">
              Question No. Sheet:
            </p>
            <div className="flex gap-2 items-center text-base font-medium">
              <p>Remaining Time:</p>
              <p className="bg-black rounded-sm text-base font-medium p-2 shadow-lg text-white timer-div flex items-center gap-2">
                <Clock size={16} /> {formatTime(timeLeft)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-5 lg:grid-cols-10 gap-2 mt-4">
            {Array.from({ length: 100 }, (_, index) => {
              const qNum = index + 1;
              const status = questionStatus[qNum];
              let className =
                "border rounded-lg h-[54px] w-[54px] flex justify-center items-center text-[#1C3141] text-lg font-medium";

              if (status === "attended") {
                className += " bg-[#4CAF50] text-white";
              } else if (status === "not-attended") {
                className += " bg-[#EE3535] text-white";
              } else if (status === "marked") {
                className += " bg-[#800080] text-white";
              } else if (status === "answered-marked") {
                className +=
                  " border-4 border-[#4CAF50] bg-[#800080] text-white";
              }

              return (
                <div key={qNum} className={className}>
                  {qNum}
                </div>
              );
            })}
          </div>
          <div className="flex flex-col lg:flex-row justify-between lg:items-center w-full">
            <div className="flex gap-2 items-center">
              <p className="border rounded-[4px] h-4 w-4 bg-[#4CAF50] border-[#CECECE]"></p>
              <p className="text-[13px] font-semibold">Attended</p>
            </div>
            <div className="flex gap-2 items-center">
              <p className="border rounded-[4px] h-4 w-4 bg-[#EE3535] border-[#CECECE]"></p>
              <p className="text-[13px] font-semibold">Not Attended</p>
            </div>
            <div className="flex gap-2 items-center">
              <p className="border rounded-[4px] h-4 w-4 bg-[#800080] border-[#CECECE]"></p>
              <p className="text-[13px] font-semibold">Marked For Review</p>
            </div>
            <div className="flex gap-2 items-center">
              <p className="border-3 rounded-[4px] h-4 w-4 bg-[#4CAF50] border-[#800080]"></p>
              <p className="text-[13px] font-semibold">
                Answered and Marked For Review
              </p>
            </div>
          </div>
        </div>
      </div>
      <ComprehensiveModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <SubmitTestModal
        isOpen={isSubmitModalOpen}
        onClose={handleCloseSubmitModal}
        remainingTime={formatTime(timeLeft)}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        markedForReviewCount={markedForReviewCount}
        answers={answers}
      />
    </div>
  );
}
