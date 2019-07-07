<template>
  <div id="gameParent">
    <div id="gameArea"></div>
  </div>
</template>

<script>
import Phaser from 'phaser'

export default {
  props: {
    game: Object
  },
  components: {
  },
  data () {
    return {
      phaserInstance: false
    }
  },
  mounted () {
    // Custom game stuff

    // Configuration specific to Vue integration
    // https://photonstorm.github.io/phaser3-docs/Phaser.Types.Core.html#.GameConfig
    var config = {
      type: Phaser.AUTO,
      scale: {
        parent: 'gameArea',
        mode: Phaser.Scale.FIT,
        width: this.game.width,
        height: this.game.height,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    }

    this.phaserInstance = new Phaser.Game(Object.assign(config, this.game))
  }
}
</script>

<style>
body {
  height: 100vh;
  background-color: purple;
}
#gameParent {
  width: 100%;
  height: 100%;
}
#gameArea {
  margin-top: 0px;
}
</style>
