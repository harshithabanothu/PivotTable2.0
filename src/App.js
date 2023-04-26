/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from "react";
import SwappedPivotTable from "./SwappedPivotTable";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";
import PivotTable from "./PivotTable";
import $ from "jquery";
import {prepareSummaryData,prepareSwappedSummaryData} from './script.js'

function App() {
  const [isSwapped,setSwapped]=useState(false)
  const [data,setData]=useState({})
  const [swappedData,setSwappedData] = useState({})
  const dataFetchRef = useRef(false);
  useEffect(() => {
    if (dataFetchRef.current) return;
    dataFetchRef.current = true;
    $.ajax({
      url: "http://sergio.vistex.local:8000/sap/opu/odata/sap/ZSYNDATA_SRV/SYNDATASET?$format=json",
    }).done((response) => {
      let heirarchy = JSON.parse(response.d.results[0].Heirarchy);
      let data = JSON.parse(response.d.results[0].Data);
      let summaryData = prepareSummaryData(data, heirarchy);
      let swappedSummaryData=prepareSwappedSummaryData(data,heirarchy)
      setData(summaryData);
      setSwappedData(swappedSummaryData);
    });
  }, []);
  return(
    <>
    {dataFetchRef.current? (
      isSwapped? <SwappedPivotTable data={swappedData} handleSwap={()=>{setSwapped(!isSwapped)}}/>:
     <PivotTable data={data} handleSwap={()=>{setSwapped(!isSwapped)}}/>
     ): (
          <div className="spinner-container">
            <HourglassFullIcon className="loading-spinner" />
          </div>
        )}
     </>
   
  )

}
export default App;