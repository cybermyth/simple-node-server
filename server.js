const express = require('express');
const os = require('os');
const app = express();

const version = process.env.VERSION || 'v1';
const started = new Date();

function prepareResponse() {
  const timestamp = new Date();
  const hostname = os.hostname();
  
  const response = {
      hostname,
      version,
      timestamp
  };
  return response;
}

app.get('/', (req, res) => {
  const response = prepareResponse();
  console.log(`${response.timestamp}: Running version ${response.version} on ${response.hostname}`);
  res.send(response);
});

app.get('/healthz', (req, res) => {
  const runningTime = Math.abs((new Date().getTime() - started.getTime()) / 1000);
  console.log(runningTime);
  if (runningTime <= 15) {
    res.status(500).send(`Error occured: ${runningTime}`);
  } else {
    res.status(200).send(`Call was successful: ${runningTime}`)
  }
});

app.listen(4000, () => console.log('Server listening on 4000'));