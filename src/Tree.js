import React from 'react';
import Tree from "react-d3-tree";


const Tree = ({ urls }) => {

    return (
        <div>
            {
                urls.map((url, i) => (
                    <div className="url-container" key={"url" + i}>
                        <div>Parent Id:{url.parentId}</div>
                        <div>Url Id:{url.id}</div>
                        <div>Address:{url.url}</div>
                        <div>Depth:{url.depth}</div>

                        <br />
                        <br />
                        <br />
                    </div>
                ))
            }
        </div>
    )
}

export default Tree;
