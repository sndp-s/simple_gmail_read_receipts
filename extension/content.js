// NOTE :: Account for the case when view count increments when I view my own email.


// Constants
// selectors
const TRACKING_PIXEL_SELECTOR = 'img[alt="read-receipt"]';
const EMAIL_EDITOR_SELECTOR = ".AD";
// const VIEW_CONTAINER_SELECTOR = "body > div:nth-child(25) > div.nH.a4O > div > div.nH.aqk.aql.bkL > div.nH.bkK";
const EMAIL_VIEW_CONTAINER_SELECTOR = "#\\:1 > div > div:nth-child(3)";
const EMAIL_VIEW_MESSAGE_CONTAINER_SELECTOR = "#\\:1 > div";
const VIEW_COUNT_CONTAINER = "#\\:4 > div > div.iH.bzn";

// urls
const TRACKING_SERVER_BASE_URL = "https://read-receipts-server.deno.dev"; // NOTE :: Pick this from env - or popup.html
// Data
const OPEN_EYE_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"/></svg>
`;
const SLASHED_EYE_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z"/></svg>
`;

function showToast(message) {
    // Create a toast div
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '1000';
    toast.style.transition = 'opacity 0.5s ease-in-out';

    // Append the toast to the body
    document.body.appendChild(toast);

    // Fade out the toast after 1 second
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 1000);

    // Remove the toast after fade out
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 1500);
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function updateTrackingPixelInNewEmailEditor(trackingEnabled, emailEditorDialog) {
    // Find the message box where the email body is written
    const messageBox = emailEditorDialog.querySelector(`div:nth-child(1) > div:first-child > div:nth-child(3) > div:first-child > div:first-child > div:nth-child(4) > table:nth-child(2) > tbody > tr:first-child > td:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(1) > td:first-child > div:first-child > div:first-child > div:nth-child(2) > div:nth-child(3) > div:first-child > table:nth-child(2) > tbody > tr:first-child > td:nth-child(2) > div:nth-child(2) > div:first-child > div:first-child`);
    if (messageBox) {
        // Define a custom attribute to identify the tracking pixel
        if (trackingEnabled) {
            // Check if the tracking pixel is already present
            if (!messageBox.querySelector(TRACKING_PIXEL_SELECTOR)) {
                // Create a new img tag for the tracking pixel
                const trackingPixel = document.createElement('img');
                const trackingId = generateUUID();
                const trackingPixelUrl = `${TRACKING_SERVER_BASE_URL}/tracking_id/${trackingId}`; // Replace with your actual tracking URL
                trackingPixel.src = trackingPixelUrl;
                trackingPixel.alt = "email-tracker-pixel";
                // trackingPixel.setAttribute('data-tracking', 'email-pixel'); // Google strips these out - sanitisation
                trackingPixel.style.display = 'none';
                trackingPixel.style.width = '1px';
                trackingPixel.style.height = '1px';

                // Append the tracking pixel to the message box
                messageBox.appendChild(trackingPixel);
                console.log("Tracking pixel added.");
            }
        } else {
            // Find the tracking pixel if it exists and remove it
            const existingPixel = messageBox.querySelector(TRACKING_PIXEL_SELECTOR);
            if (existingPixel) {
                messageBox.removeChild(existingPixel);
                console.log("Tracking pixel removed.");
            }
        }
    } else {
        showToast("Failed to fetch the message box to toggle tracker pixel.");
    }
}

