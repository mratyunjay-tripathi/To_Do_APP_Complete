import React, {useState} from 'react';

function Message(props){

    const[flag,setFlag]=useState(false);
        
    function okFunction(){

    };

    function cancelFunction(){}

    return (
    <div className="messageBox">
        <p id="message"> {this.props.message}
        </p>
        <button id="ok" onClick={okFunction}>OK</button>
        <button id="cancel" onClick={cancelFunction}>CANCEL</button>
    </div>  
    );

}
