type ArticleMeta = {
    id: number
    date: string
    title: string
    category: string
}

type Page = {
    route: string
    payload: {
        articles: ArticleMeta[]
        title: string
        content: string
        date: Date
    }
}

type Category = {
    route: string
    payload: {
        articles: ArticleMeta
        categoryName: string
        categoryData: string
    }
}

type Route = Page | Category;
