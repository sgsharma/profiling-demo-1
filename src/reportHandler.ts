import { Metric } from 'web-vitals';


function reportHandler(metric: Metric) {
    console.log(metric)
    const hnyMetric:JSON = <JSON><unknown>{
        "name": metric.name,
        "delta": metric.delta,
        "entries": metric.entries,
        "value": metric.value,
        "duration_ms": metric.delta,
        "metric_json": metric,
        "type": 'metric'
      };
    console.log(hnyMetric)
    fetch('./send-trace', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(hnyMetric),
    }).then(function() {
        console.log("ok");
    }).catch(function() {
        console.log("error");
    });
}
 
export default reportHandler;
