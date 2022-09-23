<template>
  <article class="p-4 order-1 w-3/4 leading-relaxed md:p-0 md:w-full">
    <section class="block">
      <component class="text-6xl leading-relaxed border-b border-neutral-700 mt-0 mb-6 md:text-3xl md:leading-relaxed" :is="tag">{{title}}</component>
      <p class="text-right text-2xl text-neutral-700 mb-16">{{dateText}}</p>
      <div v-html="text"></div>
    </section>
  </article>
</template>

<script>
export default {
  name: 'TheArticle',
  props: {
    level: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  computed: {
    tag() {
      return `h${this.level}`;
    },
    dateText() {
      return `${this.date.getFullYear()}年${this.date.getMonth() + 1}月${this.date.getDate()}日`;
    },
  }
};
</script>
