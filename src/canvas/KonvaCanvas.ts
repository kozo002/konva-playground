import Konva from 'konva'

export default class KonvaCanvas {
  private stage: Konva.Stage
  private layer: Konva.Layer

  constructor(container: HTMLDivElement) {
    this.stage = new Konva.Stage({
      container,
    })
    this.layer = new Konva.Layer()
    this.stage.add(this.layer)
    this.stage.draw()
  }

  public updateSize(width: number, height: number) {
    this.stage.setAttrs({ width, height })
    this.stage.draw()
  }

}
