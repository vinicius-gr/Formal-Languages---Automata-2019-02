import { DeterministcFiniteAutomata } from "../automatas/DFA.js";
import { dfaRawData } from "../db/data.js";
import { treatRawData, sleep } from "../utils/index.js";

const Graph = ForceGraph3D({
  extraRenderers: [new THREE.CSS2DRenderer()],
})(document.getElementById("3d-graph"))
  .graphData(treatRawData(dfaRawData))
  .linkDirectionalArrowLength(3.5)
  .linkDirectionalArrowRelPos(0.5)
  .linkCurvature(0.8)
  .nodeLabel("id")
  .nodeAutoColorBy("type")
  .nodeRelSize(8)
  .nodeResolution(16)
  .linkOpacity(0.5)
  .linkWidth((link) => {
    return link.active ? 1 : 0.1;
  })
  .linkLabel((link) => link.value)
  .nodeThreeObject((node) => {
    const nodeEl = document.createElement("div");
    nodeEl.textContent = node.id;
    nodeEl.style.color = "#fff";
    node.color = node.active ? "rgba(255, 100, 100, 1)" : node.color;
    nodeEl.style.fontFamily = "Verdana";
    return new THREE.CSS2DObject(nodeEl);
  })
  .nodeThreeObjectExtend(true)
  .linkThreeObjectExtend(true)
  .linkThreeObject((link) => {
    // extend link with text sprite
    const sprite = new SpriteText(`${link.value}`);
    sprite.color = "lightgrey";
    sprite.textHeight = 6;
    return sprite;
  })
  .linkPositionUpdate((sprite, { start, end }, link) => {
    let middlePos = Object.assign(
      ...["x", "y", "z"].map((c) => ({
        [c]: start[c] + (end[c] - start[c]) / 2, // calc middle point
      }))
    );
    if (link.curvature === "0.5") {
      middlePos = Object.assign(
        ...["x", "y", "z"].map((c) => ({
          [c]: link.__curve.v1[c], // calc middle point
        }))
      );
    }

    if (link.curvature === "1" || link.curvature === "-1") {
      middlePos = Object.assign(
        ...["x", "y", "z"].map((c) => ({
          [c]:
            link.__curve.v1[c] + (link.__curve.v2[c] - link.__curve.v1[c]) / 2, // calc middle point
        }))
      );
    }
    // Position sprite
    Object.assign(sprite.position, middlePos);
  });

// Spread nodes a little wider
Graph.d3Force("charge").strength(-150);

document.getElementById("playBtn").addEventListener("click", async (event) => {
  const input = document.getElementById("word");
  if (input.value !== "") {
    const DFA = new DeterministcFiniteAutomata(dfaRawData);
    const { nodes, links } = Graph.graphData();
    const currState = { id: "S0", index: 0 };
    nodes[currState.index].active = true;
    Graph.graphData({ nodes, links });
    Graph.nodeThreeObject(Graph.nodeThreeObject());
    for (let letter of input.value.split("")) {
      await sleep(2000);
      const nextState = DFA.move(currState.id, letter);
      currState.id = nextState;
      currState.index = nodes.findIndex((item) => item.id === nextState);
      nodes[currState.index].active = true;
      Graph.graphData({ nodes, links });
      Graph.nodeThreeObject(Graph.nodeThreeObject());
    }
  }
});
