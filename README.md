# Image Converter

Simple image converter that runs in your browser

## How to use

1. Open `index.html` in a modern browser.

2. Select an image using the **"Select an image"** field.

3. Choose the output format (PNG, JPEG, or WEBP).

4. Click **Convert** and then **Download Image** to save the converted file.

**Notes**

- The BMP option has been removed for browser compatibility reasons; supported formats are PNG, JPEG, and WEBP.

- The conversion is done entirely on the client using a `canvas` element; no image is sent to servers.

- If the chosen format is not supported by the browser, the converter attempts to generate a PNG as a fallback.
