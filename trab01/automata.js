const Graph = ForceGraph3D({
  extraRenderers: [new THREE.CSS2DRenderer()],
})(document.getElementById("3d-graph"))
  .jsonUrl("./data.json")
  .nodeLabel("id")
  .nodeAutoColorBy("type")
  .nodeRelSize(8)
  .nodeResolution(16)
  .linkCurvature("curvature")
  .linkCurveRotation("rotation")
  .linkOpacity(0.5)
  .linkDirectionalParticles(4)
  .linkLabel((link) => {
    return link.value;
  })
  .nodeThreeObject((node) => {
    const nodeEl = document.createElement("div");
    nodeEl.textContent = node.id;
    nodeEl.style.color = "#fff";
    node.color = node.active ? "rgba(255, 150, 0, 1)" : node.color;
    nodeEl.style.fontFamily = "Verdana";
    return new THREE.CSS2DObject(nodeEl);
  })
  .nodeThreeObjectExtend(true)
  .linkThreeObjectExtend(true)
  .linkThreeObject((link) => {
    // extend link with text sprite
    console.log(link);
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

document.getElementById("playBtn").addEventListener("click", (event) => {
  const input = document.getElementById("word");
  if (input.value !== "") {
    console.log(input.value);
    const word = input.value.split("");
    console.log(word);

    const { nodes, links } = Graph.graphData();
    nodes[0].active = true;
    Graph.graphData({
      nodes: nodes,
      links: [...links],
    });
    Graph.nodeThreeObject(Graph.nodeThreeObject());
  }
});
