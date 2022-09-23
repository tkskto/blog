<template>
  <component class="text-5xl text-center leading-loose font-bold mb-20" :is="tag">
      <span class="px-10 py-3 border-b border-neutral-400">So What!?</span>
  </component>
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
