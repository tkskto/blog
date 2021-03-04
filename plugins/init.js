export default async function () {
    await navigator.serviceWorker.register('/blog/sw.js');
}
