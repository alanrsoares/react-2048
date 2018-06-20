import * as React from "react";
import { render } from "react-dom";
import { evolve } from "ramda";

import { merge, Direction, Grid } from "./game";
import GridComponent from "./Grid";

import "./styles.css";

const SEED_GRID: Grid = [
  [0, 0, 0, 0],
  [0, 2, 0, 0],
  [0, 2, 2, 0],
  [0, 0, 0, 0]
];

const getDirection = (s: string) => (s.match(/^Arrow(\w+)/) || [])[1];

interface State {
  grid: Grid;
}

class App extends React.Component<State> {
  state = {
    grid: SEED_GRID
  };

  componentDidMount() {
    document.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyUp);
  }

  handleKeyUp = (e: KeyboardEvent) => {
    if (!e.key.startsWith("Arrow")) {
      return;
    }

    const direction = getDirection(e.key) as Direction;

    console.log(direction);

    this.setState(
      evolve({
        grid: merge(direction)
      })
    );
  };

  render() {
    return (
      <div>
        <header>
          <h1 className="heading">2048</h1>
        </header>
        <GridComponent data={this.state.grid} />
        <section className="hint">use ←, ↑, → and ↓ to play</section>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
