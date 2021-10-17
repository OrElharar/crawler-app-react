import React, { useEffect, useState } from 'react';
import { postCrawerOnDB } from './dataBase/urlsRequests';

const App = () => {
  const URL = "http://localhost:4000/get-image";

  const [urls, setUrls] = useState([]);
  const [startingUrl, setStartingUrl] = useState("");
  const [maxNumberOfPages, setMaxNumberOfPages] = useState("");
  const [maxDepth, setMaxDepth] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [crawlerId, setCrawlerId] = useState("");



  const renderUrls = () => {

  }

  useEffect(() => {
    console.log({ crawlerId });
    let i = 0
    let isCrawlingFinished = false
    const interval = setInterval(() => {
      console.log(i++);
      if (i === 10)
        isCrawlingFinished = true
    }, 1000);
    if (isCrawlingFinished)
      clearInterval(interval);
    return () => {
      clearInterval(interval);
    }
  }, [crawlerId]);

  const onSubmitForm = (e) => {
    e.preventDefault();
    postCrawerOnDB({ startingUrl, maxNumberOfPages, maxDepth })
      .then((res) => {
        setCrawlerId(res.crawlerId);
      }).catch((err) => {
        console.log({ err });
      })
  }

  const isFormInvalid = () => {
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
    return !(urlRegex.test(startingUrl) && (startingUrl.includes("http://") || startingUrl.includes("https://")) && !isNaN(parseInt(maxDepth)) && !isNaN(parseInt(maxNumberOfPages)))
  }
  return (
    <div className="urls-app">
      <h1>Web Crawler App</h1>
      <div className="new-crawl-section">
        <div>Crawl now:</div>
        <form onSubmit={onSubmitForm}>
          <input type="text" placeholder="Starting url" onBlur={(e) => { setStartingUrl(e.target.value.trim()) }} />
          <input type="text" placeholder="Maximum depth levels" onBlur={(e) => { setMaxDepth(e.target.value.trim()) }} />
          <input type="text" placeholder="Maximum number of urls" onBlur={(e) => { setMaxNumberOfPages(e.target.value.trim()) }} />
          <button type="submit" disabled={isFormInvalid()}>Submit</button>
        </form>
      </div>
      <div className="urls-container">
        <h2>Urls</h2>
        {urls.map((url, i) => (
          <div className="url-container" key={"url" + i}>
            <div>Perant Id:{url.parentId}</div>
            <div>Url Id:{url.id}</div>
            <div>Address:{url.url}</div>
            <div>Depth:{url.depth}</div>


          </div>
        ))}
      </div>
      {errorMessage !== "" && <div>{errorMessage}</div>}
    </div>
  );
}

export default App;
