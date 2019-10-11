import Konva from 'konva'

import Polygon, { Points } from './Polygon'

export default class KonvaCanvas {
  private stage: Konva.Stage
  private layer: Konva.Layer
  private polygons: Polygon[] = []

  constructor(container: HTMLDivElement) {
    this.stage = new Konva.Stage({
      container,
    })
    this.layer = new Konva.Layer()
    this.stage.add(this.layer)
    this.polygons.push(this.createPolygon())
    this.layer.add(this.polygons[0])
    this.polygons[0].watchMouseMove()
    this.stage.draw()

    this.stage.on('click', this.handleStageClick.bind(this))
    this.stage.on('mousemove', this.handleStageMouseMove.bind(this))
    this.handleDocumentKeyup = this.handleDocumentKeyup.bind(this)
    document.addEventListener('keyup', this.handleDocumentKeyup)
  }

  public makeRandomPoints() {
    let n = 0
    while(n < 1000) {
      const width = this.stage.width()
      const height = this.stage.height()
      const x = Math.random() * width
      const y = Math.random() * height
      console.log({x,y})
      this.polygons[0].addPoint([x, y])
      n++
    }
    this.stage.draw()
  }

  public destroy() {
    document.removeEventListener('keyup', this.handleDocumentKeyup)
  }

  public updateSize(width: number, height: number) {
    this.stage.setAttrs({ width, height })
    this.stage.draw()
  }

  private handleStageClick() {
    const pos = this.stage.getPointerPosition()
    const polygon = this.polygons.find((it: Polygon) => it.active && !it.close)
    if (!pos || !polygon) { return }
    polygon.addPoint([pos.x, pos.y])
    this.stage.draw()
  }

  private handleDocumentKeyup(e: any) {
    // c key
    if (e.keyCode !== 67) { return }
    const polygon = this.polygons.find((it: Polygon) => it.active)
    if (!polygon) { return }
    polygon.setDraggable(true)
    polygon.close = true
    this.stage.draw()
  }

  private handleStageMouseMove() {
    // this.stage.batchDraw()
  }

  private createPolygon(): Polygon {
    const polygon = new Polygon({
      fill: '#ff0000',
      stroke: '#ff0000',
      points: [],
      draggable: false,
    })
    polygon.active = true
    return polygon
  }

}
