<template>
  <div class="str-article">
    <blog-name tag="p" />
    <div class="article-content">
      <the-sidebar :all-article-data="articles"/>
      <the-article :level="1" v-if="title && content" :title="title" :text="content" :date="date"/>
    </div>
  </div>
</template>

<script>
import TheArticle from '~/components/blog/TheArticle';
import TheSidebar from '~/components/blog/TheSidebar';
import BlogName from '~/components/blog/BlogName';

// ブログ個別

export default {
  layout: 'blog',
  head() {
    return {
      htmlAttrs: {lang: 'ja'} ,
      title: `${this.title} | blog | tkskto`,
      meta: [
        { hid: 'description', name: 'description', content: 'These are logs of tkskto' },
        { hid: 'og:url', property: 'og:url', content: `https://tkskto.me/blog/${this.title}` },
        { hid: 'og:title', property: 'og:title', content: this.title },
      ],
    };
  },
  components: {
    TheArticle,
    TheSidebar,
    BlogName,
  },
  asyncData(context) {
    const {articles, title, content, date} = context.payload;
    return {
      articles,
      title,
      content,
      date,
    };
  },
};
</script>

<style lang="scss" scoped>
.str-article {
  .article-content {
    display: flex;

    @media screen and (max-width: 768px) {
      flex-direction: column;
    }
  }
}
</style>
