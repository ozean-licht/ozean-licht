/**
 * Custom Next.js Server for Standalone Mode
 * Serves static Storybook files from /public/storybook-static
 */

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const path = require('path')
const fs = require('fs')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || '0.0.0.0'
const port = parseInt(process.env.PORT || '3002', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      const { pathname } = parsedUrl

      // Serve Storybook static files
      if (pathname.startsWith('/storybook-static/')) {
        const filePath = path.join(
          __dirname,
          'public',
          pathname
        )

        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          // Set appropriate content type
          const ext = path.extname(filePath)
          const contentTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.svg': 'image/svg+xml',
            '.woff2': 'font/woff2',
          }
          res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream')
          fs.createReadStream(filePath).pipe(res)
          return
        }
      }

      // Default Next.js handler
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
