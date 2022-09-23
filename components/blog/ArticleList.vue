<template>
    <nav class="px-6">
        <ul class="p-0 m-0 flex flex-col gap-y-3">
            <li class="leading-relaxed text-xl" v-for="item in list" :key="item.id">
                <nuxt-link class="text-neutral-900" :to="`/blog/${item.title}/`">{{item.title}}</nuxt-link>
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
