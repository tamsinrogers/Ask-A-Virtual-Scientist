import React from "react";

export function TextBox (props:{textChange(text)})
{
    const [question, setQuestion] = React.useState("");

    const textChange = (text) => {

        setQuestion(text.target.value)
    }

    return(
        <>

        <input 
            type="text" 
            id="inputField" 
            placeholder="type your question here" 
            onChange = {textChange}>
        </input>
        
        <button 
            id="clickButton" 
            onClick={()=>props.textChange(question)}>Click to ask
        </button>
        
        </>
    )
}

