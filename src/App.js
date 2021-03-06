import React, { useEffect, useState } from 'react';
import { getNextDepthLvlFromDB, postCrawerOnDB } from './dataBase/urlsRequests';
import Tree from "react-d3-tree";
import { containerStyles, list_to_tree, renderForeignObjectNode, useCenteredTree } from './utils/treeCreation';

const App = () => {

  const [urls, setUrls] = useState([]);
  const [startingUrl, setStartingUrl] = useState("");
  const [maxNumberOfPages, setMaxNumberOfPages] = useState("");
  const [maxDepth, setMaxDepth] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [crawlerId, setCrawlerId] = useState("");
  const [isCrawlingFinished, setIsCrawlingFinished] = useState(false);
  // const [treeData, setTreeData] = useState(null);
  // console.log({ treeData });
  const nodeSize = { x: 200, y: 200 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: 1 };
  const [translate, containerRef] = useCenteredTree();
  useEffect(() => {
    const interval = setInterval(() => {
      if (crawlerId !== "" && !isCrawlingFinished) {
        getNextDepthLvlFromDB(crawlerId)
          .then((data) => {
            setIsCrawlingFinished(data.isCrawlingDone);
            const newUrls = data.currentDepthTree;
            const treeArr = [...urls, ...newUrls];
            // console.log({ treeArr });
            // const treeStructure = list_to_tree(treeArr);
            // console.log({ treeStructure });
            // setTreeData(treeStructure[0]);
            setUrls(treeArr)
          }).catch((err) => {
            setErrorMessage(err.errorMessage)
            // console.log({ err });
          })
      }

    }, 5000);

    return () => {
      clearInterval(interval);
    }
  }, [crawlerId, urls]);

  const onSubmitForm = (e) => {
    e.preventDefault();
    setUrls([]);
    setIsCrawlingFinished(false);
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
        {urls.length > 0
          &&
          <div style={containerStyles} ref={containerRef}>
            <Tree
              data={list_to_tree(urls)}
              translate={translate}
              renderCustomNodeElement={(rd3tProps) => renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })}
              orientation='vertical'
              nodeSize={nodeSize}
            />
          </div>

        }
      </div>
      {errorMessage !== "" && <div>{errorMessage}</div>}
    </div>
  );
}

export default App;
