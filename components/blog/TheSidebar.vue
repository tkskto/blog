<template>
  <div class="w-1/4 order-2 ml-2 mt-20 mb-0 md:w-full">
    <section class="str-article-section">
      <h2 class="mb-2 text-2xl font-bold">カテゴリ</h2>
      <category-list :all-article-data="allArticleData"/>
      <h2 class="mb-2 text-2xl font-bold mt-6">記事</h2>
      <article-list :list="allArticleData"/>
      <h2 class="mb-2 text-2xl font-bold mt-6">ご注意</h2>
      <p class="text-xl">このサイトはアクセス解析のためにGoogle Analyticsを利用しているため、ページを閲覧するとIPアドレスなどの情報がGoogleに送信されます。</p>
      <br>
      <p class="text-xl">何か間違っている情報などがあれば<a href="https://twitter.com/tkskto/">Twitter</a>にてメッセージください。</p>
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
