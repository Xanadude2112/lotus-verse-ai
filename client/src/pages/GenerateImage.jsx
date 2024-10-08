import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { LeftNavbar } from "../components/LeftNavbar";
import "../styles/GenerateImage.scss";
import "../styles/LeftNavbar.scss";

export const GenerateImage = ({
  userIsLoggedIn,
  setUserIsLoggedIn,
  setLoginState,
  setSignupState,
  prompt_text,
  setPrompt_text,
  loading,
  setLoading,
  image,
  throttledGenerateImage
}) => {


  return (
    <div className="generate-image-master">
      <Navbar
        userIsLoggedIn={userIsLoggedIn}
        setUserIsLoggedIn={setUserIsLoggedIn}
        setLoginState={setLoginState}
        setSignupState={setSignupState}
      />
      <div className="images-generate-left-navbar">
        <LeftNavbar />
      </div>
      <div className="generate-image-ui">
        <h1>Stable Diffusion Image Generator</h1>
        <textarea
          placeholder="Enter your prompt here..."
          value={prompt_text}
          onChange={(e) => setPrompt_text(e.target.value)}
        />
        <button onClick={throttledGenerateImage} disabled={loading}>
          {loading ? "Generating..." : "Generate Image"}
        </button>
        {image && (
          <img src={image} alt="Generated" style={{ width: "600px" }} />
        )}
      </div>
    </div>
  );
};
