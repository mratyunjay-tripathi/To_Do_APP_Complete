const express=require('express');
const cors=require('cors');
const app=express();
const bcrypt=require('bcrypt');

app.use(express.json());

app.use(cors({
    credentials:true,
    origin:"http://localhost:8080"
}));

const mongoose=require('mongoose');

const session=require('express-session');
const secret_key="school";

app.use(session({
    secret:secret_key,
    cookie:{maxAge:1*60*60*1000}
})); //this middleware attaches session property to request






const todoDB=mongoose.createConnection("mongodb://localhost:27017/todoDB",
{useNewUrlParser:true, useUnifiedTopology:true});
todoDB.once('open',
    ()=>{ console.log(`connection established `);})
    .on('error',(error)=>{ console.log(error)});

    
const userSchema=new mongoose.Schema({
    userName:String,
    password: String
});

const todoSchema=new mongoose.Schema({
    task:String,
    creationTime: Date,
    done: Boolean,
    user_id: mongoose.Schema.Types.ObjectId
});

const userModel=todoDB.model('user',userSchema);
const todoModel=todoDB.model('todo',todoSchema);

console.log("userModel ",userModel, "todo Model ",todoModel);

const SALT=5;

function isNUllUn(value){
    if(value==null || value==undefined){
        return true;
    }
    return false;
}


app.get("/",(req,res)=>{
    console.log("hello");
    res.sendStatus(200);
});

app.post("/signup",async (req,res)=>{
    let {userName,password}=req.body;

    if(userName.trim()!="" && password.trim()!=""){
        userName=userName.trim();
        password=password.trim();
        const existingUser=await userModel.findOne({userName});
    console.log(`existingUser`,existingUser);

    if(isNUllUn(existingUser)){
        const hashpswd=bcrypt.hashSync(password,SALT);

        const newUser=new userModel({userName,
             password:hashpswd});

            const User= await newUser.save();
            req.session.userId=User._id;
            console.log("sign up session",req.session);

            res.status(201)
            .send({message: 'signed up succesfully'});
    }else{
        res.status(401).send({error:"username already exist"+
         " select other username"});
    }
    }else{
        res.sendStatus(401).send({error:"spaces are not allowed"});
    }   
});

app.post("/login", async (req,res)=>{
    const {userName,password} =req.body;

    const existingUser=await userModel.findOne({userName});

    if(isNUllUn(existingUser)){
        res.status(401)
        .send({error:"Username incorrect"});
    }else{
        
        const hashpswd=existingUser.password;

        if(bcrypt.compareSync(password,hashpswd)){

            req.session.userId=existingUser._id;


            console.log("LogIn session",req.session);

            res.send({message:"successfully logged In"});
        }else{
            res.status(401)
            .send({error:"Incorrect password"});
        }
    }
});

const AuthMiddleWare=async (req,res,next)=>{
    
    console.log("Auth midleware session",req.session);

    if( isNUllUn(req.session) || isNUllUn(req.session.userId) ){
            res.status(401)
            .send({error:"Not logged IN"});
    }else{
        next();
    }
    
    
    // const {x_username,x_password} =req.headers;
    // // console.log("username",x_username,req.headers);

    // const existingUser=await userModel.findOne(
    //     {"userName":x_username});

    //     // console.log("existingUser",existingUser);

    // if(isNUllUn(existingUser)){
    //     res.status(401)
    //     .send({error:"Username incorrect"});
    // }else{
        
    //     const hashpswd=existingUser.password;

    //     if(bcrypt.compareSync(x_password,hashpswd)){
    //         req.user=existingUser;
    //         next();
    //     }else{
    //         res.status(401)
    //         .send({error:"Incorrect password"});
    //     }
    // }
}

app.post("/todo",AuthMiddleWare,async (req,res)=>{
        const {task}=req.body;
        // const user =req.user;

        const newTodo=new todoModel({
            task,
            creationTime:new Date(),
            done:false,
            user_id:req.session.userId
        });

       const result= await newTodo.save();
        res.status(201)
        .send(result);    
});

app.get("/todo",AuthMiddleWare,async(req,res)=>{
    //  const user=req.user;

    console.log("get all records session",req.session);
    
    const records= await todoModel.find({user_id:req.session.userId});
      res.send(records);
        
});

app.put("/todo/:id",AuthMiddleWare,async(req,res)=>{
        const id=req.params.id;
        const{task}=req.body;
        // const user=req.user;

        const result=await todoModel.updateOne({_id:id,
        user_id:req.session.userId},{task});
        console.log("update result", result);

        if(result.nModified!=0){
            const updated=await todoModel.findOne({
                _id:id, user_id:req.session.userId});
            res.send(updated);
        }else{
            res.sendStatus(500);
        }

});

app.delete("/todo/:id",AuthMiddleWare,async (req,res)=>{
    const id=req.params.id;
    // const userId=req.user._id;

    const result=await todoModel.deleteOne(
        {_id:id, user_id:req.session.userId});
    
        console.log(result);
        if( result.deletedCount==1){
            res.sendStatus(200);
        }else{
            res.sendStatus(500);
        }
});


app.post("/logout",(req,res)=>{
        if(isNUllUn(req.session)){
            res.sendStatus(200);
        }else{
            req.session.destroy(()=>{

                res.send({message:"logged out successfully"});
            });
        }
});

app.get("/userinfo",AuthMiddleWare,async(req,res)=>{
    try{
    const info=await userModel.findOne({_id:req.session.userId});
        res.send({userName:info.userName});
    }catch(error){
        res.status(401)
        .send({error:"Not logged IN"});
    }
});


app.listen(3030,()=> console.log(`listening on port 3030`));