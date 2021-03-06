import React, {useState, useEffect} from 'react';
import './App.css';

// importing components
import CircularUsage from './components/CircularUsage/index.js'

const gbFact = 1073741824;

function App() {
  const [result, setResult] = useState(null);
  const [coreCount, setCoreCount] = useState(0);

  const FindAndSetCoreCount = (cpu) => {
    let a = [];
    cpu.forEach(c => {
      if (a.includes(c.coreId)) {
        return;
      }
      a.push(c.coreId);
    });
    setCoreCount(a.length);
  }

	useEffect(() => {
    window.backend.initStats().then((result) => {
      setResult(result);
      FindAndSetCoreCount(result.CPUInfo);
    });
		setInterval(() => {
			window.backend.updateCPUStats().then((result) => {
        // console.log(result)
        setResult(result)
      });
    }, 1000);
  }, [])
  
  return (
    <div id="app" className="App">
        <div className="GridContainer">
          <div className="GridItem">
            <CircularUsage
              percentage={result !== null ? result.Usage : 0}
              title="CPU"
              subContent={`${result !== null ? (result.Usage).toPrecision(2) : 0}%`}
            />
          </div>
          <div className="GridItem">
            <CircularUsage
              percentage={result !== null ? result.Mem.usedPercent : 0}
              title="RAM"
              subContent={`${result !== null ? (result.Mem.used/gbFact).toPrecision(2) : 0}/${result !== null ? (result.Mem.total/gbFact).toPrecision(2) : 0} GB`}
            />
          </div>
          <div className="GridItem">
            <CircularUsage
              percentage={result !== null ? result.Swap.usedPercent : 0}
              title="SWAP"
              subContent={`${result !== null ? (result.Swap.used/gbFact).toPrecision(2) : 0}/${result !== null ? (result.Swap.total/gbFact).toPrecision(2) : 0} GB`}
            />
          </div>
        </div>
        <h4 className="PrimaryText SysInfo">
          <span className="SecondaryText">CPU Model:</span> {result !== null ? result.CPUInfo[0].modelName : ""}
        </h4>
        <h4 className="PrimaryText SysInfo">
          <span className="SecondaryText">Total CPUs:</span> {coreCount}
        </h4>
        <h4 className="PrimaryText SysInfo">
          <span className="SecondaryText">Total Threads:</span> {result !== null ? result.CPUInfo.length : 0}
        </h4>
        <h4 className="PrimaryText SysInfo">
          <span className="SecondaryText">Cache Size:</span> {result !== null ? result.CPUInfo[0].cacheSize : 0}
        </h4>
        <h4 className="PrimaryText SysInfo">
          <span className="SecondaryText">Operating System:</span> {result !== null ? result.Os : " "}
        </h4>
        <h4 className="PrimaryText SysInfo">
          <span className="SecondaryText">System Arch:</span> {result !== null ? result.Arch : " "}
        </h4>
    </div>
  );
}

export default App;
