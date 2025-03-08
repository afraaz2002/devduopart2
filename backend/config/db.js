import mysql from 'mysql2';



const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'devduo2',
  connectionLimit: 30,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database ✅");
    connection.release();
  }
});



export default pool.promise();