import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function adminAuthDevPlugin() {
  return {
    name: 'admin-auth-dev-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/admin/login' && req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const { username, password } = JSON.parse(body || '{}')
              const validUser = (username || '').trim().toLowerCase()
              const validPass = (password || '').trim()

              const isUserValid = validUser === 'admin' || validUser === 'admin@thegiftstudio.com'
              const isPassValid = validPass === 'Admin@123' || validPass === 'admin123'

              res.setHeader('Content-Type', 'application/json')

              if (isUserValid && isPassValid) {
                res.statusCode = 200
                res.end(
                  JSON.stringify({
                    success: true,
                    token:
                      'tgs_admin_sec_' +
                      Buffer.from(`${validUser}:${Date.now()}`).toString('base64'),
                    admin: {
                      id: 1,
                      username: 'admin',
                      email: 'admin@thegiftstudio.com',
                      name: 'Studio Administrator',
                      role: 'superadmin'
                    }
                  })
                )
              } else {
                res.statusCode = 401
                res.end(
                  JSON.stringify({
                    success: false,
                    message: 'Invalid credentials. Please verify your username and password.'
                  })
                )
              }
            } catch {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, message: 'Bad request payload.' }))
            }
          })
          return
        }
        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), adminAuthDevPlugin()],
})
