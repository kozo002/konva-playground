import Konva from 'konva'
import { Vector2d } from 'konva/types/types'
import { Context } from 'konva/types/Context'
import { ShapeConfig } from 'konva/types/Shape'

// const { _registerNode } = require('konva/lib/Global')
// const { Collection } = require('konva/lib/Util')
// const { Factory } = require('konva/lib/Factory')

export type PointTuple = [number, number]
export type Points = PointTuple[]
interface PolygonConfig extends ShapeConfig {
  points: Points
}

class Polygon extends Konva.Shape<PolygonConfig> {
  public points: Points = []
  public close: boolean = false
  public active: boolean = false
  public mousePoint: PointTuple = [0, 0]
  public draggingPointIndex: number | null = null

  constructor(config: PolygonConfig) {
    super(config)
    this.setAttrs({ dragBoundFunc: this._dragBoundFunc.bind(this) })
    this.on('dragend', this.handleDragEnd.bind(this))
  }

  public _sceneFunc(context: Context) {
    const fill = this.fill()
    const points = this.getAllPoints()

    // const svgPath = points.map((point: PointTuple, i: number) => {
    //   const [x, y] = point
    //   if (i === 0) {
    //     return `M${x} ${y}`
    //   } else {
    //     return `h ${x} v ${y}`
    //   }
    // })
    // const path = new Path2D(svgPath.join(' '))
    // console.log({ svgPath })

    // bg
    this.fill('rgba(255,0,0,0.5)')
    context.beginPath()
    points.forEach((point: PointTuple, i: number) => {
      const [x, y] = point
      if (i === 0) {
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y)
      }
    })
    if (this.close) {
      context.closePath()
    }
    context.fillStrokeShape(this)

    // @ts-ignore
    this.fill(null)

    // edge
    context.beginPath()
    points.forEach((point: PointTuple, i: number) => {
      const [x, y] = point
      if (i === 0) {
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y)
      }
    })
    if (this.close) {
      context.closePath()
    }
    context.fillStrokeShape(this)

    // apexes
    const apexPoints = this.close ? points : points.slice(0, points.length - 1)
    apexPoints.slice(0, points.length - 1).forEach((point: PointTuple) => {
      const [x, y] = point
      context.beginPath()
      context.arc(x, y, 2, 0, 360, false)
      context.closePath()
      context.fillStrokeShape(this)
    })
  }

  public _dragBoundFunc(pos: Vector2d): Vector2d {
    if (this.draggingPointIndex !== null) {
      this.batchDraw()
      return { x: 0, y: 0 }
    }
    const stage = this.getStage()
    if (!stage) { return pos }
    const mousePos = stage.getPointerPosition()
    if (!mousePos) { return pos }
    const range = 5
    let index = null
    const hitPoint = this.points.find((point: PointTuple, i: number) => {
      index = i
      return (
        mousePos.x >= point[0] - range && mousePos.x <= point[0] + range &&
        mousePos.y >= point[1] - range && mousePos.y <= point[1] + range
      )
    })
    if (hitPoint) {
      this.draggingPointIndex = index
      return { x: 0, y: 0 }
    }
    return pos
  }

  public watchMouseMove() {
    const stage = this.getStage()
    if (!stage) { return }
    stage.on('mousemove', this.handleMouseMove.bind(this))
  }

  private handleMouseMove(e: any) {
    const stage = this.getStage()
    if (!stage) { return }
    const pos = stage.getPointerPosition()
    if (!pos) { return }
    this.mousePoint = [pos.x, pos.y]
    stage.batchDraw()
  }

  private handleDragEnd(e: any) {
    if (this.draggingPointIndex !== null) {
      this.points = this.getAllPoints()
    }
    this.draggingPointIndex = null
    const { x, y } = this.attrs
    this.points = this.points.map(it => [it[0] + x, it[1] + y])
    this.setAttrs({ x: 0, y: 0 })
    const stage = this.getStage()
    if (!stage) { return }
    stage.batchDraw()
  }

  public addPoint(point: PointTuple) {
    // const { x, y } = this.attrs
    // this.points = [...this.points, [point[0] - (x || 0), point[1] - (y || 0)]]
    this.points.push(point)
  }

  private getAllPoints(): Points {
    const points = [...this.points]
    if (this.mousePoint && this.active && !this.close) { points.push(this.mousePoint) }
    const stage = this.getStage()
    if (this.draggingPointIndex !== null && stage) {
      const mousePos = stage.getPointerPosition()
      if (mousePos) {
        points.splice(this.draggingPointIndex, 1, [mousePos.x, mousePos.y])
      }
    }
    return points
  }

  private batchDraw() {
    const stage= this.getStage()
    if (stage) {
      stage.batchDraw()
    }
  }
}

// Polygon.prototype.className = 'Polygon'
// Polygon.prototype._centroid = true
// _registerNode(Polygon)

// Collection.mapMethods(Polygon)

export default Polygon
