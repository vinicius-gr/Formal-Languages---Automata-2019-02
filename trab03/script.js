import * as shunt from "./shunt.js";
import { ExpressionTree } from "./expression-tree.js";
import { EpsilonNFA } from "./epsilon-nfa.js";
import { treatRawData, getQuadraticXY, sleep } from "./utils/index.js";
import * as Utils from "./utils/utils.js";

const postRE = shunt.infixToPostfix("a.b.c");

const et = new ExpressionTree().buildTree(postRE);
const enfa = new EpsilonNFA().evalRegex(et);
enfa.alphabet = Utils.removeDuplicateCharacters(enfa.alphabet);
console.log(enfa);
let Graph = {};
Graph = ForceGraph()(document.getElementById("graph"))
  .graphData(treatRawData(enfa))
  .backgroundColor("#000")
  .nodeId("id")
  .linkColor(() => "darkgrey")
  .linkSource("source")
  .linkTarget("target")
  .linkCurvature("curvature")
  .autoPauseRedraw(false)
  .linkDirectionalArrowLength(6)
  .nodeCanvasObject((node, ctx) => {
    if (node.type === "end") node.color = "#b2df8a";
    else if (node.type === "start") node.color = "#a6cee3";
    else node.color = "#1f78b4";
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
  .nodeColor((node) => {
    console.log(node);
    // if (node) node.color = "#b2df8a";
    // else if (node.start) node.color = "#a6cee3";
    // else node.color = "#1f78b4";
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
    const relLink = {
      x: end.x - start.x,
      y: end.y - start.y,
    };

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
Graph.d3Force("charge").strength(-300);

document.getElementById("playBtn").addEventListener("click", async () => {
  //   const input = document.getElementById("word");
  //   document.getElementById("resetBtn").disabled = true;
  //   if (input.value !== "") {
  //     let visited = new Set();
  //     let currentState = NFA.start;
  //     let word = input.value;
  //     let { nodes, links } = Graph.graphData();
  //     nodes[0].active = true;
  //     Graph.graphData({ nodes, links });
  //     while (!visited.has(currentState)) {
  //       const symbol = word[0];
  //       word = word.slice(1);
  //       if (!NFA.alphabet.includes(symbol)) {
  //         break;
  //       }
  //       await sleep(1000);
  //       console.log(`\nEstado atual=${currentState}`);
  //       if (Array.isArray(NFA.transitions[currentState][symbol])) {
  //         NFA.transitions[currentState][symbol].forEach((element) => {
  //           currentState = NFA.transitions[element][symbol];
  //           visited.add(currentState);
  //         });
  //       } else {
  //         currentState = NFA.transitions[currentState][symbol];
  //       }
  //       console.log(
  //         `\nCaractere a ser consumido=${symbol}\nProximo estado=${currentState}`
  //       );
  //       let { nodes, links } = Graph.graphData();
  //       if (currentState) {
  //         nodes[nodes.findIndex((n) => n.id === currentState)].active = true;
  //         Graph.graphData({ nodes, links });
  //       }
  //     }
  //     const header = document.getElementsByTagName("h1")[0];
  //     if (NFA.test(input.value)) {
  //       header.innerHTML = "CADEIA ACEITA";
  //       header.style.color = "lawngreen";
  //     } else {
  //       header.innerHTML = "CADEIA REJEITADA";
  //       header.style.color = "red";
  //     }
  //     document.getElementById("resetBtn").disabled = false;
  //   } else {
  //     header.innerHTML = "CADEIA REJEITADA";
  //     header.style.color = "red";
  //     document.getElementById("resetBtn").disabled = false;
  //   }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  const { nodes, links } = Graph.graphData();
  nodes.forEach((node) => {
    node.active = false;
  });
  header.innerHTML = "";
  header.style.color = "none";
  Graph.graphData({ nodes, links });
});
