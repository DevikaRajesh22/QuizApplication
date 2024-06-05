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

app.use(
    cors({
        origin: ["https://quizmaster-eight.vercel.app"],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        optionsSuccessStatus: 200
    })
);


app.use('/api', userRoute);

app.listen(port, () => console.log(`Server started at port ${port}`));