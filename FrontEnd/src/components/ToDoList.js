import React, { useEffect, useState } from "react";
// import { ProgressPlugin } from "webpack";
import "./../styles/App.css";
import List from './List';

function ToDoList(props) 
{
	const [task,settask]=useState("");
	const[list,updateList]=useState([]);
	const url=`http://localhost:3030/todo`;

	useEffect(()=>{
			fetch(url,{credentials:"include"})
			.then((r)=>r.json())
			.then((arr)=>{

			const [...sorted]=arr.sort((a,b)=>{
				const aNum=new Date(a.creationTime).valueOf();
				const bNUm=new Date(b.creationTime).valueOf();
				return a.Num-b.Num;
			});

			updateList(list => sorted);
			console.log("list",sorted);
			})
			.catch((e)=>console.log("error while fetching records",e));
	},[]);

	function taskInput(event){
			settask(event.target.value);
			// console.log(task);
	}
	function AddtasktoList(){
		const data=JSON.stringify({"task":task});

		fetch(url,{
			method:"POST",
			headers:{
				"content-type":"application/json"
			},
			body:data,
			credentials:"include"
		})
		.then((resp)=>resp.json())
		.then((r)=>{
			console.log(r)
			updateList(list=> [...list,r]);
			settask("");
		})
		.catch((e)=>
			console.log("error making request",e)
		);
}

	function deleteTask(id){

			fetch("http://localhost:3030/todo/"+id,{
				method:"delete",
			credentials:"include"
			})
			.then((r)=>{
				if(r.ok){
					console.log(r);
					const newTasklist=list.filter((element) =>{
						if(element._id==id){
							return false;
						}
						return true;		
					});
					updateList(list=>[...newTasklist]);
				}
			}).catch((e)=>console.log("error while deleting ",e));
}

	function editTask(id,value,index){
		// console.log("value and id",value,id);
		console.log("id",id,"task updated",value);
		const task={"task":value};
		
		fetch(`http://localhost:3030/todo/${id}`,{
			method:"PUT",
			headers:{
				"content-type":"application/json"
			},
			body:JSON.stringify(task),
			credentials:"include"
		})
		.then((r)=>r.json())
		.then((resp)=>{
			const [...uplist]=list
				uplist[index]=resp;
			updateList(list=> [...uplist]);
		})
		.catch((e)=>console.log("error while updating",e));
	}

	return (
	<div id="main">
		<div className="header">
		<p>Username:  {props.userName}</p>
		<button onClick={()=> props.logoutHandle()}>LogOut</button>
		</div>

	<h1> To Do List</h1>
	
	
	<div className="inputBox">
	<input type="text" id="task" value={task}onChange={taskInput} ></input>
	<button id="btn" disabled={!task} onClick={AddtasktoList}>Add</button><br></br>
	</div>
	<div className="listItems">
		<List tasklist={list} deletetaskfn={deleteTask}
		edit={editTask}/>
	 </div>
		</div>);
}


export default ToDoList;
