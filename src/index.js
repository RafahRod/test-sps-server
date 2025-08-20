const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const { closeDatabase } = require("./database/sqlite");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});

process.on('SIGINT', () => {
  console.log('\nRecebido SIGINT. Fechando servidor...');
  server.close(() => {
    console.log('Servidor fechado.');
    closeDatabase();
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\nRecebido SIGTERM. Fechando servidor...');
  server.close(() => {
    console.log('Servidor fechado.');
    closeDatabase();
    process.exit(0);
  });
});
