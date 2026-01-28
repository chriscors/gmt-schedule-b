import type { VercelRequest, VercelResponse } from '@vercel/node';

const FIND_ENDPOINT = 'https://uscensus.prod.3ceonline.com/ui/tradedata/export/schedule/find';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid code parameter' });
  }

  try {
    // Forward the request to the Census API
    const url = `${FIND_ENDPOINT}/${code}/US/US/EN`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Origin': 'https://uscensus.prod.3ceonline.com',
        // Forward any cookies from the client
        ...(req.headers.cookie && { 'Cookie': req.headers.cookie }),
      },
    });

    // Get the response data
    const data = await response.json();

    // Forward any Set-Cookie headers back to the client
    const setCookieHeaders = response.headers.get('set-cookie');
    if (setCookieHeaders) {
      res.setHeader('Set-Cookie', setCookieHeaders);
    }

    // Return the response
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Census API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to find Schedule B codes',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
