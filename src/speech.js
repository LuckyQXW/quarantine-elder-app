'use strict'
import React, { Component } from "react"
import './App.css';


//------------------------SPEECH RECOGNITION-----------------------------

const SpeechRecognition = window.webkitSpeechRecognition || SpeechRecognition
const recognition = new SpeechRecognition()

recognition.continous = true
recognition.interimResults = true
recognition.lang = 'en-US'


//------------------------COMPONENT-----------------------------

class Speech extends Component {

  constructor() {
    super()
    this.state = {
      listening: false,
      groceryRequest: false, 
      groceryResponse: "Welcome to HelperVille! How can I help you?",
      groceryList: []
    }
    this.toggleListen = this.toggleListen.bind(this)
    this.handleListen = this.handleListen.bind(this)
    this.getNextOption = this.getNextOption.bind(this)
  }

  toggleListen() {
    this.setState({
      listening: !this.state.listening,
    }, this.handleListen)
  }
  
  getNextOption(transcript) {
    let newGroceryList = this.state.groceryList;
    let response = 'Welcome to HelperVille! How can I help you?';
    if (transcript.includes('done')) {
      response = 'Ok! Your shopping list is recorded.';
    } else if (transcript.includes('groceries')) {
      response = 'Lets start your shopping list! Please list your quantity and items like 3 bell peppers. Once you are done say done!';
    } else {
      if (transcript) {
        newGroceryList.push(transcript);
      }
      response = 'Lets start your shopping list! Please list your quantity and items like 3 bell peppers. Once you are done say done!';
    }
    
    this.setState( {
      groceryResponse: response,
      groceryList: newGroceryList
    });
  }

  handleListen() {
    console.log('listening?', this.state.listening)

    let finalTranscript = ''

    if (this.state.listening) {
      recognition.start();
      recognition.onend = () => {
        finalTranscript = '';
        console.log("...continue listening...")
        recognition.start();
      }

    } else {
      recognition.stop()
      recognition.onend = () => {
        console.log("Stopped listening per click")
      }
    }

    recognition.onstart = () => {
      console.log("Listening!")
    }

    recognition.onresult = event => {
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + ' ';
        else interimTranscript += transcript;
      }

      document.getElementById('interim').innerHTML = interimTranscript
      document.getElementById('final').innerHTML = finalTranscript

      //-------------------------COMMANDS---------------------------//
      
      this.getNextOption(finalTranscript);
      const transcriptArr = finalTranscript.split(' ');

      const stopCmd = transcriptArr.slice(-3, -1);
      console.log('stopCmd', stopCmd);
      if (stopCmd[0] === 'stop' && stopCmd[1] === 'listening'){
        recognition.stop()
        recognition.onend = () => {
          console.log('Stopped listening per command')
          const finalText = transcriptArr.slice(0, -3).join(' ')
          document.getElementById('final').innerHTML = finalText
        }
      }
    }
    
  //-----------------------------------------------------------------------
    
    recognition.onerror = event => {
      console.log("Error occurred in recognition: " + event.error)
    }

  }

  render() {
    let groceryList = this.state.groceryList.map(function(item){
      return <li>{item}</li>;
    })
    return (
      <div id='speech-container'>
        <button id='microphone-btn' onClick={this.toggleListen} />
        <div id='interim'></div>
        <div id='final'></div>
        <div id='response'></div>
        <h1>{this.state.groceryResponse}</h1>
        <ul>
          {groceryList}
        </ul>
      </div>
    )
  }
}

export default Speech