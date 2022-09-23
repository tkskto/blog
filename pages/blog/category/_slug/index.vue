<template>
  <div>
    <blog-name tag="h1" />
    <div class="flex md:flex-col">
      <the-sidebar :all-article-data="articles"/>
      <div class="p-4 order-1 w-3/4 leading-relaxed md:p-0 md:w-full">
        <section class="block">
          <h2 class="text-6xl leading-relaxed border-b border-neutral-700 mt-0 mb-6 md:text-3xl">{{categoryName}}の記事一覧</h2>
          <article-list :list="categoryData"/>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import ArticleList from '~/components/blog/ArticleList';
import TheSidebar from '~/components/blog/TheSidebar';
import BlogName from '~/components/blog/BlogName';

// category

export default {
  layout: 'blog',
  head() {
    return {
      htmlAttrs: {lang: 'ja'} ,
      title: `${this.categoryName} | blog | tkskto`,
      meta: [
        { hid: 'description', name: 'description', content: 'These are logs of tkskto' }
      ],
    };
  },
  components: {
    ArticleList,
    TheSidebar,
    BlogName,
  },
  asyncData(context) {
    const {articles, categoryName, categoryData} = context.payload;
    return {
      articles,
      categoryName,
      categoryData,
    };
  },
};
</script>
