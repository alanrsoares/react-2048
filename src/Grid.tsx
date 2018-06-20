import * as React from "react";

import { Grid } from "./game";

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
