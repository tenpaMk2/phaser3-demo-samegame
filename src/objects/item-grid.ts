// https://github.com/digitsensitive/phaser3-typescript/blob/master/src/games/breakout/src/objects/ball.ts

import * as Phaser from "phaser";
import { Item } from "./item";

export class ItemGrid {
  public grid: Item[][];

  constructor(
    public scene: Phaser.Scene,
    public numOfColumn: number,
    public numOfRow: number
  ) {
    this.grid = new Array(this.numOfRow)
      .fill(0)
      .map(() => new Array(this.numOfColumn).fill(undefined));
  }

  register(item: Item, column: number, row: number) {
    this.grid[row][column] = item;

    item.setInteractive();
    item.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      const x = pointer.downX;
      const y = pointer.downY;
      this.removeIfSame(Math.floor(x / 90), Math.floor(y / 90));
    });
  }

  unregister(column: number, row: number) {
    this.grid[row][column].destroy();
    this.grid[row][column] = undefined;
  }

  itemAt(column: number, row: number) {
    if (column < 0 || 6 <= column) {
      return undefined;
    }

    if (row < 0 || 10 <= row) {
      return undefined;
    }

    return this.grid[row][column];
  }

  removeIfSame(column: number, row: number) {
    const clickedMark = this.itemAt(column, row)?.text;

    if (!this.getNeighbor(column, row).includes(clickedMark)) {
      return;
    }
    this.mark(column, row);
    this.expandMark(clickedMark);
    this.removeMarked();
    this.drop();
    this.shift();
    this.update();
  }

  mark(column: number, row: number) {
    this.itemAt(column, row).text = "✗";
  }

  expandMark(mark: string) {
    let beforeStatus;
    let afterStatus;

    do {
      beforeStatus = this.generateGridStatus();

      for (let row = 0; row < 10; row++) {
        for (let column = 0; column < 6; column++) {
          const neighbor = this.getNeighbor(column, row);
          if (
            neighbor.includes("✗") &&
            this.itemAt(column, row)?.text === mark
          ) {
            this.mark(column, row);
          }
        }
      }

      afterStatus = this.generateGridStatus();
    } while (!this.isSameStatus(beforeStatus, afterStatus));
  }

  generateGridStatus() {
    const array = new Array(this.numOfRow)
      .fill(0)
      .map(() => new Array(this.numOfColumn).fill(undefined));

    for (let row = 0; row < 10; row++) {
      for (let column = 0; column < 6; column++) {
        array[row][column] = this.itemAt(column, row)?.text;
      }
    }

    return array;
  }

  isSameStatus(s1: string[][], s2: string[][]) {
    for (let row = 0; row < 10; row++) {
      for (let column = 0; column < 6; column++) {
        if (s1[row][column] !== s2[row][column]) {
          return false;
        }
      }
    }

    return true;
  }

  getNeighbor(column: number, row: number) {
    const maxColumn = this.grid[0].length;
    const maxRow = this.grid.length;

    const topMark = this.itemAt(column, row - 1)?.text;
    const rightMark = this.itemAt(column + 1, row)?.text;
    const bottomMark = this.itemAt(column, row + 1)?.text;
    const leftMark = this.itemAt(column - 1, row)?.text;

    return [topMark, rightMark, bottomMark, leftMark];
  }

  removeMarked() {
    for (let row = 0; row < 10; row++) {
      for (let column = 0; column < 6; column++) {
        if (this.itemAt(column, row)?.text === "✗") {
          this.unregister(column, row);
        }
      }
    }
  }

  drop() {
    let beforeStatus;
    let afterStatus;

    do {
      beforeStatus = this.generateGridStatus();

      for (let column = 0; column < 6; column++) {
        for (let row = 9; 0 <= row; row--) {
          const bottomItem = this.itemAt(column, row + 1);
          if (bottomItem === undefined && row + 1 < 10) {
            this.upsidedown(column, row);
          }
        }
      }

      afterStatus = this.generateGridStatus();
    } while (!this.isSameStatus(beforeStatus, afterStatus));
  }

  upsidedown(column: number, row: number) {
    const upItem = this.itemAt(column, row);
    const downItem = this.itemAt(column, row + 1);
    this.grid[row][column] = downItem;
    this.grid[row + 1][column] = upItem;
  }

  shift() {
    let beforeStatus;
    let afterStatus;

    do {
      beforeStatus = this.generateGridStatus();

      for (let column = 0; column < 5; column++) {
        if (!this.isWholeColumnEmpty(column)) {
          continue;
        }

        for (let row = 0; row < 10; row++) {
          const item = this.itemAt(column, row);
          this.grid[row][column] = this.itemAt(column + 1, row);
          this.grid[row][column + 1] = item;
        }
      }

      afterStatus = this.generateGridStatus();
    } while (!this.isSameStatus(beforeStatus, afterStatus));
  }

  update() {
    for (let row = 0; row < 10; row++) {
      for (let column = 0; column < 6; column++) {
        const item = this.itemAt(column, row);
        if (item) {
          item.x = column * 90;
          item.y = row * 90;
        }
      }
    }
  }

  isWholeColumnEmpty(column: number) {
    for (let row = 0; row < 10; row++) {
      if (this.itemAt(column, row) !== undefined) {
        return false;
      }
    }

    return true;
  }
}
