import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import supabase from "@/config/supabaseClient";
import { Question } from "@/types/exam";

export const useExamSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examTitle, setExamTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // If this exists, we are in "Retake/Update" mode
  const examId = location.state?.examId; 

  useEffect(() => {
    const initSession = async () => {
      // SCENARIO A: RETAKE (We have an ID -> Fetch & Overwrite)
      if (examId) {
        const { data, error } = await supabase
          .from("exams")
          .select("*")
          .eq("id", examId)
          .single();

        if (error) {
          navigate("/dashboard");
          return;
        }

        // Clean previous answers so the UI is fresh
        const cleanQuestions = data.questions.map((q: Question) => {
          const { userAnswer, ...rest } = q;
          return rest;
        });

        setQuestions(cleanQuestions);
        setExamTitle(data.title);
        setIsLoading(false);
        return;
      }

      // SCENARIO B: NEW EXAM (No ID -> Load from State)
      const stateQuestions = location.state?.questions;
      const stateTitle = location.state?.examTitle;

      if (stateQuestions) {
        setQuestions(stateQuestions);
        setExamTitle(stateTitle || "New Exam");
        setIsLoading(false);
      } else {
        navigate("/dashboard");
      }
    };

    initSession();
  }, [examId, navigate, location.state]);

  return { questions, setQuestions, examTitle, examId, isLoading };
};