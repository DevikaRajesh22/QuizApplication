const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 5000;
const userRoute = require('./routes/userRoutes');
const connectDB = require('./config/connectDB');
const cors = require('cors');
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = ["https://quizmaster-eight.vercel.app"];
const allowedMethods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'];
app.use(
    cors({
        origin: allowedOrigins,
        methods: allowedMethods,
        credentials: true,
        optionsSuccessStatus: 200
    })
);

app.use('/api', userRoute);

app.listen(port, () => console.log(`Server started at port ${port}`));