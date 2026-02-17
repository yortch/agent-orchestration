import { Entity } from "./entity.js";

export class Invader extends Entity {
  constructor({ x, y, width = 42, height = 28, row = 0, column = 0 } = {}) {
    super({ x, y, width, height });
    this.row = row;
    this.column = column;
  }

  render(context) {
    context.fillStyle = "#ff9ac5";
    context.fillRect(this.x, this.y, this.width, this.height);

    context.fillStyle = "#ffe9f4";
    context.fillRect(this.x + 6, this.y + 7, 7, 7);
    context.fillRect(this.x + this.width - 13, this.y + 7, 7, 7);
  }
}
