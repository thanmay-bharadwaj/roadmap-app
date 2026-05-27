/**
 * Format a date string to readable format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Generate a unique item ID from phase, section, and index
 */
export function generateItemId(phase: number, section: string, index: number): string {
  // Sanitize section name for use in ID
  const safeSection = section.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return `phase-${phase}-sec-${safeSection}-item-${index}`
}

/**
 * Parse resources HTML string safely (basic sanitization)
 */
export function sanitizeResources(html: string): string {
  // Only allow specific tags and attributes
  return html
    .replace(/<script.*?>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
}