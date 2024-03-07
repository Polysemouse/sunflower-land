export class Label extends Phaser.GameObjects.Container {
  nameText: Phaser.GameObjects.BitmapText | undefined = undefined;
  label: any | undefined = undefined;

  constructor(
    scene: Phaser.Scene,
    text: string,
    type: "brown" | "grey" = "grey"
  ) {
    super(scene, 0, 0);
    this.scene = scene;

    const lines = text.split("\n");
    const maxLength = Math.max(...lines.map((line) => line.trim().length));
    const width = maxLength * 4 - 1;
    const height = lines.length * 7 - 2;

    this.nameText = scene.add.bitmapText(
      -width / 2,
      -height / 2,
      "Teeny Tiny Pixls",
      text,
      5
    );

    this.label = (this.scene.add as any).rexNinePatch({
      x: 0,
      y: 0,
      width: width + 6,
      height: height + 6,
      key: type === "brown" ? "brown_label" : "label",
      columns: [3, 3, 3],
      rows: [3, 3, 3],
      baseFrame: undefined,
      getFrameNameCallback: undefined,
    });

    this.add(this.label);
    this.add(this.nameText);

    this.setDepth(1);

    // if (icon) {
    // const sprite = scene.add.sprite(0, 0, "hammer");
    // sprite.setPosition(-2, -2);

    // this.add(sprite);
    // }
  }

  public setText(text: string) {
    const lines = text.split("\n");
    const maxLength = Math.max(...lines.map((line) => line.trim().length));
    const width = maxLength * 4 - 1;
    const height = lines.length * 7 - 2;

    this.label.resize(width + 6, height + 6);
    this.nameText
      ?.setText(text)
      .setX(-width / 2)
      .setY(-height / 2);
  }
}
