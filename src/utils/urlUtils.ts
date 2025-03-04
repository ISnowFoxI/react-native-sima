/**
 * Utility functions for URL handling
 */

/**
 * Parses query parameters from a URL string
 *
 * @param url - The URL to parse (e.g., "react-native-sima://sign-challenge?status=failure&message=operation-canceled")
 * @returns An object containing the query parameters as key-value pairs
 */
export function parseUrlQueryParams(url: string): Record<string, string> {
  try {
    // Extract the query string part (everything after the '?')
    const queryStringMatch = url.match(/\?(.+)$/)
    const queryString = queryStringMatch ? queryStringMatch[1] : ''

    // If no query string, return empty object
    if (!queryString) {
      return {}
    }

    // Split the query string by '&' to get key-value pairs
    const params: Record<string, string> = {}
    const pairs = queryString.split('&')

    // Process each key-value pair
    for (const pair of pairs) {
      const [key, value] = pair.split('=')

      // Decode URI components to handle special characters
      if (key) {
        params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : ''
      }
    }

    return params
  } catch (error) {
    console.error('Error parsing URL query parameters:', error)
    return {}
  }
}
