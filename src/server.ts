import express from "express";
import cors from "cors";
import router from "./router";
import morgan from 'morgan'
import * as dotenv from 'dotenv'
import { protect, refreshJWT } from "./modules/auth";
import { createNewUser, signIn } from "./handlers/user";
import e from "express";
import config from "./config";
dotenv.config()

// interface CustomRequest extends express.Request {
//   shhh_secret: string;
// }
const app = express();
app.use(morgan('dev'))//middleware that logs all requests
app.use(express.json());//allow client to send us json
app.use(express.urlencoded({ extended: true }));//allows a client to add things like query strings
app.use(cors(
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }
));
//making my own middleware(for fun)
// app.use((req: CustomRequest,res,next) => {
//   req.shhh_secret = 'hohoho'
//   next()
// })


app.get("/", (req, res) => {
  res.json({ message: "hello" });
});

app.use('/api',protect, router)
app.post('/user', createNewUser)
app.post('/signin', signIn)
app.post('/refresh', refreshJWT)

app.use((err,req,res,next) => {
  if(err.type === 'auth'){
    res.status(401)
    res.json({message: "Unauthorized"})
  }else if(err.type === 'input'){
    res.status(400)
    res.json({message: "Invalid Input"})
  }else{
    res.status(500)
    res.json({message: "Internal Server Error"})
  }
})

app.listen(config.port, () => {

});

export default app;
