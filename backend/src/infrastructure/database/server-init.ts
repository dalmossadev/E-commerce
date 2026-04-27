import dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import { AppDataSource } from './data-source';




export async function initializaDatabase() {

    try {
        if (!AppDataSource.isInitialized) {
            console.log('---[Initializing database connection v1.0]---');
            console.log('---Initializing connection with MySQL---');
            await AppDataSource.initialize();

            console.log('---Database connection established sucessfully---');
            console.log(`---[Server  run on port ${process.env.PORT}]---`);
        }
    } catch (error) {
        console.error('Error initializing database connection:', error);
        process.exit(1); // Exit the process with an error code
    }
}