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
      if (transitions[state][value]) {
        if (Array.isArray(transitions[state][value])) {
          let singleTransition;
          for (const iterator of transitions[state][value]) {
            singleTransition = {
              [state]: {
                [value]: iterator,
              },
            };
            assembleLinks(
              treatedLinks,
              singleTransition,
              alphabet,
              state,
              value,
              transitions
            );
          }
        } else {
          assembleLinks(treatedLinks, transitions, alphabet, state, value);
        }
      }
    }
  }
  return {
    nodes: treatedNodes,
    links: treatedLinks,
  };
};

function getCurvature(source, target, transitions, alphabet) {
  if (source === target) return 1;
  else return 0.5;
}

function assembleLinks(
  treatedLinks,
  transitions,
  alphabet,
  state,
  value,
  allTransitions = transitions
) {
  if (
    state === transitions[state][value] &&
    treatedLinks.some((l) => l.source === state && l.target === state)
  ) {
    const index = treatedLinks.findIndex(
      (l) => l.source === state && l.target === state
    );
    treatedLinks[index].value = `${treatedLinks[index].value} | ${value}`;
  } else if (
    treatedLinks.some(
      (l) => l.source === state && l.target === transitions[state][value]
    )
  ) {
    const index = treatedLinks.findIndex(
      (l) => l.source === state && l.target === transitions[state][value]
    );
    treatedLinks[index].value = `${treatedLinks[index].value} | ${value}`;
  } else {
    treatedLinks.push({
      source: state,
      target: transitions[state][value],
      value: value,
      curvature: getCurvature(
        state,
        transitions[state][value],
        allTransitions,
        alphabet
      ),
      active: false,
    });
  }
}

export function getQuadraticXY(t, sx, sy, cp1x, cp1y, ex, ey) {
  return {
    x: (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cp1x + t * t * ex,
    y: (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cp1y + t * t * ey,
  };
}
