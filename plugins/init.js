export default async function () {
    await navigator.serviceWorker.register('/sw.js');
}
