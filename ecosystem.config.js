module.exports = {
  apps: [
    {
      name: 'escort-catalog-server',
      cwd: './server',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '256M',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: './logs/server-error.log',
      out_file: './logs/server-out.log'
    },
    {
      name: 'escort-catalog-client',
      cwd: './client',
      script: 'npx',
      args: 'serve -s build -l 3000',
      env: {
        NODE_ENV: 'production'
      },
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '200M',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: './logs/client-error.log',
      out_file: './logs/client-out.log'
    }
  ]
}; 