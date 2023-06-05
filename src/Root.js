import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
const Root = {
    data: null,
    heirarchy: null,
    appid: "root",
    initRender: () => {
      const root = ReactDOM.createRoot(document.getElementById(Root.appid));
      root.render(
        <React.StrictMode>
          <App data={Root.data} heirarchy={Root.heirarchy}/>
        </React.StrictMode>
      );
    }
  }
export const Config = {
    init: (obj) => {
        if(obj.data) Root.data = obj.data;
        if(obj.heirarchy) Root.heirarchy = obj.heirarchy;
        if(obj.appid) Root.appid = obj.appid;
    },
    render: () => {
        Root.initRender();
    }    
};
window.synConfig = Config;