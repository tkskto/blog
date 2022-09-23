<template>
    <nav class="px-6">
        <ul class="p-0 m-0 flex flex-col gap-y-3">
            <li class="leading-relaxed text-xl" v-for="(item, index) in categoryList" :key="index">
                <nuxt-link class="text-neutral-900" :to="`/blog/category/${item}/`">{{item}}</nuxt-link>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    name: 'CategoryList',
    props: {
        allArticleData: {
            type: Array,
            required: true,
            default: []
        }
    },
    computed: {
        categoryList() {
            const arr = [];
            const len = this.allArticleData.length;

            for (let i = 0; i < len; i++) {
                const item = this.allArticleData[i];

                if (!Array.isArray(item.category)) {
                    if (!arr.includes(item.category)) {
                        arr.push(item.category);
                    }
                }
            }

            return arr;
        },
    },
};
</script>
