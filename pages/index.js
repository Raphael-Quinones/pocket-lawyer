import Head from 'next/head';
import react from 'react';
import Image from 'next/image'
import twitterLogo from '../assets/twitter.png';
import facebookLogo from '../assets/facebook.png';
import githubLogo from '../assets/github.png';
import linkedinLogo from '../assets/linkedin.png';
import {useState} from 'react';
import { useCallback } from "react";
import { Analytics } from '@vercel/analytics/react';
import ReactGA from 'react-ga'


ReactGA.initialize('G-TQ2K9QY16N')
if (typeof window !== 'undefined') {
  ReactGA.pageview(window.location.pathname + window.location.search);
}
const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);



  //Maximum number of clicks allowed
  var maxClicks = 10;

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
  }

  function checkForCookie(){
    if(getCookie("buttonClicks") != ""){
      var clicks = parseInt(getCookie("buttonClicks"));
      if(clicks >= maxClicks){
          setIsDisabled(true);
          alert("You have reached the maximum number of clicks");
          return true;
      }
    }
    else{
        //Create cookie with value 0
        setCookie("buttonClicks", 0, 1);
        return false;
    }
    }

    function incrementClicks(){
      var clicks = parseInt(getCookie("buttonClicks"));
    if(clicks < maxClicks){
        clicks++;
        setCookie("buttonClicks", clicks, 1);
    }
    else{
        setIsDisabled(true);
        alert("You have reached the maximum number of clicks");
    }
    }

  const callGenerateEndpoint = async () => {
    if(checkForCookie()){
      return
    };
    incrementClicks();


    setIsGenerating(true);
    
    console.log("Calling OpenAI...")
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output)

    setApiOutput(`${output}`);
    setIsGenerating(false);
  }

  function onUserChangedText(event){
      setUserInput(event.target.value)
  }
  return (
    <div className="root">
      <Head>
        <title>Pinoy Pocket Lawyer</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Pocket Lawyer PH</h1>
          </div>
          <div className="header-subtitle">
            <h2>Mayroon ka bang katanungan tungkol sa batas?</h2>
            <h2>Tingin mo ba'y naabuso ka ngunit hindi ka sigurado?</h2>
            <h2>Ako ang bahalang tumugon sa iyong mga nais malaman. </h2>
            <br/>
            <h2><b>Donations Accepted | GCash: 09150573941</b></h2>
            <h2><i>Will be used for maintaining the site to help more people</i></h2>
          </div>
        </div>
      </div>
      <div className="prompt-container">
        <textarea placeholder="Mag-type rito" 
        className="prompt-box"
        value={userInput}
        onChange={onUserChangedText}></textarea>
        { !isDisabled ?
          <div className="prompt-buttons">
        <a 
          className = { isGenerating ? "generate-button loading":"generate-button" }
          onClick={callGenerateEndpoint}
        >
          <div className="generate">
            { isGenerating ? <span class = "loader"></span>: <p>Itanong</p>}
          </div>
        </a>
        </div>: <div className = "header-subtitle">
          <h2>Please come back tomorrow or contact the developer for more generations ;D</h2>
          </div>
        }
        { apiOutput && (
          <div className = "output">
            <div className = "output-header-container">
              <div className = "output-header">
                <h3>Output</h3>
              </div>
            </div>
            <div className = "output-content">
              <p>{apiOutput}</p>
            </div>
          </div>
        )

        }
      </div>
      
      <div className="badge-container">
        <a
          href="https://twitter.com/RaphaelTrivi"
          target="_blank"
          rel="noreferrer"
        >
          Raphael Quinones and Eunice Anada
        </a>
        <a className = "grow"
          href="https://twitter.com/RaphaelTrivi"
          target="_blank"
          rel="noreferrer"
        >
          <Image src={twitterLogo} width = {17} height = {17}/>
        </a>
        <a className = "grow"
          href="https://www.facebook.com/EuniQue0704/"
          target="_blank"
          rel="noreferrer"
        >
          <Image src={facebookLogo} width = {17} height = {17}/>
        </a>
        <a className = "grow"
          href="https://www.linkedin.com/in/raphael-quinones/"
          target="_blank"
          rel="noreferrer"
        >
          <Image src={linkedinLogo} width = {17} height = {17}/>
        </a>
        <a className = "grow"
          href="https://github.com/Raphael-Quinones"
          target="_blank"
          rel="noreferrer"
        >
          <Image src={githubLogo} width = {17} height = {17}/>
        </a>
      </div>
      <Analytics />
    </div>
    

    
  );
};

export default Home;
