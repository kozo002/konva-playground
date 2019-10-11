<template>
  <div
    ref="container"
    class="container" 
    :style="containerStyle"
  />
</template>

<script>
import KonvaCanvas from '@/canvas/KonvaCanvas'

export default {
  data: () => ({
    width: 0,
    height: 0,
    konvaCanvas: null,
  }),

  created() {
    window.addEventListener('resize', this.handleWindowResize)
    this.handleWindowResize()
  },

  mounted() {
    this.$nextTick(() => {
      this.initKonva()
    })
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
    this.konvaCanvas.destroy()
  },

  watch: {
    width: 'updateKonva',
    height: 'updateKonva',
  },

  computed: {
    containerStyle() {
      return { width: `${this.width}px`, height: `${this.height}px` }
    },
  },

  methods: {
    handleWindowResize() {
      const { innerWidth, innerHeight } = window
      this.width = innerWidth
      this.height = innerHeight
    },

    initKonva() {
      const { container } = this.$refs
      const { width, height } = this
      this.konvaCanvas = new KonvaCanvas(container)
      this.konvaCanvas.updateSize(width, height)
      this.konvaCanvas.makeRandomPoints()
    },

    updateKonva() {
      if (!this.konvaCanvas) { return }
      const { width, height } = this
      this.konvaCanvas.updateSize(width, height)
    },
  },
}
</script>

<style scoped>
.container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
}
</style>