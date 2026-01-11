import { BackboardClient } from "backboard-sdk";

const backboard = new BackboardClient({
  apiKey: process.env.BACKBOARD_KEY,
});

export default backboard;
