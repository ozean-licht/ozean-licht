module.exports = {
  apps: [
    {
      name: 'mcp-gateway',
      script: './dist/server.js',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8100,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      kill_timeout: 10000,
      wait_ready: true,
      listen_timeout: 10000,
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true,
      cron_restart: '0 0 * * *', // Restart daily at midnight

      // Cluster mode settings
      merge_logs: true,

      // Monitoring
      pmx: true,
      instance_var: 'INSTANCE_ID',

      // Graceful shutdown
      shutdown_with_message: false,

      // Health check
      health_check: {
        interval: 30,
        url: 'http://localhost:8100/health',
        max_failed_checks: 5,
      },
    },
  ],

  deploy: {
    production: {
      user: 'root',
      host: '138.201.139.25',
      ref: 'origin/main',
      repo: 'git@github.com:your-org/ozean-licht-ecosystem.git',
      path: '/opt/mcp-gateway',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      ssh_options: ['StrictHostKeyChecking=no', 'PasswordAuthentication=no'],
      key: '~/.ssh/ozean-automation',
    },
  },
};