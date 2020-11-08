<template>
  <div class="str-category">
    <blog-name tag="h1" />
    <div class="category-content">
      <the-sidebar :all-article-data="articles"/>
      <div class="str-category-item">
        <section class="str-category-section">
          <h2 class="title">{{categoryName}}の記事一覧</h2>
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

<style lang="scss" scoped>
.str-category {
  .category-content {
    display: flex;

    @media screen and (max-width: 768px) {
      flex-direction: column;
    }
  }
}

.str-category-item {
  padding: 20px;
  order: 1;
  width: 70%;

  .title {
    font-size: 4rem;
    border-bottom: 1px solid #444444;
    margin-top: 0;
    margin-bottom: 24px;

    @media screen and (max-width: 768px) {
      font-size: 2.0rem;
    }
  }

  .str-category-section {
    display: block;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 0;
  }
}
</style>
