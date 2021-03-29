import { DeterministcFiniteAutomata } from "../automatas/DFA.js";
import { dfaRawData } from "../db/data.js";
import { treatRawData, sleep, getQuadraticXY } from "../utils/index.js";

let Graph = {};
Graph = ForceGraph()(document.getElementById("graph"))
  .graphData(treatRawData(dfaRawData))
  .backgroundColor("#000")
  .nodeId("id")
  .nodeAutoColorBy("type")
  .linkColor(() => "darkgrey")
  .linkSource("source")
  .linkTarget("target")
  .linkCurvature("curvature")
  .autoPauseRedraw(false)
  // .linkDirectionalParticles(3)
  // .linkDirectionalParticleSpeed(0.005)
  .linkDirectionalArrowLength(6)
  .nodeCanvasObject((node, ctx) => {
    ctx.beginPath();
    ctx.fillStyle = node.active ? "rgba(255,100,100,1)" : node.color;
    ctx.arc(node.x, node.y, 9, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.font = "8px Verdana";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.textBaseline = "middle";
    ctx.fillText(node.id, node.x, node.y);
    ctx.stroke();
  })
  .linkCanvasObjectMode(() => "after")
  .linkCanvasObject((link, ctx) => {
    const start = link.source;
    const end = link.target;

    // ignore unbound links
    if (typeof start !== "object" || typeof end !== "object") return;

    // calculate label positioning
    let textPos = Object.assign(
      ...["x", "y"].map((c) => ({
        [c]: start[c] + (end[c] - start[c]) / 2, // calc middle point
      }))
    );
    if (+link.curvature > 0) {
      textPos = getQuadraticXY(
        0.5,
        start.x,
        start.y,
        link.__controlPoints[0],
        link.__controlPoints[1],
        end.x,
        end.y
      );
      if (+link.curvature === 1) {
        textPos.x += 26;
        textPos.y += 9;
      }
    }
    const relLink = { x: end.x - start.x, y: end.y - start.y };

    let textAngle = Math.atan2(relLink.y, relLink.x);
    // maintain label vertical orientation for legibility
    if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
    if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);

    const label = `${link.value}`;

    ctx.font = `8px Sans-Serif`;
    ctx.save();
    ctx.translate(textPos.x, textPos.y);
    ctx.rotate(textAngle);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "darkgrey";
    ctx.fillText(label, 0, -10);
    // ctx.fillText(label, 0, 0);

    ctx.restore();
  });
Graph.d3Force("charge").strength(-200);

console.log("Estados do automato = "+dfaRawData.states)
console.log("Estado inicial = "+dfaRawData.start)
console.log("Estado de Aceitação = "+dfaRawData.acceptanceStates)
console.log("Conjunto de transicoes\n"+JSON.stringify(dfaRawData.transitions));

document.getElementById("playBtn").addEventListener("click", async (event) => {
  const input = document.getElementById("word");
  if (input.value !== "") {
    document.getElementById("resetBtn").disabled = true;
    const DFA = new DeterministcFiniteAutomata(dfaRawData);
    const { nodes, links } = Graph.graphData();
    const currState = { id: "S0", index: 0 };
    nodes[currState.index].active = true;
    Graph.graphData({ nodes, links });
    for (let letter of input.value.split("")) {
      await sleep(1000);
      const nextState = DFA.move(currState.id, letter);
      console.log("\nEstado atual="+currState.id+"\nCaractere a ser consumido="+letter+"\nProximo estado="+nextState);
      currState.id = nextState;
      currState.index = nodes.findIndex((item) => item.id === nextState);
      // nodes.forEach((node) => {
      //   node.active = false;
      // });
      nodes[currState.index].active = true;
      Graph.graphData({ nodes, links });
    }
    const header = document.getElementsByTagName("h1")[0];
    if (DFA.test(input.value)) {
      header.innerHTML = "CADEIA ACEITA";
      header.style.color = "lawngreen";
    } else {
      header.innerHTML = "CADEIA REJEITADA";
      header.style.color = "red";
    }
    document.getElementById("resetBtn").disabled = false;
  }
});

document.getElementById("resetBtn").addEventListener("click", async (event) => {
  const { nodes, links } = Graph.graphData();
  nodes.forEach((node) => {
    node.active = false;
  });
  header.innerHTML = "";
  header.style.color = "none";
  Graph.graphData({ nodes, links });
});
