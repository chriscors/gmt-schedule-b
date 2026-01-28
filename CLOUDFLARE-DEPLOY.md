# Cloudflare Worker Deployment Guide

This guide explains how to deploy the Census Schedule B proxy as a Cloudflare Worker.

## Prerequisites

- Cloudflare account (free tier works)
- Node.js installed locally

## Deployment Steps

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Create wrangler.toml Configuration

Create a `wrangler.toml` file in the project root:

```toml
name = "census-schedule-b-proxy"
main = "cloudflare-worker.js"
compatibility_date = "2024-01-01"

[env.production]
name = "census-schedule-b-proxy"
routes = [
  { pattern = "your-domain.com/*", zone_name = "your-domain.com" }
]
```

### 4. Deploy the Worker

```bash
wrangler deploy
```

### 5. Get Your Worker URL

After deployment, Wrangler will show your worker URL:
```
https://census-schedule-b-proxy.your-subdomain.workers.dev
```

## Update Your React App

### For iframe approach:

Update `src/components/ScheduleBProxy.jsx`:

```javascript
<iframe
    ref={iframeRef}
    src="https://census-schedule-b-proxy.your-subdomain.workers.dev/ui/"
    className="schedule-b-iframe"
    onLoad={onIframeLoad}
    title="Schedule B Search Engine"
    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
/>
```

### For custom domain:

1. Add a custom domain in Cloudflare Workers dashboard
2. Update your app to use your custom domain
3. The proxy will intercept ALL requests to that domain

## Testing

Test the worker by visiting:
```
https://your-worker-url.workers.dev/ui/
```

You should see the Census Schedule B search interface load without CORS errors.

## Free Tier Limits

- 100,000 requests per day
- 10ms CPU time per request

This should be more than enough for typical usage.

## Troubleshooting

### CORS errors still occurring

- Make sure you're accessing the worker URL, not the Census site directly
- Check browser console for any error messages
- Verify the interceptor script is present in the HTML (View Source)

### Worker not responding

- Check Wrangler logs: `wrangler tail`
- Verify deployment: `wrangler deployments list`
- Check Cloudflare dashboard for errors

### Script injection not working

- The interceptor should appear right after `<head>` in the HTML
- If not, check the worker's HTML modification logic
- Try clearing browser cache and reloading
