import Head from 'next/head';
import react from 'react';
import buildspaceLogo from '../assets/buildspace-logo.png';
import {useState} from 'react';
import Particles from "react-tsparticles";
import { useCallback } from "react";
import { loadFull } from "tsparticles";

import options from "./particles.json"



const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callGenerateEndpoint = async () => {
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
    console.log("OpenAI replied...", output.text)

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }

  function onUserChangedText(event){
      setUserInput(event.target.value)
  }
  const particlesInit = useCallback(async engine => {
    console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);
  const particlesLoaded = useCallback(async container => {
    await console.log(container);
  }, []);
  return (
    <div className="root">
      <Head>
        <title>Dream Interpreter</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>dreams. what does it mean?</h1>
          </div>
          <div className="header-subtitle">
            <h2>Tell me about a very specific dream that you had. The more specific, the better. I'll tell you what it means.</h2>
          </div>
        </div>
      </div>
      <div className="prompt-container">
        <textarea placeholder="start typing here" 
        className="prompt-box"
        value={userInput}
        onChange={onUserChangedText}></textarea>
        <div className="prompt-buttons">
        <a 
          className = { isGenerating ? "generate-button loading":"generate-button" }
          onClick={callGenerateEndpoint}
        >
          <div className="generate">
            { isGenerating ? <span class = "loader"></span>: <p>Generate</p>}
          </div>
        </a>
        </div>
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
      
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          
        </a>
      </div>
      <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
        options={options}
      />
    </div>

    
  );
};

export default Home;
