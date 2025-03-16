// Define your expected type for details
export type ServiceDetails = string | { heading: string; lines: string[] }[];

// A helper function that safely converts a JSON value into ServiceDetails
function parseDetails(value: unknown): ServiceDetails {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value)) {
    // Check if every item in the array is an object with the expected properties
    const isValid = value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'heading' in item &&
        'lines' in item &&
        typeof (item as any).heading === 'string' &&
        Array.isArray((item as any).lines) &&
        (item as any).lines.every((line: unknown) => typeof line === 'string'),
    );
    if (isValid) {
      return value as { heading: string; lines: string[] }[];
    }
  }
  // Fallback default value
  return [{ heading: '', lines: [''] }];
}

export default parseDetails;
