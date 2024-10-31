// main server code (deno deploy)
const kv = await Deno.openKv();

const getKvItem = async (key) => {
  return await kv.get([key])?.value ?? null;
}

const setKvItem = async (key, value) => {
  return await kv.set([key], value);
}

const incrementTrackingIdCount = async (trackingId) => {
  let currentCount = await getKvItem(trackingId);
  console.log("currentCount", currentCount)
  await setKvItem(trackingId, (currentCount ?? 0) + 1);
} 

const getViewCount = async (trackingId) => {
  let currentCount = await getKvItem(trackingId);
  return currentCount;
}

const handleTracking = async (req: Request): Response => {
  const { pathname } = new URL(req.url);
  const trackingId = pathname.split("/")[2];
  await incrementTrackingIdCount(trackingId);
  return new Response("success", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0"
    },
  });
}

const handleGetViewCount = async (req: Request): Response => {
  const { pathname } = new URL(req.url);
  const trackingId = pathname.split("/")[2];
  return new Response(await getViewCount(tracking_id));
}

const handler = async (req: Request): Response => {
  const { pathname } = new URL(req.url);
  if (pathname.startsWith("/tracking_id/")) {
    return handleTracking(req);
  } else if (pathname.startsWith("/view_count/")) {
    return handleGetViewCount(req);
  } else if (pathname === "/") {
    // return new Response("Hello world");
    return new Response("Hello world", await kv.get(["123"], 111));
  } else {
    return new Response("404 Not Found", { status: 404 });
  }
}

Deno.serve(handler);

// dummy server code
const handler = async (rer) => {
    try {
      const url = "https://www.picsum.photos/50";
  
      // Fetch the image from the URL
      const response = await fetch(url);
      
      // Get the Content-Type from the original response
      const contentType = response.headers.get("Content-Type") || "image/jpeg";
      
      // Get the image as an ArrayBuffer
      const imageArrayBuffer = await response.arrayBuffer();
      const imageUint8Array = new Uint8Array(imageArrayBuffer);
  
      // Relay the image in the response with the original Content-Type
      return new Response(imageUint8Array, {
        headers: {
          "Content-Type": contentType,
          "Content-Length": imageUint8Array.length.toString(),
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "Pragma": "no-cache",
          "Expires": "0"
        },
      });
    } catch (error) {
      console.error("Failed to fetch image:", error);
      return new Response("Failed to fetch image", { status: 500 });
    }
  }

// Paste an img in the new email editor
const msgBox = document.querySelector('.AD > div:nth-child(1) > div:first-child > div:nth-child(3) > div:first-child > div:first-child > div:nth-child(4) > table:nth-child(2) > tbody > tr:first-child > td:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(1) > td:first-child > div:first-child > div:first-child > div:nth-child(2) > div:nth-child(3) > div:first-child > table:nth-child(2) > tbody > tr:first-child > td:nth-child(2) > div:nth-child(2) > div:first-child > div:first-child');
const img = document.createElement("img");
img.width = 50;
img.height = 50;
img.src = "https://read-receipts-server.deno.dev/trackme/123";
msgBox.appendChild(img);
// one liner
const msgBox = document.querySelector('.AD > div:nth-child(1) > div:first-child > div:nth-child(3) > div:first-child > div:first-child > div:nth-child(4) > table:nth-child(2) > tbody > tr:first-child > td:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(1) > td:first-child > div:first-child > div:first-child > div:nth-child(2) > div:nth-child(3) > div:first-child > table:nth-child(2) > tbody > tr:first-child > td:nth-child(2) > div:nth-child(2) > div:first-child > div:first-child'); const img = document.createElement("img"); img.width = 50; img.height = 50; img.src = "https://read-receipts-server.deno.dev/trackme/123"; msgBox.appendChild(img);



// new email editor selector
document.querySelector('.AD > div:nth-child(1) > div:first-child > div:nth-child(3) > div:first-child > div:first-child > div:nth-child(4) > table:nth-child(2) > tbody > tr:first-child > td:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(1) > td:first-child > div:first-child > div:first-child > div:nth-child(2) > div:nth-child(3) > div:first-child > table:nth-child(2) > tbody > tr:first-child > td:nth-child(2) > div:nth-child(2) > div:first-child > div:first-child')