function handleNewMessageEditorDialogOpen(emailEditorDialog) {
    // Attach pixel tracker toggle button to the editor
    const lastTd = emailEditorDialog.querySelector('div:nth-child(1) > div:first-child > div:nth-child(3) > div:first-child > div:first-child > div:nth-child(4) > table:nth-child(2) > tbody > tr:first-child > td:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(2) > td:first-child > div:first-child > div:first-child > div:nth-child(4) > table:nth-child(4) > tbody > tr:first-child td:last-child');

    const newTd = document.createElement('td');
    newTd.style.marginLeft = "10px";

    const toggleTrackingButton = document.createElement('button');
    toggleTrackingButton.style.padding = "0px";
    toggleTrackingButton.style.height = "16px";
    toggleTrackingButton.style.width = "16px";
    toggleTrackingButton.style.border = "none"; // Remove button border
    toggleTrackingButton.style.background = "transparent"; // Make background transparent
    toggleTrackingButton.style.cursor = "pointer"; // Change cursor to pointer

    // Initial state
    let trackingEnabled = false;

    // Function to update button icon
    const updateButtonIcon = () => {
        if (trackingEnabled) {
            toggleTrackingButton.innerHTML = OPEN_EYE_SVG;
        } else {
            toggleTrackingButton.innerHTML = SLASHED_EYE_SVG;
        }
    };

    // Initialize button icon
    updateButtonIcon();

    // Toggle button action
    toggleTrackingButton.onclick = function() {
        trackingEnabled = !trackingEnabled;
        updateButtonIcon();

        // Toggle tracker pixel in the mail editor
        updateTrackingPixelInNewEmailEditor(trackingEnabled, emailEditorDialog);
    };

    newTd.appendChild(toggleTrackingButton);

    if (lastTd) {
        lastTd.parentNode.insertBefore(newTd, lastTd);
    } else {
        // console.error('Last <td> not found!');
        showToast("Unable to add tracker button to the editor");
    }
}

function handleEmailViewContainerOpen(emailViewContainer) {
    // ensure that img tag is present in the email view message container
    const emailViewMessageContainer = document.querySelector(EMAIL_VIEW_MESSAGE_CONTAINER_SELECTOR);
    if (emailViewMessageContainer) {

        const trackerPixels = emailViewMessageContainer.querySelectorAll(TRACKING_PIXEL_SELECTOR);
        
        // if present then extract the trakcing id out of it and fetch the view count from server and render it in the header
        if (trackerPixels) {
            trackerPixels.forEach(pixel => {
                pixel.style.display = "inline";
                pixel.style.height = "4px";
                pixel.style.width = "4px";
                pixel.style.borderRadius = "50px";
                pixel.style.background = "blue";
            })
        } else { // NOTE :: Fur debuggin purpose only, remove in final
            showToast("Tracker pixel not found");
        }
    } else { // NOTE :: Remove later / do it proper
        showToast("Email view message container not found");
    }
}

/**
 * Tracks new email editor dialog openings
 * Tracks full email view openings
 */
// NOTE :: Check if we can speed this up in anyway
const selectorsAndHandlersMap = [
    {
        selector: EMAIL_EDITOR_SELECTOR,
        handler: handleNewMessageEditorDialogOpen
    },
    {
        selector: EMAIL_VIEW_CONTAINER_SELECTOR,
        handler: handleEmailViewContainerOpen
    }
]
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            // Check if the added node is an element with class .AD
            if (node.nodeType === 1) {
                // if node or any of its decendants match type 1 then we use type one handler and leave, if not then try with type 2 and so on, 

                // const openedEmailEditorDialogs = node.matches(EMAIL_EDITOR_SELECTOR) || node.querySelectorAll(EMAIL_EDITOR_SELECTOR);
                // openedEmailEditorDialogs.forEach(openedEmailEditorDialog => handleNewMessageEditorDialogOpen(openedEmailEditorDialog));

                for (const {selector, handler} of selectorsAndHandlersMap) {
                    const matchedNodes = node.matches(selector)
                    ? [node]  // Direct match
                    : node.querySelectorAll(selector); // Descendant matches

                    if (matchedNodes.length > 0) {
                        matchedNodes.forEach(node => handler(node));
                        break; // Stop after the first match and handler execution
                    }
                }
            }
        });

        // NOTE :: Handle cleanup here 
        // mutation.removedNodes.forEach((node) => {
        //     // Check if the added node is an element with class .AD
        //     if (node.nodeType === 1) {
        //         const closedEmailDialogBoxes = node.matches(EMAIL_EDITOR_SELECTOR) || node.node.querySelectorAll(EMAIL_EDITOR_SELECTOR);
        //         // NOTE :: Handle cleanup here
        //         // closedEmailDialogBoxes.forEach(closedEmailDialog => handleNewMessageEditorDialogClose());
        //     }
        // });
    });
});

// Start observing for new mail editor dialog opening
observer.observe(document.body, { childList: true, subtree: true });
