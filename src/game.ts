import { randomInt } from "./utils";

export type Grid = number[][];

export type Position = { y: number; x: number };

const maybeReverse = (isReverse: boolean) => (xs: number[]) =>
  isReverse ? xs.reverse() : xs;

const getColumns = (grid: Grid, isReverse: boolean) =>
  grid
    .map((row, y) => row.map((_, x) => grid[y][x]))
    .map(maybeReverse(isReverse));

const getRows = (grid: Grid, isReverse: boolean) =>
  grid.map(maybeReverse(isReverse));

const padLeft = <T>(pad: T[], xs: T[]): T[] =>
  xs.length < pad.length ? pad.slice(xs.length - pad.length).concat(xs) : xs;

const shiftZeroes = (xs: number[]): number[] =>
  padLeft([0, 0, 0, 0], xs.filter(x => x !== 0));

const mergeRow = (row: number[]) => {
  let [a, b, c, d] = shiftZeroes(row);

  if (d === c) {
    d = d + c;
    c = b;
    b = a;
    a = 0;
  }

  if (c === b) {
    c = c + b;
    b = a;
    a = 0;
  }

  if (b === a) {
    b = b + a;
    a = 0;
  }

  return [a, b, c, d];
};

const findZeroes = (grid: Grid): Position[] =>
  grid.reduce(
    (acc: Position[], row, y) =>
      row.reduce(
        (acc2: Position[], cell, x) => (!cell ? [...acc2, { y, x }] : acc2),
        acc
      ),
    []
  );

const mergeGrid = (grid: Grid) => grid.map(mergeRow);

interface Mergers {
  Right: (grid: Grid) => Grid;
  Left: (grid: Grid) => Grid;
  Down: (grid: Grid) => Grid;
  Up: (grid: Grid) => Grid;
}

const mergers: Mergers = {
  Right: mergeGrid,
  Left: (grid: Grid) => getRows(mergeGrid(getRows(grid, true)), true),
  Down: (grid: Grid) => getColumns(mergeGrid(getColumns(grid, false)), false),
  Up: (grid: Grid) =>
    getColumns(mergeGrid(getColumns(grid, true)), false).reverse()
};

export type Direction = keyof Mergers;

export const merge = (direcion: Direction) => (grid: Grid) => {
  const merged = mergers[direcion](grid);
  const zeroes = findZeroes(merged);

  console.log(zeroes);

  if (!zeroes.length) {
    console.log("game over");
    return merged;
  }

  if (JSON.stringify(merged) !== JSON.stringify(grid)) {
    const zero = zeroes[randomInt(0, zeroes.length - 1)];

    merged[zero.y][zero.x] = 2;
  }

  return merged;
};
