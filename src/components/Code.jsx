import React, { useState, useEffect } from "react";
import { FaClipboard, FaCheck, FaTimes, FaRegCopy } from "react-icons/fa";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Import Prism's CSS theme
import "./Code.css";

const Code = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const copyText = !code ? '' : code;
  const [codeType, setCodeType] = useState("");

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(copyText)
      .then(() => {
        setCopied(true);
        setShowAlert(true);
        setTimeout(() => {
          setCopied(false);
          setShowAlert(false);
        }, 2000);
      })
      .catch((err) => {
        console.log("Something went wrong", err);
      });
  };

  // check domain name for
  const determineCodeType = (text) => {
    const lowerText = text.toLowerCase();

    // HTML detection
    if (lowerText.includes("<html") || lowerText.includes("<div"))
      return "html";

    // JavaScript detection
    if (
      lowerText.includes("function") ||
      lowerText.includes("const") ||
      lowerText.includes("let") ||
      lowerText.includes("var") ||
      lowerText.includes("=>") // for arrow functions
    )
      return "js";

    // CSS detection
    if (lowerText.includes("{") && lowerText.includes("}")) return "css";

    // Bash detection
    if (lowerText.includes("npm install") || lowerText.includes("npm i"))
      return "bash";

    // JSX/React detection
    if (
      lowerText.includes("import react") ||
      lowerText.includes("from 'react'") ||
      lowerText.includes('from "react"') ||
      lowerText.includes("export default") // general React pattern
    )
      return "jsx";

    // Vue.js detection
    if (lowerText.includes("<template>") && lowerText.includes("<script>"))
      return "vue";

    // Sublime Text configuration detection
    if (lowerText.includes("1.") && lowerText.includes("sublime text"))
      return "text";

    // Python detection
    if (
      lowerText.includes("def ") ||
      lowerText.includes("import ") ||
      lowerText.includes("print(")
    )
      return "python";

    // Ruby detection
    if (
      lowerText.includes("class ") ||
      lowerText.includes("end") ||
      lowerText.includes("def ") ||
      lowerText.includes("require '")
    )
      return "ruby";

    // Add more types as needed
    // For example, checking for SQL
    if (
      lowerText.includes("select ") ||
      lowerText.includes("insert into") ||
      lowerText.includes("update ") ||
      lowerText.includes("delete from")
    )
      return "sql";

    // Check for PHP
    if (
      lowerText.includes("<?php") ||
      lowerText.includes("echo ") ||
      lowerText.includes("$")
    )
      return "php";

    // Check for Java
    if (
      lowerText.includes("public class") ||
      lowerText.includes("public static void main")
    )
      return "java";

    // Check for C#
    if (
      lowerText.includes("using System;") ||
      lowerText.includes("namespace ") ||
      lowerText.includes("class ")
    )
      return "c#";

    return "unknown";
  };

  useEffect(() => {
    setCodeType(determineCodeType(copyText));
  }, [copyText]);

  useEffect(() => {
    Prism.highlightAll();
  }, [codeType, copyText]);

  return (
    <>
      {showAlert && (
        <div className="custom-alert">
          <span>Copied to clipboard</span>
          <FaTimes className="close-icon" onClick={() => setShowAlert(false)} />
        </div>
      )}
      <div className="copy-container">
        <div className="copy-header">
          <span className="copy-header-text">{codeType}</span>
          <div className="copy-icon" onClick={copyToClipboard}>
            {copied ? <FaCheck size={16} /> : <FaClipboard size={16} />}
            <span className="copy-text">{copied ? "Copied" : "Copy"}</span>
          </div>
        </div>
        <pre className="copy-code">{copyText}</pre>
      </div>
    </>
  );
};

export default Code;
