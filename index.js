import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import usersRoute from './routes/UserRoutes.js';
import poisRoute from './routes/POIRoutes.js';
import customerServiceRoute from './routes/CustomerServiceRoutes.js';
import doctorsRoute from './routes/DoctorRoutes.js';
import channelsRoute from './routes/ChannelRoutes.js';
import medicalHistoryRoute from "./routes/MedicalHistoryRoutes.js";
import messageRoute from "./routes/MessagesRoutes.js";


const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json())

app.use(usersRoute);
app.use(poisRoute);
app.use(customerServiceRoute);
app.use(doctorsRoute);
app.use(channelsRoute);
app.use(medicalHistoryRoute);
app.use(messageRoute);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
