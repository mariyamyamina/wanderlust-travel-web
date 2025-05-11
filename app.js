require("dotenv").config();

const express=require("express");
const app=express();
app.use(express.urlencoded({extended:true}));
const mongoose=require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore=require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user")

const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/user")


app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const MONGO_URI=process.env.MONGO_URI;
main().then((res)=>{
    console.log("Connected to DB");
}).catch((err)=>console.log(err))
async function main(){
    await mongoose.connect(MONGO_URI);
}

//to store session details in atlas db
const store = MongoStore.create({
    mongoUrl : MONGO_URI,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter : 24*3600,
})

store.on("error",()=>{
    console.log("err in mongo session store",err);
})

const sessionOption ={
    store,
    secret:process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 *60 * 60 * 1000,
        maxAge: 7 * 24 *60 * 60 * 1000,
        httpOnly:true,
    }
}

app.use(session(sessionOption));
app.use(flash());

//Passport implemtation
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Server working");
// })

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser",async(req,res)=>{
//    let fakeuser = new User({
//      email : "moses@yahoo.com",
//      username : "moses",
//    })
//    let newuser= await User.register(fakeuser , "hello");
//    res.send(newuser);
// })

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.use((req,res,next)=>{
    const err = new ExpressError(404,"Page Not Found");
    next(err);
})

app.use((err,req,res,next)=>{
    let{status = 500 ,message="something went wrong!" } = err;
    res.status(status).render("listings/error.ejs",{message})
    //  res.status(status).send(message)
});



app.listen(3000,()=>{
    console.log("Server listening on port 3000");
})

