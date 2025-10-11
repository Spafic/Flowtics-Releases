# Assets Folder# Flowtics Download Page - Assets

## Required FilesThis folder can contain additional assets for the download page.

Place these files in this folder to enhance your download page:## Recommended Assets to Add

### Favicon (Recommended)### 1. Favicon

- `favicon.ico` - Browser tab icon

- `favicon-32x32.png` - 32x32px PNGCreate a favicon for better branding:

- `favicon-16x16.png` - 16x16px PNG

- `apple-touch-icon.png` - 180x180px for iOS- `favicon.ico` - 16x16, 32x32, 48x48 px

- `favicon-32x32.png`

### Social Preview (Optional)- `favicon-16x16.png`

- `og-image.png` - 1200x630px for social media sharing- `apple-touch-icon.png` - 180x180 px

## Quick Setup### 2. Social Preview Image

1. Visit [favicon.io](https://favicon.io/)Create a preview image for social media sharing:

2. Upload your Flowtics logo

3. Download and place files here- `og-image.png` - 1200x630 px

- Shows Flowtics logo and tagline

## Add to index.html

### 3. App Icons

```html
<!-- In <head> section -->Optional platform-specific icons:

<link rel="icon" type="image/x-icon" href="assets/favicon.ico" />

<link
  rel="icon"
  type="image/png"
  sizes="32x32"
  href="assets/favicon-32x32.png"
/>- `icon-windows.png`

<link
  rel="apple-touch-icon"
  sizes="180x180"
  href="assets/apple-touch-icon.png"
/>- `icon-macos.png` - `icon-linux.png`

<!-- For social preview -->

<meta
  property="og:image"
  content="https://spafic.github.io/Flowtics-Releases/assets/og-image.png"
/>## Quick Favicon Generator
```

Use online tools:

- https://favicon.io/
- https://realfavicongenerator.net/

Upload your Flowtics logo and download the generated files to this folder.

## Adding Favicon to index.html

Add these lines to the `<head>` section:

```html
<link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
<link
  rel="icon"
  type="image/png"
  sizes="32x32"
  href="assets/favicon-32x32.png"
/>
<link
  rel="icon"
  type="image/png"
  sizes="16x16"
  href="assets/favicon-16x16.png"
/>
<link
  rel="apple-touch-icon"
  sizes="180x180"
  href="assets/apple-touch-icon.png"
/>
```

## Adding Social Preview Image

Add these meta tags to the `<head>` section:

```html
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://spafic.github.io/Flowtics-Releases/" />
<meta
  property="og:title"
  content="Download Flowtics - Inventory Management System"
/>
<meta
  property="og:description"
  content="Download Flowtics for Windows, macOS, and Linux. A powerful, modern inventory management system."
/>
<meta
  property="og:image"
  content="https://spafic.github.io/Flowtics-Releases/assets/og-image.png"
/>

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta
  property="twitter:url"
  content="https://spafic.github.io/Flowtics-Releases/"
/>
<meta
  property="twitter:title"
  content="Download Flowtics - Inventory Management System"
/>
<meta
  property="twitter:description"
  content="Download Flowtics for Windows, macOS, and Linux. A powerful, modern inventory management system."
/>
<meta
  property="twitter:image"
  content="https://spafic.github.io/Flowtics-Releases/assets/og-image.png"
/>
```
