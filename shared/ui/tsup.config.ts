import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Temporarily disabled for faster builds (types resolved from src)
  external: [
    'next',
    'next/link',
    'next/image',
    'next/navigation',
    'next/router',
  ],
  treeshake: true,
  splitting: false,
  clean: true,
  // Skip type checking for external Next.js imports
  skipNodeModulesBundle: true,
})
