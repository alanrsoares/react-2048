import * as React from "react";

export type Grid = number[][];

export default ({ data }: { data: Grid }) => (
  <div className="Grid">
    {data.map((row, y) => (
      <div className="Grid-row" key={`row-${y}`}>
        {row.map((tile, x) => (
          <div className={`Grid-tile tile-${tile}`} key={`tile-${x}`}>
            {!!tile ? tile : null}
          </div>
        ))}
      </div>
    ))}
  </div>
);
