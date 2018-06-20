import { compose, reverse } from "ramda";

import { randomInt } from "./utils";

export type Grid = number[][];

export type Position = { y: number; x: number };

const maybeReverse = (isReverse: boolean) => (xs: number[]) =>
  isReverse ? xs.reverse() : xs;

const getColumns = (isReverse: boolean) => (grid: Grid) =>
  grid
    .map((row, j) => row.map((_, i) => grid[i][j]))
    .map(maybeReverse(isReverse));

const getRows = (isReverse: boolean) => (grid: Grid) =>
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
  Left: compose(getRows(true), mergeGrid, getRows(true)),
  Down: compose(getColumns(false), mergeGrid, getColumns(false)),
  Up: compose(reverse, getColumns(false), mergeGrid, getColumns(true))
};

export type Direction = keyof Mergers;

export const merge = (direcion: Direction) => (grid: Grid) => {
  const merger = mergers[direcion];
  const merged = merger(grid);
  const zeroes = findZeroes(merged);

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
