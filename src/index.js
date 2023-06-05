import reportWebVitals from './reportWebVitals';
import { Config } from './Root';
// Code to run app locally
import $ from "jquery";
$.ajax({
    url: "http://sergio.vistex.local:8000/sap/opu/odata/sap/ZSYNDATA_SRV/SYNDATASET?$format=json",
  }).done((response) => {
    let heirarchy = JSON.parse(response.d.results[0].Heirarchy);
    console.log(heirarchy);
    let data = JSON.parse(response.d.results[0].Data);
    window.synConfig.init({
      heirarchy: heirarchy,
      data: data,
      root: "app"
    });
    window.synConfig.render();
  });
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
