import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pgclient from './db.js';
import userRoutes from "./routes/user.js";
import sessionRoutes from "./routes/session.js";
import categoryRoutes from "./routes/category.js";
import reservationRoutes from "./routes/reservation.js";
import authRoutes from "./routes/auth.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || process.env.PORT2;

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reservations", reservationRoutes);

app.get("/test",(request,response)=>{
    console.log('Hello from test console');
    response.send('This is test route');
})

app.get("/",(request,response)=>{
    console.log('Hello from Home console');
    response.send('Welcome to home page');
})

app.use((req,res)=>{
    res.json({message:"Route not found"});
})


pgclient.connect().then(()=>{
app.listen(PORT,()=>{
    console.log(`Listining on PORT ${PORT}`);
});
})