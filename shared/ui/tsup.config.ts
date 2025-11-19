import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Disabled temporarily due to next/link type issues
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
})
