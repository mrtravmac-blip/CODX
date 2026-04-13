export function createInput() {
  const keys = new Set();

  const toCode = (key) => {
    const map = {
      ArrowLeft: "left",
      a: "left",
      A: "left",
      ArrowRight: "right",
      d: "right",
      D: "right",
      ArrowUp: "jump",
      w: "jump",
      W: "jump",
      " ": "jump",
    };
    return map[key] ?? null;
  };

  window.addEventListener("keydown", (e) => {
    const code = toCode(e.key);
    if (!code) return;
    keys.add(code);
    e.preventDefault();
  });

  window.addEventListener("keyup", (e) => {
    const code = toCode(e.key);
    if (!code) return;
    keys.delete(code);
    e.preventDefault();
  });

  return {
    left: () => keys.has("left"),
    right: () => keys.has("right"),
    jump: () => keys.has("jump"),
  };
}
