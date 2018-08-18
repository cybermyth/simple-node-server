const express = require('express');
const os = require('os');
const app = express();

const version = process.env.VERSION || 'v1.0';
const started = new Date();

function prepareResponse() {
  const timestamp = new Date();
  const hostname = os.hostname();
  const runningTime = Math.abs((timestamp.getTime() - started.getTime()) / 1000);
  
  const response = {
      hostname,
      version,
      timestamp,
      runningTime
  };
  return response;
}

app.get('/', (req, res) => {
  const response = prepareResponse();
  console.log(`${response.timestamp}: Running version ${response.version} on ${response.hostname}`);
  res.send(response);
});

app.get('/readiness', (req, res) => {
  const response = prepareResponse();
  console.log(`Running time: ${response.runningTime}s on pod: ${response.hostname}`);
  if (response.runningTime <= 15) {
    res.status(500).send(`Error occured: ${response.runningTime}`);
  } else {
    res.status(200).send(response)
  }
});

app.get('/liveness', (req, res) => {
  const response = prepareResponse();
  console.log(`Running time: ${response.runningTime}s on pod: ${response.hostname}`);
  if (response.runningTime <= 40) {
    res.status(200).send(response)
  } else {
    res.status(500).send(`Error occured: ${response.runningTime}`);
  }
});

app.get('/healthz', (req, res) => {
  const response = prepareResponse();
  console.log(`Running time: ${response.runningTime}s on pod: ${response.hostname}`);
  if (response.runningTime <= 15) {
    res.status(500).send(`Readines probe failed: ${response.runningTime}`);
  } else if (response.runningTime > 15 && response.runningTime <= 40) {
    res.status(200).send(response)
  } else {
    res.status(500).send(`Liveness probe failed: ${response.runningTime}`);
  }
});

app.listen(4000, () => console.log('Server listening on 4000'));