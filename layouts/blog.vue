<template>
  <div class="str-root-blog">
    <nuxt/>
  </div>
</template>
<style lang="scss">
.str-root-blog {
  width: 100%;
  min-height: 100%;
  word-break: break-all;
  padding: 2rem;
  background: #ffffff;
  color: #222222;
  line-height: 1.44;

  .str-name-list {
    padding: 0 20px;

    ul {
      padding: 0;
      margin: 0;

      > li {
        line-height: 1.7;
        font-size: 1.6rem;

        a {
          color: #333333;
        }
      }
    }
  }
}
</style>
