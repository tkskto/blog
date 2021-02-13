<template>
  <div class="str-side">
    <section class="str-article-section">
      <h2>カテゴリ</h2>
      <category-list :all-article-data="allArticleData"/>
      <h2>記事</h2>
      <article-list :list="allArticleData"/>
      <h2>ご注意</h2>
      <p class="text">このサイトはアクセス解析のためにGoogle Analyticsを利用しているため、ページを閲覧するとIPアドレスなどの情報がGoogleに送信されます。</p>
    </section>
  </div>
</template>

<script>
import CategoryList from '~/components/blog/CategoryList';
import ArticleList from '~/components/blog/ArticleList';

// サイドナビ

export default {
  name: 'TheSidebar',
  components: {
    ArticleList,
    CategoryList,
  },
  props: {
    allArticleData: {
      type: Array,
      required: true,
      default: []
    }
  },
};
</script>

<style scoped lang="scss">
.str-side {
  width: 30%;
  order: 2;
  padding: 80px 10px 0;

  @media screen and (max-width: 768px) {
    width: 100%;
  }

  .str-article-section h2 {
    margin-bottom: 8px;

    &:not(:first-child) {
      margin-top: 16px;
    }
  }

  .text {
    font-size: 1.4rem;
  }
}
</style>
