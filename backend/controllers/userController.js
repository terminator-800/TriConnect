// const reportUser = async (req, res) => {
//   try {
//     const { reason, message, reportedUserId, conversationId } = req.body;
//     const files = req.files; 

//     if (!reason || !message || !reportedUserId || !conversationId) {
//       return res.status(400).json({ error: "Missing required fields." });
//     }

//     await saveReport({
//       reason,
//       message,
//       reportedUserId,
//       conversationId,
//       proofFiles: files, 
//     });

//     res.status(200).json({ message: "Report submitted successfully." });
//   } catch (error) {
//     console.error("Error reporting user:", error);
//     res.status(500).json({ error: "Failed to submit report." });
//   }
// };
