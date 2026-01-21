import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import router from './Route.js';

import initReminderService from './services/reminderService.js';




const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080;



app.use('/api', router)




import prisma from './Database/prisma.js';

app.get('/', (req, res) => {
  try {
    res.json({ message: "Server is running" });
  } catch (error) {
    res.json({ message: "Error in server" });
  }
});

prisma.$connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`server connected on http://localhost:${port}`);
      initReminderService();
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
