const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:NukBOjaexjSnL8xI@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=disable',
});

client.connect(err => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connected successfully!');
    client.query('SELECT NOW()', (err, res) => {
      console.log(err ? err.stack : res.rows[0]);
      client.end();
    });
  }
});
