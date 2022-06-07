const express = require('express');
const axios = require('axios')

const HONEYCOMB_API_KEY = process.env.HONEYCOMB_API_KEY

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded()); // Parse URL-encoded bodies

app.post('/send-trace', (req, res) => {
  const {
    name,
    duration,
    startTime,
    endTime,
    parentSpanId,
    spanId,
    traceId,
  } = req.body;

  if(req.body.type == 'metric'){
    console.log(req.body)
    const payload = req.body
    axios
    .post('https://api.honeycomb.io/1/events/profiling-demo', payload, {
      headers: {
        'X-Honeycomb-Team': HONEYCOMB_API_KEY,
        'Content-Type': 'application/json',
      }
    })
    .then(res => {
      console.log(`statusCode: ${res.status}`)
    })
    .catch(error => {
      console.error(error)
    });
  } else {
    const payload = {
      name,
      duration_ms: duration[1] / 1000 / 1000, // convert from nanoseconds to milliseconds
      endTime: endTime[0], // unix timestamp (seconds since epoch)
      traceId,
      id: spanId,
      parentId: parentSpanId,
      timestamp: startTime[0], // unix timestamp (seconds since epoch)
    };
    axios
    .post('https://api.honeycomb.io/1/events/profiling-demo', payload, {
      headers: {
        'X-Honeycomb-Team': HONEYCOMB_API_KEY,
        'X-Honeycomb-Event-Time': startTime[0],
        'Content-Type': 'application/json',
      }
    })
    .then(res => {
      console.log(`statusCode: ${res.status}`)
    })
    .catch(error => {
      console.error(error)
    })
  };

  res.send({ status: 'done' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
