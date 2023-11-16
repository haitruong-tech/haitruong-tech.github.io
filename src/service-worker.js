const cacheVersion = "v1";
const cacheKeepList = ["v1"];

const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info("using preload response");
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  try {
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }

    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }
};

const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCache = async () => {
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/",
      "/index.html",
      "/style.css",
      "/script.js",
      "/assets/icons/angle-down.svg",
      "/assets/images/contact.webp",
      "/assets/images/LI-Logo.svg",
      "/assets/images/Gmail_Logo.svg",
      "/assets/icons/menu-button.svg",
      "/assets/icons/close.svg",
      "/assets/fonts/Anton/Anton-Regular.ttf",
      "/assets/fonts/OpenSans/OpenSans-Regular.ttf",
      "/assets/fonts/OpenSans/OpenSans-Bold.ttf",
      "/assets/images/Laptop.webp",
      "/assets/images/smartbrain.webp",
      "/assets/images/background.webp",
      "/components/drawer-menu/drawer-menu.html",
      "/components/drawer-menu/drawer-menu.css",
      "/components/drawer-menu/drawer-menu.js",
      "/components/contact-form/contact-form.html",
      "/components/contact-form/contact-form.css",
      "/components/contact-form/contact-form.js",
      "https://haitruong-portfolio.imgix.net/images/exp.webp?auto=compress&fit=fill&w=560&dpr=2",
      "https://haitruong-portfolio.imgix.net/images/exp.webp?auto=compress&fit=fill&w=560",
      "https://haitruong-portfolio.imgix.net/images/background.webp?auto=compress&fit=fill&max-w=560",
      "https://haitruong-portfolio.imgix.net/images/background.webp?auto=compress&fit=fill&max-w=560&dpr=2",
      "https://haitruong-portfolio.imgix.net/images/background.webp?auto=compress&fit=fill&w=688",
      "https://haitruong-portfolio.imgix.net/images/background.webp?auto=compress&fit=fill&w=688&dpr=2",
      "https://haitruong-portfolio.imgix.net/images/background.webp?auto=compress&fit=fill&w=864",
      "https://haitruong-portfolio.imgix.net/images/background.webp?auto=compress&fit=fill&w=864&dpr=2",
    ])
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
      fallbackUrl: "/assets/icons/close.svg",
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(enableNavigationPreload());
  event.waitUntil(deleteOldCache());
});
