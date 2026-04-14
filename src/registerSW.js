export const registerSW = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
      } catch (error) {
        console.error('SW registration failed', error);
      }
    });
  }
};
