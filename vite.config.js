import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, existsSync, cpSync } from 'fs'
import { join } from 'path'

// Custom plugin to serve and package the static admin HTML panel
function adminHtmlPlugin() {
  return {
    name: 'admin-html-plugin',
    // Dev server middleware to serve static HTML pages under /admin/*
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host}`)
        let pathname = url.pathname

        // Redirect /admin or /admin/ to /admin/login.html
        if (pathname === '/admin' || pathname === '/admin/') {
          res.writeHead(302, { Location: '/admin/login.html' })
          res.end()
          return
        }

        if (pathname.startsWith('/admin/')) {
          const filename = pathname.replace(/^\/admin\//, '')
          const filePath = join(__dirname, 'src', 'Admin Panel html code', decodeURIComponent(filename))

          if (existsSync(filePath)) {
            const ext = filename.split('.').pop().toLowerCase()
            let contentType = 'text/plain'
            if (ext === 'html') contentType = 'text/html'
            else if (ext === 'css') contentType = 'text/css'
            else if (ext === 'js') contentType = 'application/javascript'
            else if (ext === 'png') contentType = 'image/png'
            else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg'
            else if (ext === 'svg') contentType = 'image/svg+xml'

            res.writeHead(200, { 'Content-Type': contentType })
            res.end(readFileSync(filePath))
            return
          }
        }
        next()
      })
    },
    // Copy the admin HTML folder to dist/admin upon successful build completion
    closeBundle() {
      const srcDir = join(__dirname, 'src', 'Admin Panel html code')
      const destDir = join(__dirname, 'dist', 'admin')
      if (existsSync(srcDir)) {
        try {
          cpSync(srcDir, destDir, { recursive: true, force: true })
          console.log('Successfully copied admin HTML files to dist/admin')
        } catch (err) {
          console.error('Failed to copy admin HTML files:', err)
        }
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), adminHtmlPlugin()],
})
