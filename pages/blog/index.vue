<template>
  <div>
    <blog-name tag="h1"/>
    <div class="flex md:flex-col gap-x-8">
      <the-sidebar :all-article-data="articles"/>
      <the-article :level="2" v-if="title && content" :title="title" :text="content" :date="date"/>
    </div>
  </div>
</template>

<script>
import TheArticle from '~/components/blog/TheArticle';
import TheSidebar from '~/components/blog/TheSidebar';
import BlogName from '~/components/blog/BlogName';

// ブログTOP

export default {
  layout: 'blog',
  head() {
    return {
      htmlAttrs: {lang: 'ja'} ,
      title: 'So What!?',
      meta: [
        { hid: 'description', name: 'description', content: 'These are logs of tkskto' },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:url', property: 'og:url', content: 'https://tkskto.me/blog/' },
        { hid: 'og:title', property: 'og:title', content: this.title },
        { hid: 'og:site_name', property: 'og:site_name', content: 'So What!?' },
        { hid: 'og:image', property: 'og:image', content: 'https://tkskto.me/blog/images/ogp.png' },
        { hid: 'og:description', property: 'og:description', content: this.title },
        { hid: 'twitter:card', property: 'twitter:card', content: 'summary' },
        { hid: 'twitter:creator', property: 'twitter:creator', content: 'tkskto' },
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
