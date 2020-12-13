import React, {useState,useEffect} from 'react';
import ToDoList from './ToDoList';
import Login from './Login';

function App(props ){

	const[LoggedIn,setLogIn]=useState(false);
	const [error,setError]=useState(undefined);
	const [userName,setUsername]=useState(undefined);
	
	const getUserInfo=()=>{
		const url="http://localhost:3030/userinfo";

		fetch(url,{credentials:"include"})
		.then((r)=>{
			if(r.ok){
				return r.json();
			}else{
				setUsername(undefined);
				setLogIn(false);
				return r.json();
			}
			
		}).then((r)=>{
			if(r.userName!==undefined){
			setLogIn(true);
			setUsername(r.userName);
			}
		}).catch((error)=>{ console.log(error)});
	}

	useEffect(()=>{
		getUserInfo();
	},[]);


	function logout(){
		console.log("logout called");

		fetch("http://localhost:3030/logout",
		{method:"post",
		credentials:"include"})
		.then((r)=>{
			if(r.ok){
				setLogIn(false);
				setUsername(undefined);
			}
		})
	}

	function LogInhandler(userName,password){
		console.log(userName,password);
		const url="http://localhost:3030/login";

		authenticate(url,userName,password);
	}

	function SignUphandler(userName,password){

		console.log(userName,password);
		const url="http://localhost:3030/signup";
		
		authenticate(url,userName,password);
	}

	function authenticate(url,userName,password){
		fetch(url,{
			method: "post",
			headers: {
				"content-type":"application/json"
			},
			body:JSON.stringify({userName, password}),
			credentials:"include"
		})
		.then((r)=> r.json())
		.then(
			(r)=> { if(r.message!=undefined){
			getUserInfo();
			console.log(r.message);
			}else{
			setError(r.error);
			console.log(r.error);
		}
		})
		.catch((error)=>console.log(error));
	} 
	
	
	return(
		<>
	{LoggedIn===false?<Login error={error} LogInhandler={LogInhandler} SignUphandler={SignUphandler}/>
	:<ToDoList userName={userName} logoutHandle={logout}/>}
	</>);
}

export default App;