import asyncHandler from "express-async-handler";
import Candidate from "../../modals/Candidate/Candidate";
import {Op} from "sequelize";
import sendMessage from "../../utils/SendWhatsAppMessage";

// Modify the function to not rely on `req` and `res`
const sendExitInterviewMessage = async (): Promise<void> => {
  try {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    // Find candidates with empty reasons and no recent reminders
    const candidates = await Candidate.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [{reason1: ""}, {reason2: ""}, {reason3: ""}],
          },
          {lastReminderSent: {[Op.lt]: tenDaysAgo}},
        ],
      },
    });

    console.log("Candidates to send messages to:", candidates);
    for (const candidate of candidates) {
      // Call the WhatsApp API to send a message
      console.log("Sending message to candidate:", candidate.whatsappNumber);
      const user = {
        url: `http://localhost:3000/reason-leaving-job/${candidate.id}`,
        phone: candidate.whatsappNumber,
      };
      await sendMessage(user);

      // Update the `lastReminderSent` field
      candidate.lastReminderSent = new Date();
      await candidate.save();
    }
  } catch (error: any) {
    console.error("WhatsApp message send error:", error);
  }
};

export default sendExitInterviewMessage;
