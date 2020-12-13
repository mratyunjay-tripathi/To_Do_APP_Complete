import React,{useState} from 'react';
import "./../styles/App.css";

function Login(props){
        const[userName,setuserName]=useState("");
        const[password,setpassword]=useState("");

    return (
        <>
        <h1 class="heading">To Do App</h1>
        <div className="login">
            <input type="text" placeholder="username" onChange={(e)=> setuserName(e.target.value) }></input> 
            <input type="password" placeholder="password" onChange={(e)=> setpassword(e.target.value) }></input>
            {props.error?<p className="error">{props.error}</p>:null}
            <button onClick={()=> props.SignUphandler(userName,password)}>Sign up</button>
            <button onClick={()=> props.LogInhandler(userName,password)}>LogIn</button>
    </div>
    </>);

} 

export default Login;