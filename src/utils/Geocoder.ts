// Geocoder.ts
// Minimal drop-in replacement for react-native-geocoding's Geocoder.from(...)
// Provider: Google Geocoding API

export type GeoCoderInitOptions = {
  /** Google API key (required) */
  apiKey: string;
  /** Optional: Preferred language, e.g. "en" | "ar" */
  language?: string;
  /** Optional: region bias, e.g. "EG" */
  region?: string;
  /** Optional: request timeout in ms (default 15000) */
  timeoutMs?: number;
  /** Optional: override base endpoint if needed */
  baseUrl?: string; // default: https://maps.googleapis.com/maps/api/geocode/json
};

export class Geocoder {
  private static _apiKey: string | null = null;
  private static _language?: string;
  private static _region?: string;
  private static _timeoutMs: number = 15000;
  private static _baseUrl: string =
    "https://maps.googleapis.com/maps/api/geocode/json";

  /**
   * Initialize Geocoder once at app startup.
   *
   * Example:
   * Geocoder.init({ apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY!, language: "en", region: "EG" })
   */
  static init(options: GeoCoderInitOptions) {
    if (!options?.apiKey) {
      throw new Error("Geocoder.init: 'apiKey' is required.");
    }
    this._apiKey = options.apiKey;
    this._language = options.language;
    this._region = options.region;
    this._timeoutMs = options.timeoutMs ?? this._timeoutMs;
    if (options.baseUrl) this._baseUrl = options.baseUrl;
  }

  /**
   * Geocoder.from(...)
   * - Geocoder.from("Some address string")
   * - Geocoder.from(30.0444, 31.2357)
   * - Geocoder.from({ lat: 30.0444, lng: 31.2357 })
   *
   * Returns the raw Google Geocoding API JSON (like react-native-geocoding).
   */
  static async from(
    a: string | number | { lat: number; lng: number },
    b?: number
  ): Promise<any> {
    this.assertInitialized();

    const params = new URLSearchParams();
    params.append("key", this._apiKey as string);

    if (this._language) params.append("language", this._language);
    if (this._region) params.append("region", this._region);

    if (typeof a === "string") {
      // forward geocoding
      const address = a.trim();
      if (!address) throw new Error("Geocoder.from: address string is empty.");
      params.append("address", address);
    } else if (typeof a === "number" && typeof b === "number") {
      // reverse geocoding from lat, lng numbers
      const lat = a;
      const lng = b;
      validateLatLng(lat, lng);
      params.append("latlng", `${lat},${lng}`);
    } else if (
      typeof a === "object" &&
      a &&
      typeof a.lat === "number" &&
      typeof a.lng === "number"
    ) {
      // reverse geocoding from object
      validateLatLng(a.lat, a.lng);
      params.append("latlng", `${a.lat},${a.lng}`);
    } else {
      throw new Error(
        "Geocoder.from: invalid arguments. Use a string (address) or numbers (lat, lng) or object {lat, lng}."
      );
    }

    const url = `${this._baseUrl}?${params.toString()}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this._timeoutMs);

    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) {
        throw new Error(`Geocoder HTTP error: ${res.status} ${res.statusText}`);
      }
      const json = await res.json();

      // Keep compatibility with react-native-geocoding (Google payload shape)
      // It returns the Google raw response containing: results[], status, plus_code, etc.
      // Consumers usually read json.results[0]...
      if (json.status && json.status !== "OK") {
        // Mirror the original lib behavior: reject on non-OK
        const msg = json.error_message ? `: ${json.error_message}` : "";
        throw new Error(`Geocoding failed (status=${json.status})${msg}`);
      }

      return json;
    } catch (err: any) {
      // Normalize abort error message
      if (err?.name === "AbortError") {
        throw new Error("Geocoder request timed out.");
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  private static assertInitialized() {
    if (!this._apiKey) {
      throw new Error(
        "Geocoder not initialized. Call Geocoder.init({ apiKey, ... }) first."
      );
    }
  }
}

// ---- helpers ----
function validateLatLng(lat: number, lng: number) {
  if (!isFinite(lat) || !isFinite(lng)) {
    throw new Error("Invalid lat/lng: must be finite numbers.");
  }
  if (lat < -90 || lat > 90)
    throw new Error("Invalid latitude. Must be between -90 and 90.");
  if (lng < -180 || lng > 180)
    throw new Error("Invalid longitude. Must be between -180 and 180.");
}

export default Geocoder;
