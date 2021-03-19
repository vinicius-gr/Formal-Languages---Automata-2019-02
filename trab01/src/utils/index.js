export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const treatRawData = ({
  states,
  transitions,
  alphabet,
  start,
  acceptanceStates,
}) => {
  const treatedNodes = states.map((node) => {
    return {
      id: node,
      type: start.includes(node)
        ? "start"
        : acceptanceStates.includes(node)
        ? "end"
        : "",
      active: false,
    };
  });

  const treatedLinks = [];
  for (let state of Object.keys(transitions)) {
    for (let value of Object.keys(state)) {
      if (state === transitions[state][value] && treatedLinks.some((l) => l.source === state && l.target === state)) {
        const index = treatedLinks.findIndex((l) => l.source === state && l.target === state);
        treatedLinks[index].value = `${treatedLinks[index].value} | ${value}`;
      } else {
        treatedLinks.push({
          source: state,
          target: transitions[state][value],
          value: value,
          curvature: getCurvature(
            state,
            transitions[state][value],
            transitions,
            alphabet
          ),
          active: false,
        });
      }
    }
  }

  return {
    nodes: treatedNodes,
    links: treatedLinks,
  };
};

function getCurvature(source, target, transitions, alphabet) {
  return source === target
    ? 1
    : alphabet.split("").some((val) => transitions[target][val] === source)
    ? 0.5
    : 0;
}

export function getQuadraticXY(t, sx, sy, cp1x, cp1y, ex, ey) {
  return {
    x: (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cp1x + t * t * ex,
    y: (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cp1y + t * t * ey,
  };
}
