import { getFilesFromDB, downloadFilesFromDB } from "./db_requests.js";
import supabase from "../config/supabaseClient.js";
import {
  isDocumentIndexed,
  uploadSingleFileToBackboard,
} from "../backboard/docUploader.js";
import { getUserAssistant } from "../backboard/assistant.js";
import backboard from "../config/backboardClient.js";
import { writeFile } from "fs/promises";

export default async (questions, user_id) => {
  const backboardURL = `https://app.backboard.io/api`;

  // ASSISTANT
  const assistant = await getUserAssistant(user_id);
  const assistantId = assistant.data.id;

  // THREAD CREATION
  const thread_res = await fetch(
    `${backboardURL}/assistants/${assistantId}/threads`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": `${process.env.BACKBOARD_KEY}`,
      },
      body: JSON.stringify({}),
    }
  );

  const threadObject = await thread_res.json();
  const thread = threadObject.thread_id;

  console.log("THREAD ID: ", thread);

  // const thread_resp = await backboard.addMessage(thread, {
  //   content: "what is my name and favorite color",
  //   llm_provider: "openai",
  //   model_name: "gpt-4o",
  //   stream: true,
  // });

  // for await (const chunk of thread_resp) {
  //   if (chunk.type === "content_streaming") {
  //     process.stdout.write(chunk.content || "");
  //   } else if (chunk.type === "message_complete") {
  //     break;
  //   }
  // }

  // 4. INDEXING PHASE (The Fix)
  // console.log("⏳ Waiting for Backboard to index files...");
  // await Promise.all(
  //   uploadedDocIds.map((docId) => isDocumentIndexed(docId, backboardURL))
  // );

  const msgFormData = new FormData()
  let prompt = `You will receive questions provided by you and user answers to those questions at the end of this message.
  Send back two parameters per question (again, separated by '~' between parameter, and one line/row of parameters for each question). The first parameter must be a 'YES' if the answer is correct and 'NO' if the answer is not correct. 
  For short answer questions and long answer questions, grade them as if you are a university level teacher (if the answer is correct enough, about 80% correct then it should be treated as a correct answer).
  For the second paramter output the most correct answer you can come up with (for more theoretical/variable questions), or just the correct answer for more numerical problems.
  DO NOT OUTPUT ANY TEXT OTHER THAN THE PARAMTERES SEPARATED LINE-BY-LINE PER QUESTION
  
  Here are the questions and answers:
  
  `

  questions.forEach((question, index) => {
    let line = ""

    line = line + `${index + 1}. ${question.question}\nUser Answer: ${question.userAnswer}`

    prompt = prompt + line
  })

  // Send a message and stream the response
  const stream = await backboard.addMessage(thread, {
    content: prompt,
    llm_provider: 'openai',
    model_name: 'gpt-4o',
    stream: true,
    // web_search: 'Auto'
  });

  let output = ""

  // Print each chunk of content as it arrives
  for await (const chunk of stream) {
    if (chunk.type === 'content_streaming') {
      output = output + chunk.content
      // process.stdout.write(chunk.content || '');
    } else if (chunk.type === 'message_complete') {
      break;
    }
  }
  
  console.log(output)

//   const lines = output.split(/\r?\n/);

//   lines.forEach((line) => {
//     const params = line.split("~")

//     console.log("PARAMS: ", params)

//     const question = {
//       question: params[0],
//       type: params[1],
//       options: params[1] === "multiple-choice" ? params[2].split(",").map(option => option.trim()) : [],
//       correctAnswer: params[3]
//     }

//     questions.push(question)
//   })
  

  // msgFormData.append('content', prompt)
  // msgFormData.append('llm_provider', '')
  // msgFormData.append('model_name', '')
  // msgFormData.append('stream', 'false')
  // msgFormData.append('memory', 'off')
  // msgFormData.append('web_search', 'off')
  // msgFormData.append('send_to_llm', 'true')
  // msgFormData.append('metadata', '')

  // const msgResponse = await fetch(`${backboardURL}/threads/${thread}/messages`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //     'X-API-Key': `${process.env.BACKBOARD_KEY}`,
  //   },
  //   body: msgFormData,
  // })

  // const msgJson = await msgResponse.json();
  
  // console.log("MESSAGE REPLY: ", msgJson)

  console.log("✅ All files ready. Deleting thread...");

  // 5. CLEANUP
  // Now it is safe to delete the thread or generate questions
  await fetch(`${backboardURL}/threads/${thread}`, {
    method: "DELETE",
    headers: { "X-API-Key": process.env.BACKBOARD_KEY },
  });

  // TODO: actually return the questions
  return output;
};
