import { useCallback, useState } from "react";
export const list_to_tree = (list) => {
    let map = {},
        node,
        roots = [],
        i;

    for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i; // initialize the map
        list[i].children = []; // initialize the children
    }
    // console.log({ map });

    for (i = 0; i < list.length; i++) {
        node = list[i];
        if (parseInt(node.parentId) !== 0) {
            // if you have dangling branches check that map[node.parentId] exists
            list[map[node.parentId]].children.push(node);
        } else {
            roots.push(node);
        }
        // console.log({ roots });
    }
    // console.log({ roots, list });
    return roots;
};

export const useCenteredTree = (defaultTranslate = { x: 0, y: 0 }) => {
    const [translate, setTranslate] = useState(defaultTranslate);
    const containerRef = useCallback((containerElem) => {
        if (containerElem !== null) {
            const { width, height } = containerElem.getBoundingClientRect();
            setTranslate({ x: width / 2, y: height / 2 });
        }
    }, []);
    return [translate, containerRef];
};
const printNodeChildren = (node) => {
    // console.log(node.children);
}
export const renderForeignObjectNode = ({ nodeDatum, toggleNode, foreignObjectProps }) => (
    <g>
        <circle r={15}></circle>
        {/* `foreignObject` requires width & height to be explicitly set. */}
        <foreignObject {...foreignObjectProps}>
            <div style={{ border: "1px solid black", borderRadius: "5px", backgroundColor: "#dedede", opacity: "0.8", margin: "0.5rem 0 0 0.5rem" }}>
                <p style={{ textAlign: "center" }}>Id: {nodeDatum.id}</p>
                {/* <p style={{ textAlign: "center" }}>Title: {nodeDatum.title}</p> */}
                {/* <p style={{ textAlign: "center" }}>Url: {nodeDatum.url}</p> */}
                <p style={{ textAlign: "center" }}>Parent Id: {nodeDatum.parentId}</p>
                <p style={{ textAlign: "center" }}>Depth Level: {nodeDatum.depth}</p>

                {printNodeChildren(nodeDatum)}
                {nodeDatum.children.length > 0 && (
                    <button style={{ width: "100%" }} onClick={toggleNode}>
                        {nodeDatum.__rd3t.collapsed ? "Expand" : "Collapse"}
                    </button>
                )}
            </div>
        </foreignObject>
    </g>
);

export const containerStyles = {
    // width: "100vw",
    height: "100vh",
    border: "1px solid black",
};