import React,{ Component} from 'react';

class Item extends Component{
    constructor(props){
        super(props);

        this.state={
            editTaskvalue:true,
            task:this.props.element.task
        };

        this.deleteThis=this.deleteThis.bind(this);
        this.editThis=this.editThis.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.save=this.save.bind(this);
    };

    deleteThis(event){
    const id=this.props.element._id;
        console.log("id of element",id);

        this.props.delfunc(id);
    }

    editThis(){
            this.setState({editTaskvalue:false});
    }

    handleChange(event){
        const value=event.target.value;
            this.setState({task:value});
        
    }

    save(event){
        const id=this.props.element._id;
            console.log("parent id",id);

        if(this.state.task.trim()!==""){
          this.props.editFunc(id,this.state.task,this.props.index);
          this.setState({task:"",
          editTaskvalue:true});
        }
    }

    render(){

    // console.log("hello1");
    return(
    <li >
    <div  >
        <p className="list">{this.props.element.task}</p>
        {/* <br></br> */}
        
        {this.state.editTaskvalue?
        <><button className="edit" onClick={this.editThis}>Edit</button>
        <button className="delete" onClick={this.deleteThis}>Delete</button>
        </>:<>
        <input className="editTask" type="text" value={this.state.task}
            onChange={this.handleChange}></input>
        <button disabled={!this.state.task}
        className="saveTask"  onClick={this.save}>Save</button>
        </>}
</div></li>);
    }
}

export default Item;