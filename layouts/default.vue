<template>
    <div class="str-root">
        <nuxt/>
    </div>
</template>
<style>
html, body, div, span,
h1, h2, h3, h4, h5, h6,
p, pre, a, img, button,
ul, ol, li,
dl, dt, dd, table, th, td,
header, main, nav, footer {
  margin: 0;
  padding: 0;
}

html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, YuGothic, "Hiragino Kaku Gothic", Meiryo, sans-serif;
  font-size: 62.5%;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}

*, *:before, *:after {
  box-sizing: border-box;
}

html, body, div, canvas {
  margin: 0;
}

html, body, .str-root {
  width: 100%;
  height: 100%;
}

body > #__nuxt {
  height: 100%;
}

#__layout {
  width: 100%;
  height: 100%;
}

img {
  max-width: 100%;
  vertical-align: top;
}
</style>
