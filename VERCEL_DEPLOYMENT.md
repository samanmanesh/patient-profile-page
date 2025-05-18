# Vercel Deployment Guide

## Deployment Steps

1. Ensure your code is committed to a Git repository (GitHub, GitLab, Bitbucket)
2. Login to your Vercel account
3. Create a new project and import your repository
4. Configure the project:
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

## Environment Variables

Add these environment variables in your Vercel project settings:

- `NEXT_PUBLIC_API_URL`: Leave empty to use relative URLs (recommended)

## Static Data Files

The application uses static JSON files for data. When deploying to Vercel:

1. All JSON data files from `app/data/` are copied to `public/data/`
2. The app uses a data helper (`app/lib/data.ts`) that:
   - In development: Reads directly from the filesystem
   - In production: Fetches data files from the `/data/` URL path

## Important Notes

1. **Read-only in Production**: In Vercel's serverless environment, the filesystem is read-only
   - Write operations (add/update/delete) will not persist between requests
   - This implementation provides a fallback for demo purposes only

2. **For a Production App**: Consider implementing one of these options:
   - Use Vercel KV or other database service for persistent storage
   - Add a proper database integration (MongoDB, Supabase, etc.)

## Troubleshooting

If you encounter deployment issues:

1. Check Vercel Function Logs for detailed error messages
2. Verify environment variables are set correctly
3. Ensure all JSON data files exist in the `/public/data/` directory
4. Make sure your API routes are using the async data helpers from `app/lib/data.ts` 