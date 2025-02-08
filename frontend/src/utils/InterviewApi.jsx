const MOCK_QUESTIONS = [
  {
    id: 1,
    text: "Tell me about a challenging project you worked on and how you overcame the obstacles you faced.",
    category: "Experience",
    difficulty: "Medium",
    timeLimit: 180,
  },
  {
    id: 2,
    text: "How do you handle conflicts in a team environment?",
    category: "Behavioral",
    difficulty: "Medium",
    timeLimit: 180,
  },

  {
    id: 3,
    text: "Where do you see yourself in five years?",
    category: "Career Goals",
    difficulty: "Easy",
    timeLimit: 120,
  },
  {
    id: 4,
    text: "Describe a situation where you had to learn a new technology quickly.",
    category: "Technical",
    difficulty: "Hard",
    timeLimit: 240,
  },
];

const MOCK_TRANSCRIPTS = {
  1: "In my previous role, I led a challenging project to migrate our legacy system to a modern cloud infrastructure. We faced significant technical debt and tight deadlines. I broke down the project into smaller milestones, implemented automated testing, and maintained clear communication with stakeholders. Through careful planning and team collaboration, we successfully completed the migration ahead of schedule.",
  2: "I believe in addressing conflicts directly but professionally. In a recent situation, I had differing opinions with a colleague about the technical approach to a project. I scheduled a private meeting to discuss our perspectives, actively listened to their concerns, and worked together to find a solution that incorporated the best aspects of both approaches.",
  3: "In five years, I aim to have grown into a technical lead role where I can mentor junior developers while still maintaining hands-on development work. I'm particularly interested in advancing my expertise in distributed systems and contributing to open-source projects in that domain.",
  4: "When our team needed to implement a new GraphQL API, I had to quickly learn the technology stack. I dedicated extra hours to studying the documentation, built small proof-of-concept projects, and paired with experienced team members. Within two weeks, I was able to contribute meaningfully to the project and eventually helped other team members adopt the technology.",
};

// export const api = {
//   getQuestions: async () => {
//     // Simulate API delay
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     return MOCK_QUESTIONS;
//   },

//   submitAnswer: async (questionId, audioBlob) => {
//     try {
//       // 1. Upload audio to Assembly AI
//       const uploadResponse = await fetch(
//         "https://api.assemblyai.com/v2/upload",
//         {
//           method: "POST",
//           headers: {
//             Authorization: process.env.REACT_APP_ASSEMBLY_AI_KEY,
//           },
//           body: audioBlob,
//         }
//       );

//       const { upload_url } = await uploadResponse.json();

//       // 2. Request transcription
//       const transcriptResponse = await fetch(
//         "https://api.assemblyai.com/v2/transcript",
//         {
//           method: "POST",
//           headers: {
//             Authorization: process.env.REACT_APP_ASSEMBLY_AI_KEY,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             audio_url: upload_url,
//           }),
//         }
//       );

//       const { id: transcriptId } = await transcriptResponse.json();
//       // 3. Poll for transcription completion
//       let transcript;
//       while (true) {
//         const pollingResponse = await fetch(
//           `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
//           {
//             headers: {
//               Authorization: process.env.REACT_APP_ASSEMBLY_AI_KEY,
//             },
//           }
//         );

//         const result = await pollingResponse.json();

//         if (result.status === "completed") {
//           transcript = result.text;
//           break;
//         } else if (result.status === "error") {
//           throw new Error("Transcription failed");
//         }

//         await new Promise((resolve) => setTimeout(resolve, 1000));
//       }

//       return {
//         success: true,
//         transcript,
//         questionId,
//       };
//     } catch (error) {
//       console.error("Error processing answer:", error);
//       throw error;
//     }
//   },

//   // store transcript in local storage
//   storeAnswer: async (questionId, transcript) => {
//     try {
//       const answers = JSON.parse(
//         localStorage.getItem("interviewAnswers") || "{}"
//       );
//       answers[questionId] = transcript;
//       localStorage.setItem("interviewAnswers", JSON.stringify(answers));
//       return { success: true };
//     } catch (err) {
//       console.error("Error storing answer:", err);
//       throw err;
//     }
//   },

//   // method to get all answers from local storage
//   getResults: async () => {
//     try {
//       const answers = JSON.parse(
//         localStorage.getItem("interviewAnswers") || "{}"
//       );
//       return answers;
//     } catch (err) {
//       console.error("Error getting results:", err);
//     }
//   },
// };

// original code commented out ...

// Temporary test service
export const api = {
  getQuestions: async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return MOCK_QUESTIONS;
  },

  submitAnswer: async (questionId, audioBlob) => {
    try {
      // Debug logs
      console.log("ENV:", {
        key: import.meta.env.VITE_ASSEMBLY_AI_KEY,
        exists: !!import.meta.env.VITE_ASSEMBLY_AI_KEY,
        length: import.meta.env.VITE_ASSEMBLY_AI_KEY?.length,
      });

      // 1. Upload audio to Assembly AI
      const uploadResponse = await fetch(
        "https://api.assemblyai.com/v2/upload",
        {
          method: "POST",
          headers: {
            Authorization: import.meta.env.VITE_ASSEMBLY_AI_KEY,
          },
          body: audioBlob,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error(
          `Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`
        );
      }

      const uploadData = await uploadResponse.json();
      const upload_url = uploadData.upload_url;
      console.log("Upload successful, URL:", upload_url);

      // 2. Request transcription
      const transcriptResponse = await fetch(
        "https://api.assemblyai.com/v2/transcript",
        {
          method: "POST",
          headers: {
            Authorization: `${import.meta.env.VITE_ASSEMBLY_AI_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            audio_url: upload_url,
          }),
        }
      );

      if (!transcriptResponse.ok) {
        throw new Error(
          `Transcription request failed: ${transcriptResponse.status} ${transcriptResponse.statusText}`
        );
      }

      const transcriptData = await transcriptResponse.json();
      const transcriptId = transcriptData.id;
      console.log("Transcription requested, ID:", transcriptId);

      // 3. Poll for completion
      let transcript;
      while (true) {
        const pollingResponse = await fetch(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          {
            headers: {
              Authorization: `${import.meta.env.VITE_ASSEMBLY_AI_KEY}`,
            },
          }
        );

        if (!pollingResponse.ok) {
          throw new Error(
            `Polling failed: ${pollingResponse.status} ${pollingResponse.statusText}`
          );
        }

        const result = await pollingResponse.json();
        console.log("Polling status:", result.status);

        if (result.status === "completed") {
          transcript = result.text;
          console.log("Transcription completed:", transcript);
          break;
        } else if (result.status === "error") {
          throw new Error(`Transcription failed: ${result.error}`);
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      return {
        success: true,
        transcript,
        questionId,
      };
    } catch (error) {
      console.error("Error processing answer:", error);
      throw error;
    }
  },

  // store transcript in local storage
  storeAnswer: async (questionId, transcript) => {
    try {
      const answers = JSON.parse(
        localStorage.getItem("interviewAnswers") || "{}"
      );
      answers[questionId] = transcript;
      localStorage.setItem("interviewAnswers", JSON.stringify(answers));
      return { success: true };
    } catch (err) {
      console.error("Error storing answer:", err);
      throw err;
    }
  },

  // method to get all answers from local storage
  getAnswers: async () => {
    try {
      const answers = JSON.parse(
        localStorage.getItem("interviewAnswers") || "{}"
      );
      return answers;
    } catch (err) {
      console.error("Error getting answers:", err);
      throw err;
    }
  },
};
