require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT || 3306,
    },
    mysql: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        user: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB
    }
    /*
    mysql: {
        host: process.env.MYSQL_HOST || '127.0.0.1',
        user: process.env.MYSQL_USER || 'root',
        user: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DB || 'ranking'
    }
    */
}