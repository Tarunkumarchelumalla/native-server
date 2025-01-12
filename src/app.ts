import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import router from "./router/v1";
import { errorHandler, successHandler } from "./config/morgan";
import { customCorsOptions, customeCorsMiddleware } from "./config/corsOptions";
import helmet from "helmet";
import { authenticateToken } from "./middleware/auth";

declare global {
    namespace Express {
        interface Request {
            user?: any; // or define a specific type for your user object
        }
    }
}

const PORT = 3005;
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(successHandler);
app.use(errorHandler);

// CORS Configuration
app.options("*", cors(customCorsOptions))
app.use(customeCorsMiddleware);
app.use(cors(customCorsOptions));

app.use(helmet());

const CONNECTION_URL = process.env.CONNECTION_URL;

mongoose.connect(CONNECTION_URL)
  .then(() => {
    console.log('Connected to MongoDB');

    app.listen(PORT, () => console.log(`[ ready ] service started... version 2.0.0 on port ${PORT}`));
  })
  .catch((error) => console.log('Error connecting to MongoDB:', error.message));

// Routes

app.use("/api",authenticateToken, router);

// Example route for testing
app.get("/api/test", (req, res) => {
  return res.status(200).send({ message: "Test route working!" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Uncomment the cron job if needed
// cron.schedule('* * * * * *', async() => {
//   const getTimeRange = () => {
//     const now = Date.now();
//     const startRange = new Date(now);
//     const endRange = new Date(now);
  
//     startRange.setSeconds(0, 0); // Start of the current minute
//     endRange.setSeconds(59, 999); // End of the current minute
  
//     return {
//       startRange: startRange,
//       endRange: endRange
//     };
//   };
  
//   const { startRange, endRange } = getTimeRange();
  
//   try {
//     const batches = await BatchMaster.find({
//       scheduleTime: {
//         $gte: new Date(startRange),
//         $lt: new Date(endRange)
//       }
//     });
//     console.log(batches);
//   } catch (error) {
//     console.error('Error fetching
