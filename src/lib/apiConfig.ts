let cachedConfig: { apiBaseUrl: string } | null = null;

/**
 * Load API configuration from public/config.json
 * Caches the result to avoid multiple fetch calls
 */
export async function loadApiConfig(): Promise<{ apiBaseUrl: string }> {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const response = await fetch('/config.json');
    if (!response.ok) {
      throw new Error('Failed to load config.json');
    }
    cachedConfig = await response.json();
    return cachedConfig!;
  } catch (error) {
    console.error('Error loading API configuration:', error);
    // Fallback to default if config.json is not found
    cachedConfig = { apiBaseUrl: 'https://domain:port' };
    return cachedConfig;
  }
}

/**
 * Get the API base URL
 * Must be called after loadApiConfig()
 */
export function getApiBaseUrl(): string {
  if (!cachedConfig) {
    console.warn('API config not loaded yet, using default');
    return 'https://domain:port';
  }
  return cachedConfig.apiBaseUrl;
}

/**
 * Build a full API endpoint URL
 */
export function getApiUrl(endpoint: string): string {
  return `${getApiBaseUrl()}${endpoint}`;
}
