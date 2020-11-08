<template>
  <component class="blog-name" :is="tag"><span>So What!?</span></component>
</template>
<script>
export default {
  props: {
    tag: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="scss">
.blog-name {
  font-size: 3.2rem;
  text-align: center;
  font-weight: bold;
  margin-bottom: 60px;

  > span {
    padding: 10px 40px;
    border-bottom: 1px solid #999;
  }
}
</style>
