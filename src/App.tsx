import React, { Component } from "react";
import { TextBox } from "././TextBox";
import { RecognizeTextCommand, GetSessionCommandInput, SessionState, LexRuntimeV2Client, LexRuntimeV2ClientConfig, GetSessionCommand, PutSessionCommand } from "@aws-sdk/client-lex-runtime-v2";
import 'react-chatbox-component/dist/style.css';

class App extends Component {

  client;
  params;
  command;
  answer = "";
  pad;
  
  constructor(props)
  {

    super(props);
    this.pad = 0;
    
    const CREDENTIAL = {

      accessKeyId: "",
      secretAccessKey: ""

    };
    
    this.client = new LexRuntimeV2Client({ region: "us-east-1", credentials: CREDENTIAL });

    this.params = 
    {
      botAliasId: "TSTALIASID",
      botId: "JJOGWHYVRW",
      localeId: "en_US",
      text: "build",
      sessionId: "3444402222177500",
    };

    const sessionState : SessionState = {
    };

    this.params.sessionState = sessionState
    const session = new PutSessionCommand(this.params);
    this.client.send(session);

  }

  // sends question (message) to lex
  sendTextCommand = async (message) => {

    try 
    {
      this.params.text = message
      const command = new RecognizeTextCommand(this.params);

      //this.answerDiv.innerHTML = '';  // resets answer field, comment out for message history

      // MESSAGE 
      setTimeout(async () => {
        
        const ans = await this.client.send(command);          // send message to lex
        const data = `${JSON.stringify(ans)}`                 // readable format

        const startIndex = data.indexOf("content") + 10       // extract actual response data
        const endIndex = data.indexOf("contentType") - 3
        const sData = data.slice(startIndex, endIndex)
        this.answer = sData;                                  // update answer value with answer data
        this.setAnswer(sData);
        
       // answer div

       const questionDiv = document.createElement("questionDiv");

       questionDiv.id="questionDiv";
       questionDiv.style.color="black";
       questionDiv.style.width="30%";
       questionDiv.style.height="20px";
       questionDiv.style.position="fixed";
       questionDiv.style.top= ((this.pad+70).toString() + "px");
       questionDiv.style.left="45%";
       questionDiv.style.textAlign="right";
       questionDiv.style.alignItems="right";
       questionDiv.style.gap="0.2em";

       const answerDiv = document.createElement("answerDiv");
       this.pad = this.pad+70;

       answerDiv.id="answerDiv";
       answerDiv.style.color="blue";
       answerDiv.style.width="35%";
       answerDiv.style.height="20px";
       answerDiv.style.position="fixed";
       answerDiv.style.top=((this.pad+70).toString() + "px");
       answerDiv.style.left="25%";
       answerDiv.style.textAlign="left";
       answerDiv.style.alignItems="left";
       answerDiv.style.gap="0.2em";

       this.pad = this.pad+70;
       var br = document.createElement("br");
       questionDiv.appendChild(document.createElement('br'));

       const a = document.createTextNode(message);
       questionDiv.appendChild(a);
       questionDiv.appendChild(document.createElement('br'));

       // user emoji

       var face = document.createElement("img");
       face.style.width="25px";
       face.style.height="25px";
       face.src = "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/60063/467371_21871.png";
       questionDiv.appendChild(face);
       questionDiv.appendChild(document.createElement('br'));

       const newContent = document.createTextNode(this.answer);
       answerDiv.appendChild(newContent);

      // scientist emoji

       var scientist = document.createElement("img");
       scientist.style.width="25px";
       scientist.style.height="25px";
       scientist.src = "https://static-00.iconduck.com/assets.00/scientist-emoji-512x510-duff84jq.png";
       answerDiv.appendChild(document.createElement('br'));
       answerDiv.appendChild(scientist);
       questionDiv.appendChild(document.createElement('br'));

       const con = document.getElementById("container");
       document.body.insertBefore(questionDiv, con)
       document.body.insertBefore(answerDiv, con)

      }, 100);  // delay

    } 
    
    catch (error) 
    {
      console.log(error);
    }

  };


  onEvent = async (event: React.MouseEvent<HTMLElement>) => 
  {
      try {
        await this.sendTextCommand('build');  // required intent
      
      } catch (error) {
        console.error(error);
      }
  }

  onTextChange = (text) => 
  {
    this.sendTextCommand(text)
  }

  setAnswer(answer)
  {
    this.answer = answer;
  }

  getAnswer()
  {
    return(this.answer);
  }

  
  render() {

    //const txt = this.sendTextCommand("what is the milky way?") // causes runtime error

    return(

      <>

      <div> </div>
    
      <div>
      <TextBox textChange={this.onTextChange} />
      </div>
      </>
      
    )

  }
  
}
export default App;
