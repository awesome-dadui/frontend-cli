class Game extends PIXI.Application {

  constructor(config) {
    super(config)

    document.body.appendChild(this.view)

    var react = new PIXI.Graphics()
    react.beginFill(0xff0000, 0.5)
    react.drawRect(0, 0, 50, 50)
    react.endFill()
    this.stage.addChild(react)

    var bunny = PIXI.Sprite.from('./bunny.png')
    this.stage.addChild(bunny)
    bunny.interactive = true
    bunny.buttonMode = true
    bunny.anchor.set(0.5, 0.5)
    bunny.x = 75
    bunny.y = 25
    bunny.on('pointerdown', () => {
      alert('click')
    })
  }
}