import * as Phaser from "phaser";
import { Item } from "../objects/item";
import { ItemGrid } from "../objects/item-grid";

export class GameScene extends Phaser.Scene {
  public itemGrid: ItemGrid;

  constructor() {
    super("GameScene");
  }

  preload() {}

  create() {
    this.itemGrid = new ItemGrid(this, 6, 10);

    for (let row = 0; row < 10; row++) {
      for (let column = 0; column < 6; column++) {
        const item = new Item(this, row, column, 90);
        this.itemGrid.register(item, column, row);
      }
    }
  }

  update() {}
}
