/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from "react";
import SwappedPivotTable from "./SwappedPivotTable";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";
import  "@ui5/webcomponents-icons/dist/lateness.js";
import { Icon } from '@ui5/webcomponents-react'
import PivotTable from "./PivotTable";
import $ from "jquery";
import {prepareSummaryData,prepareSwappedSummaryData} from './script.js'

function App(prop) {
  const [isSwapped,setSwapped]=useState(false)
  const [data,setData]=useState({})
  const [swappedData,setSwappedData] = useState({})
  const dataFetchRef = useRef(false);
  useEffect(() => {
    if (dataFetchRef.current) return;
    dataFetchRef.current = true;
    // $.ajax({
    //   url: "http://sergio.vistex.local:8000/sap/opu/odata/sap/ZSYNDATA_SRV/SYNDATASET?$format=json",
    // }).done((response) => {
    //   let heirarchy = JSON.parse(response.d.results[0].Heirarchy);
    //   console.log(heirarchy)
    //   let data = JSON.parse(response.d.results[0].Data);
    //   let summaryData = prepareSummaryData(data, heirarchy);
    //   let swappedSummaryData=prepareSwappedSummaryData(data,heirarchy)
    //   setData(summaryData);
    //   setSwappedData(swappedSummaryData);
    // });
      let heirarchy = prop.heirarchy ?  prop.heirarchy : null;
      console.log(heirarchy)
      let data = prop.data ? prop.data : null;
    if (data && heirarchy) {
      let summaryData = prepareSummaryData(data, heirarchy);
      let swappedSummaryData = prepareSwappedSummaryData(data, heirarchy)
      setData(summaryData);
      setSwappedData(swappedSummaryData);
    }
  }, []);
  return(
    <>
    {dataFetchRef.current? (
      isSwapped? <SwappedPivotTable data={swappedData} handleSwap={()=>{setSwapped(!isSwapped)}}/>:
     <PivotTable data={data} handleSwap={()=>{setSwapped(!isSwapped)}}/>
     ): (
          <div className="spinner-container">
            <Icon name="lateness" className="loading-spinner"></Icon>
          </div>
        )}
     </>
   
  )

}
export default App;