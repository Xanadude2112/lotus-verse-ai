import React, { useState } from "react";

const apiToken = import.meta.env.VITE_AI_API_TOKEN; // Assuming this is correct

const App = () => {
  const [prompt_text, setPrompt_text] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const throttle = (func, limit) => {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  const generateImage = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: prompt_text }), // Use prompt_text here
        }
      );

      if (response.status === 429) {
        // Handle rate limiting
        console.warn("Rate limited. Retrying in 5 seconds...");
        setTimeout(() => generateImage(), 5000);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImage(imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  const throttledGenerateImage = throttle(generateImage, 5000); // Use throttled function

  const saveImageToDatabase = async () => {
    try {
      const backendResponse = await fetch(
        "http://localhost:8080/images/:id/generate",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ prompt_text, image_url: image }), // Ensure prompt_text and image are used
        }
      );
      if (!backendResponse.ok) {
        throw new Error(`HTTP error! status: ${backendResponse.status}`);
      }
      console.log("Image saved to database successfully!");
    } catch (error) {
      console.error("Error saving image to database:", error);
    }
  };

  return (
    <div className="app-container">
      <h1>Stable Diffusion Image Generator</h1>
      <textarea
        placeholder="Enter your prompt here..."
        value={prompt_text}
        onChange={(e) => setPrompt_text(e.target.value)}
      />
      <button onClick={throttledGenerateImage} disabled={loading}>
        {loading ? "Generating..." : "Generate Image"}
      </button>
      {image && <img src={image} alt="Generated" style={{ width: "400px" }} />}
    </div>
  );
};

export default App;
