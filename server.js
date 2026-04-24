import app from "./src/app.js";
import connectDB from "./config/database.js";
connectDB();
app.listen(3001,()=>{
    console.log("Connected to server on port 3001");
})