# Nuxt Spend Trail App

This app simplifies expense management for users, tracking their spending by uploading receipt and invoice images, leveraging advanced OCR technology for accurate data extraction.

<p align="center">
  <a href="https://spendtrail.vercel.app" target="_blank">
    <img width="1090" alt="Screenshot of SpendTrail app" src="/public/demo.png">
  </a>
</p>

## Features

- Built with Nuxt 3
- Usage of runtime config
- Server API routes using Nitro
- Responsive images (and custom provider) with Nuxt Image
- Interface with Bootstrap 5.3
- Mindee OCR API for data extraction
- Supabase's PostgreSQL database to store extracted data
- Supabase Storage to store receipt and invoice images

## Try it out

### Setup

```bash
# install dependencies
npm install

# serve in dev mode, with hot reload at localhost:3000
npm run dev

# build for production (universal)
npm run build
```
