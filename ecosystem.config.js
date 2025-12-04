module.exports = {
  apps: [
    {
      name: "octagono-backend",      // Nom de ton app
      script: "./server.js",          // Ton fichier serveur
      watch: true,                    // Redémarrage auto si fichier change
      env: {
        NODE_ENV: "production",       // ou "development"
        PORT: 3001,
        EMAIL_USER: "octagonoplushaiti@gmail.com",      // ton email Gmail
        EMAIL_PASS: "uxraaujzcmkcvpna"       // mot de passe application Gmail
      }
    }
  ]
};
