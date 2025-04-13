import { Sequelize } from 'sequelize';
import { initUserModel } from '../modules/user/entities/User'; // aqui
import 'dotenv/config';

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: Number(process.env.DB_PORT) || 3307,
    logging: false,
  }
);

// Inicializa o model corretamente
initUserModel(sequelize); // 👈 aqui está certo agora

sequelize.authenticate()
  .then(() => console.log('🟢 Conectado ao banco de dados com sucesso!'))
  .catch(err => console.error('🔴 Erro ao conectar ao banco:', err));

export { sequelize };
