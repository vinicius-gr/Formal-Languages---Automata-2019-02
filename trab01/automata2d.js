let Graph = {};
fetch("/data.json")
  .then((res) => res.json())
  .then((data) => {
    Graph = ForceGraph()(document.getElementById("graph"))
      .graphData(data)
      .backgroundColor("#fff")
      .nodeId("id")
      .nodeLabel("id")
      .nodeAutoColorBy("type")
      .linkColor("rgba(255,255,255,1)")
      .linkWidth(2)
      .linkSource("source")
      .linkTarget("target")
      .linkCurvature("curvature")
      .linkDirectionalParticles(2)
      // .linkDirectionalArrowLength(6)
      .linkDirectionalParticleSpeed(0.005)
      .nodeCanvasObject((node, ctx) => {
        ctx.beginPath();
        ctx.fillStyle = node.color;
        ctx.arc(node.x, node.y, 9, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.font = "8px Verdana";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.textBaseline = "middle";
        ctx.fillText(node.id, node.x, node.y);
        ctx.stroke();
      })
      .linkCanvasObjectMode(() => "after")
      .linkCanvasObject((link, ctx, scale) => {
        const MAX_FONT_SIZE = 8;
        const LABEL_NODE_MARGIN = Graph.nodeRelSize() * 1.5;

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
        if (link.curvature === "0.5") {
          textPos = Object.assign(
            ...["x", "y"].map((c) => ({
              [c]: start[c] + (end[c] - start[c]) / 2, // calc middle point
            }))
          );
        }

        if (link.curvature === "1" || link.curvature === "-1") {
          textPos = Object.assign(
            ...["x", "y"].map((c) => ({
              [c]: start[c] + (end[c] - start[c]) / 2, // calc middle point
            }))
          );
        }

        const relLink = { x: end.x - start.x, y: end.y - start.y };

        const maxTextLength =
          Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) -
          LABEL_NODE_MARGIN * 2;

        let textAngle = Math.atan2(relLink.y, relLink.x);
        // maintain label vertical orientation for legibility
        if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
        if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);

        const label = `${link.value}`;

        // estimate fontSize to fit in link length
        ctx.font = "1px Sans-Serif";
        const fontSize = Math.min(
          MAX_FONT_SIZE,
          maxTextLength / ctx.measureText(label).width
        );
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(
          (n) => n + fontSize * 0.2
        ); // some padding

        // draw text label (with background rect)
        ctx.save();
        ctx.translate(textPos.x, textPos.y);
        ctx.rotate(textAngle);

        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fillRect(
          -bckgDimensions[0] / 2,
          -bckgDimensions[1] / 2,
          ...bckgDimensions
        );

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "darkgrey";
        ctx.fillText(label, 0, link.curvature * 10);
        ctx.restore();
      });
  });

document.getElementById("playBtn").addEventListener("click", (event) => {
  const input = document.getElementById("word");
  if (input.value !== "") {
    console.log(input.value);
    const word = input.value.split("");
    console.log(word);
  }
});
