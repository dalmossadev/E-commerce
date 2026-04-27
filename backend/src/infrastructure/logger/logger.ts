import winston from 'winston';
import path from 'path';


// Pega o diretório raiz do projeto para evitar erro de caminho relativo
const logsDir = path.join(process.cwd(), 'logs');
// Define o formato do log
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    // 1. Salva erros em um arquivo separado
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error', 
      maxsize: 5242880, // 5MB
    }),
    // 2. Salva todos os logs (info, warn, error) em outro arquivo
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log'),
        maxsize: 5242880, // 5MB 
    }),
    // 3. Exibe no console também (para continuarmos vendo no terminal)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    })
  ],
  exitOnError: false, // Não encerra a aplicação em caso de erro
});

export { logger };