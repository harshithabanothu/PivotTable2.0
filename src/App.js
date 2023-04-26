/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from "react";
import SwappedPivotTable from "./SwappedPivotTable";
import PivotTable from "./PivotTable";

function App() {
  const [isSwapped,setSwapped]=useState(false)
  return(
    isSwapped? <SwappedPivotTable handleSwap={()=>{setSwapped(!isSwapped)}}/>:<PivotTable handleSwap={()=>{setSwapped(!isSwapped)}}/>
  )

}
export default App;