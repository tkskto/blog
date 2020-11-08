<template>
  <nav class="str-name-list">
    <ul>
      <li v-for="item in list" :key="item.id">
        <nuxt-link :to="`/blog/${item.title}/`">{{item.title}}</nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "ArticleList",
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.str-article-list {
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
</style>
