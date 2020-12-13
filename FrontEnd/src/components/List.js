import React,{Component} from 'react';
import Item from './Item';

class List extends Component{
    constructor(props){
        super(props);

        this.state={
            list: this.props.tasklist
        };
    };

    componentWillReceiveProps(props){
        this.setState({list:props.tasklist});
    }

    render(){
    // console.log("hello list",this.state.list);
    const TaskList=this.state.list.map((value,index)=>(
         <Item key={index} index={index} element={value}
            delfunc={this.props.deletetaskfn}
            editFunc={this.props.edit}/>)
    );
    return (<ol>{TaskList}</ol>);
    }
}

export default List;