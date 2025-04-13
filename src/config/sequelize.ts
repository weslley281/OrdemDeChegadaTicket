import { Sequelize } from 'sequelize';
import 'dotenv/config';

// Lê as variáveis do .env
const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: Number(process.env.DB_PORT) || 3306,
    logging: false,
  }
);

// Teste de conexão opcional (pode deixar ativado no dev)
sequelize.authenticate()
  .then(() => console.log('🟢 Conectado ao banco de dados com sucesso!'))
  .catch(err => console.error('🔴 Erro ao conectar ao banco:', err));

export { sequelize };
