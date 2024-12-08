const conn = require("./db/conn");

async function testConnection() {
  try {
    const result = await conn.query("SELECT NOW() AS now");
    console.log(
      "Conexão bem-sucedida. Hora atual no banco:",
      result.rows[0].now
    );
  } catch (error) {
    console.error("Erro ao conectar ao banco:", error);
  } finally {
    await conn.end(); // Fecha a conexão
  }
}

testConnection();
