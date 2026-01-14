import supabase from "../config/supabaseClient.js";
import backboard from "../config/backboardClient.js";

export async function createNewAssistant(user_id) {
  const assistant = await backboard.createAssistant({
    name: "Exam Generator",
    // TODO: incredible prompt
    description:
      "An assistant that can analyze documents and make exams based on those documents: you follow format specifications",
  });

  const { data, error } = await supabase
    .from("assistants")
    .insert([{ id: assistant.assistantId, user_id }]);

  if (error) {
    console.log("an error occured, supabase assistant creation: ", error);
    return false;
  }

  return true;
}

export async function getUserAssistant(user_id) {
  const assistant = await supabase
    .from("assistants")
    .select("*")
    .eq("user_id", user_id)
    .maybeSingle();

  return assistant;
}

export async function getAllAssistants() {
  const response = await fetch(`${process.env.BACKBOARD_URL}/assistants`, {
    headers: {
      "X-API-KEY": `${process.env.BACKBOARD_KEY}`,
    },
  });

  const assistants = await response.json();
  return assistants;
}
