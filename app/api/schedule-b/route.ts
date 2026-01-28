import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from '@/lib/censusSession';

const FIND_ENDPOINT = 'https://uscensus.prod.3ceonline.com/ui/tradedata/export/schedule/find';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code || typeof code !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid code parameter' },
      { status: 400 }
    );
  }

  try {
    // Get stored session cookie
    const sessionCookie = getSessionCookie();
    
    // Build headers
    const headers: HeadersInit = {
      'Origin': 'https://uscensus.prod.3ceonline.com',
    };
    
    // Add session cookie if available (required for API access)
    if (sessionCookie) {
      headers['Cookie'] = sessionCookie;
    }
    
    // Use the code as-is (e.g., "040711" - no formatting needed)
    // Forward the request to the Census API
    const url = `${FIND_ENDPOINT}/${code}/US/US/EN`;
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Schedule B API Error:', {
        status: response.status,
        statusText: response.statusText,
        code: code,
        error: errorText.substring(0, 200),
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to find Schedule B codes',
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status
        },
        { status: response.status }
      );
    }

    // Get the response data
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    
    if (!isJson) {
      const text = await response.text();
      console.error('Unexpected non-JSON response from Schedule B API:', text.substring(0, 200));
      return NextResponse.json(
        { 
          error: 'Invalid response format',
          message: 'Expected JSON but received non-JSON response'
        },
        { status: 500 }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      return NextResponse.json(
        { 
          error: 'Invalid response format',
          message: 'Failed to parse JSON response'
        },
        { status: 500 }
      );
    }

    // Transform API response to match frontend expected format
    // API returns { children: [...] } but frontend expects { items: [...] }
    // Also recursively transform nested children arrays to items arrays
    function transformScheduleBItem(item: any): any {
      if (!item || typeof item !== 'object') {
        return item;
      }

      const transformed: any = {
        code: item.code,
        desc: item.desc,
        name: item.name,
        uom: item.uom,
      };

      // Recursively transform children to items
      if (Array.isArray(item.children) && item.children.length > 0) {
        transformed.items = item.children.map((child: any) => transformScheduleBItem(child));
      }

      return transformed;
    }

    // Extract children array from root and transform to items format
    const responseData = Array.isArray(data.children)
      ? { items: data.children.map((child: any) => transformScheduleBItem(child)) }
      : { items: [] };

    // Create NextResponse with the transformed data
    const nextResponse = NextResponse.json(responseData, { status: response.status });

    // Forward any Set-Cookie headers back to the client
    const setCookieHeaders = response.headers.get('set-cookie');
    if (setCookieHeaders) {
      nextResponse.headers.set('Set-Cookie', setCookieHeaders);
    }

    return nextResponse;
  } catch (error) {
    console.error('Census API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to find Schedule B codes',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
