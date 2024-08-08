const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const sqlConfig = {
  user: 'rochasolutions',
  password: 'Caritop1411****',
  database: 'DWHProject1',
  server: 'dwhcjrmportfolio.database.windows.net',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, 
    trustServerCertificate: false 
  }
};

sql.connect(sqlConfig)
  .then(() => console.log('Connected to SQL Server'))
  .catch(err => console.error('Database connection failed: ', err));

app.post('/submit', async (req, res) => {
  const data = req.body;
  console.log('Received form data:', data);

  const query = `
    INSERT INTO TicketEvaluations (sid, agentName, auditor, supervisor, auditDate, ticketDate, ticketQueue, ticketNumber, ticketRightStoreScore, ticketSubCategoryScore, ticketValidReasonScore, zeusIrisScore, grade, comments, outcome, finalGrade)
    VALUES (@sid, @agentName, @auditor, @supervisor, @auditDate, @ticketDate, @ticketQueue, @ticketNumber, @ticketRightStoreScore, @ticketSubCategoryScore, @ticketValidReasonScore, @zeusIrisScore, @grade, @comments, @outcome, @finalGrade)
  `;

  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('sid', sql.NVarChar, data.sid)
      .input('agentName', sql.NVarChar, data.agentName)
      .input('auditor', sql.NVarChar, data.auditor)
      .input('supervisor', sql.NVarChar, data.supervisor)
      .input('auditDate', sql.Date, data.auditDate)
      .input('ticketDate', sql.Date, data.ticketDate)
      .input('ticketQueue', sql.NVarChar, data.ticketQueue)
      .input('ticketNumber', sql.NVarChar, data.ticketNumber)
      .input('ticketRightStoreScore', sql.NVarChar, data.ticketRightStoreScore)
      .input('ticketSubCategoryScore', sql.NVarChar, data.ticketSubCategoryScore)
      .input('ticketValidReasonScore', sql.NVarChar, data.ticketValidReasonScore)
      .input('zeusIrisScore', sql.NVarChar, data.zeusIrisScore)
      .input('grade', sql.NVarChar, data.grade)
      .input('comments', sql.NVarChar, data.comments)
      .input('outcome', sql.NVarChar, data.outcome)
      .input('finalGrade', sql.NVarChar, data.finalGrade)
      .query(query);

    console.log('Data inserted successfully:', result);
    res.send('Form submitted successfully');
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Something went wrong');
  }
});

app.get('/getdata', async (req, res) => {
  const query = 'SELECT * FROM TicketEvaluations';

  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request().query(query);

    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Something went wrong');
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

