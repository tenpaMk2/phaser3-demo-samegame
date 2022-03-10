// https://github.com/digitsensitive/phaser3-typescript/blob/master/src/games/breakout/src/objects/ball.ts

import * as Phaser from "phaser";

export class Item extends Phaser.GameObjects.Text {
  constructor(
    public scene: Phaser.Scene,
    private _row: number,
    private _column: number,
    public length: number,
    text?: string
  ) {
    super(scene, 0, 0, text, {});

    this.column = _column;
    this.row = _row;
    if (!text) {
      const marks = ["🍎", "🍇", "🍌"];
      const random = new Phaser.Math.RandomDataGenerator();
      this.text = random.pick(marks);
    } else {
      this.text = text;
    }

    this.setFontSize(length);

    this.scene.add.existing(this);
  }

  get column() {
    return this._column;
  }

  set column(num: number) {
    this._column = num;
    this.x = num * this.length;
  }

  get row() {
    return this._row;
  }

  set row(num: number) {
    this._row = num;
    this.y = num * this.length;
  }
}
