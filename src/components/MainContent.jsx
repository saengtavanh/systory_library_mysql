import "./MainContent.css";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Code from "./Code";
import axios from "axios";
import Spinner from "./Spinner";

function MainContent({ records }) {
  const [attrachment, setAttrachment] = useState([]);
  const [installation, setInstallation] = useState([]);
  const [howToUse, setHowToUse] = useState([]);
  const [example, setExample] = useState([]);
  const [loading, setLoading] = useState(false);
  const IP_ADDRESS = import.meta.env.VITE_IP_ADDRESS;
  // let INSTALLATION = [];

  const location = useLocation();
  // console.log('location', location);
  const query = new URLSearchParams(location.search);
  // console.log('query', query);
  const LibraryId = query.get("id");
  // console.log('LibraryName', LibraryName);
  console.log(records);
  let libraryData = records
    ? records.find((item) => item.LIB_ID == LibraryId)
    : null;
  // let libraryData = records.find((item) => item.LIB_ID == LibraryId);
  console.log("libraryData", libraryData);
  // setAttrachment((libraryData.ATTRACHMENT).split("||"));
  
  if (!libraryData) {
    return;
  }
  const {
    CREATE_BY,
    LIB_NAME,
    DESCRIPTION,
    REFERENCE,
    DESCRIPTIONS_OVER,
    DESCRIPTIONS_INS,
    DESCRIPTIONS_HTU,
    DESCRIPTIONS_EXP,
    DESCRIPTIONS_SGT,
    IMAGE,
    INSTALLATION,
    HOWTOUSE,
    EXAMPLE
  } = libraryData;

  
  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     // Parse the ATTRACHMENT data
        setAttrachment(JSON.parse(libraryData.ATTRACHMENT));
  
    //     // Define dynamic functions to fetch data for different tables
    //     const fetchInstallation = async () => {
    //       const response = await axios.get(`${IP_ADDRESS}/getInstallation/${LibraryId}`);
    //       return response.data;
    //     };
  
    //     const fetchHowToUse = async () => {
    //       const response = await axios.get(`${IP_ADDRESS}/getHowToUse/${LibraryId}`);
    //       return response.data;
    //     };
  
    //     const fetchExample = async () => {
    //       const response = await axios.get(`${IP_ADDRESS}/getExample/${LibraryId}`);
    //       return response.data;
    //     };
  
    //     // Fetch all data in parallel
    //     const [installationData, howToUseData, exampleData] = await Promise.all([
    //       fetchInstallation(),
    //       fetchHowToUse(),
    //       fetchExample(),
    //     ]);
  
    //     // Log or set the data to state
    //     console.log('INSTALLATION:', installationData);
    //     console.log('HOWTOUSE:', howToUseData);
    //     console.log('EXAMPLE:', exampleData);
  
    //     // If you need to store the data in the state, you can do so here
        setInstallation(JSON.parse(INSTALLATION));
        setHowToUse(JSON.parse(HOWTOUSE));
        setExample(JSON.parse(EXAMPLE));
        console.log('installation', installation);
  
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   }
    // };
  
    // Call the async function
    // fetchData();
  }, [libraryData]);

  function formatFileSize(bytes) {
    const units = ["B", "KB", "MB", "GB", "TB", "PB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
  return (
    <>
      {loading && <Spinner />}
      {!loading && (
        <main className="content-container">
          <div className="main-content">
            <h1>{LIB_NAME}</h1>
            <section className="section">
              <div className="show-img">
                {IMAGE ? (
                  <>
                    <img
                      src={`../../server/src/uploads/${IMAGE}`}
                      alt="Item Image"
                      className="libraly-img"
                    />
                  </>
                ) : (
                  <p>No image available</p>
                )}
              </div>
              <p className="section-description">{DESCRIPTION}</p>
            </section>

            <section className="section" id="overview">
              <div className="section-header">Overview</div>
              <p className="section-description">{DESCRIPTIONS_OVER}</p>
            </section>
            <div className="divider" />
            {/* installation section */}
            <section className="section" id="installation">
              <div className="section-header">Installation</div>
              <p className="section-description">{DESCRIPTIONS_INS}</p>
              {installation.map((item, index) => (
                <div key={index}>
                  <h4>{item.title}</h4>
                  <p className="section-description">
                    {item.description}
                  </p>
                  {item.example && (
                    <Code code={item.example} />
                  )}
                </div>
              ))}
            </section>
            <div className="divider" />
            {/* how to use section */}
            <section className="section" id="how_to_use">
              <div className="section-header">How to use</div>
              <p className="section-description">{DESCRIPTIONS_HTU}</p>
              {howToUse.map((item, index) => (
                <div key={index}>
                  <h4>{item.title}</h4>
                  <p className="section-description">
                    {item.description}
                  </p>
                  {item.example && (
                    <Code code={item.example} />
                  )}
                </div>
              ))}
            </section>
            <div className="divider" />
            {/* example section */}
            <section className="section" id="example">
              <div className="section-header">Example</div>
              <p className="section-description">{DESCRIPTIONS_EXP}</p>
              {example.map((item, index) => (
                <div key={index}>
                  <h4>{item.title}</h4>
                  <p className="section-description">
                    {item.description}
                  </p>
                  {item.example && (
                    <Code code={item.example} />
                  )}
                </div>
              ))}
            </section>
            {/* suggestion section */}
            <section className="section" id="suggestion">
              <div className="section-header">Suggestion</div>
              <p className="section-description">{DESCRIPTIONS_SGT}</p>
            </section>

            {/* Attachment section */}
            <section className="section" id="attachment">
              <div className="section-header">Attachment</div>
              <div className="link-group">
                {attrachment &&
                  attrachment.map((file, index) => (
                    <div className="link-item" key={index}>
                      <a
                        href={'../../server/src/uploads/'+file.filename}
                        download={file.originalname}
                        className="link"
                        key={file.filename}
                      >
                        {file.originalname}
                      </a>
                      <span>({formatFileSize(parseInt(file.size))})</span>
                    </div>
                  ))}
              </div>
            </section>

            {/* Reference section */}
            <section className="section" id="reference">
              <div className="section-header">Reference</div>
              <p className="section-description">{REFERENCE}</p>
            </section>
            <section className="section" id="reference">
              <div className="section-header">Create By </div>
              <p className="section-description">{CREATE_BY}</p>
            </section>
          </div>
          <div className="table-of-content">
            <h5>Table of contents</h5>
            <ul className="content-list">
              <li className="list-item">
                <a href="#overview">Overview</a>
              </li>
              <li className="list-item">
                <a href="#installation">Installation</a>
              </li>
              <li className="list-item">
                <a href="#how_to_use">How to use</a>
              </li>
              <li className="list-item">
                <a href="#example">Example</a>
              </li>
              <li className="list-item">
                <a href="#suggestion">Suggestion</a>
              </li>
            </ul>
          </div>
        </main>
      )}
    </>
  );
}

export default MainContent;
