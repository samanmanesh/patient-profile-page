# Fixing Vercel Deployment Issues

The server-side error in your Vercel deployment is likely due to these issues:

## 1. Environment Variables

Your local `.env` file contains:
```
NEXT_PUBLIC_API_URL=http://localhost:3000%
```

This won't work in production for two reasons:
- It points to localhost
- It has a trailing `%` character

**Fix:**
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add `NEXT_PUBLIC_API_URL` with either:
   - Your deployed URL: `https://patient-profile-page-1ejcjjzvi-samanmaneshs-projects.vercel.app`
   - Or leave it empty/use a relative path: `/`

## 2. JSON Data Files Issue

Your API routes are trying to read and write to JSON files in the `app/data` directory:
```javascript
const dataFilePath = path.join(process.cwd(), 'app/data/alerts.json');
```

In Vercel's serverless environment:
- These files are read-only
- Write operations will fail
- The file system is ephemeral between function invocations

**Solutions (choose one):**

### Option A: Use Edge Functions with KV Storage (Recommended)
1. Use Vercel's KV storage for data:
```javascript
// Install dependencies
// npm install @vercel/kv

import { kv } from '@vercel/kv';

// Instead of file read:
const alerts = await kv.get('alerts') || { data: [], total: 0 };

// Instead of file write:
await kv.set('alerts', alerts);
```

### Option B: Database Integration
Connect to a proper database like:
- MongoDB Atlas
- Supabase
- PlanetScale (MySQL)
- Neon (PostgreSQL)

### Option C: Public Data Only
If this is a demo app with non-sensitive data:
1. Make your data files read-only
2. Move them to the `/public` directory
3. Update your code to fetch them via HTTP requests

Example:
```javascript
// Instead of file read:
const data = await fetch('/data/alerts.json').then(res => res.json());
```

### Option D: Static Data Approach
If your data is mostly static:
1. Import JSON files directly in your code:
```javascript
import alertsData from '@/app/data/alerts.json';
```
2. Use Next.js ISR or SSG for generated pages

## Next Steps

1. Implement one of the solutions above
2. Deploy again to Vercel
3. Check server logs if any issues persist

For a production application, Option A or B is strongly recommended. 