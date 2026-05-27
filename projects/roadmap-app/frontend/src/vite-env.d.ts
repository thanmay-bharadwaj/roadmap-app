/// <reference types="vite/client" />

// CSS module declarations
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

// Global CSS imports (side-effect imports)
declare module '*.css?inline' {
  const content: string
  export default content
}

// Image imports
declare module '*.svg' {
  const content: string
  export default content
}
declare module '*.png' {
  const content: string
  export default content
}
declare module '*.jpg' {
  const content: string
  export default content
}
declare module '*.jpeg' {
  const content: string
  export default content
}
declare module '*.gif' {
  const content: string
  export default content
}
declare module '*.webp' {
  const content: string
  export default content
}