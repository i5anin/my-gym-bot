module.exports = {
    apps: [
        {
            name: 'bot-assist',
            script: './main.js',                  // dev-режим (по умолчанию)
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '300M',

            // Режим разработки (npm run start:pm2 или pm2 start ecosystem.config.js --env development)
            env_development: {
                NODE_ENV: 'development',
                // Можно добавить дополнительные переменные, если нужно
            },

            // Режим продакшена (npm run start:pm2 или pm2 start ecosystem.config.js --env production)
            env_production: {
                NODE_ENV: 'production',
                script: './dist/main.js',           // переопределение script только для production
            }
        }
    ]
}