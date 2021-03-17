export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const treatRawData = ({ states, transitions }) => {
  const treatedNodes = states.map((node, index) => {
    return {
      id: node,
      type: index == 0 ? "start" : index == states.length - 1 ? "end" : "",
      active: false,
    };
  });

  const treatedLinks = [];
  for (let state of Object.keys(transitions)) {
    for (let value of Object.keys(state)) {
      treatedLinks.push({
        source: state,
        target: transitions[state][value],
        value: value,
        curvature: Math.random().toFixed(1),
        rotation: Math.random().toFixed(1),
        active: false,
      });
    }
  }

  return {
    nodes: treatedNodes,
    links: treatedLinks,
  };
};
