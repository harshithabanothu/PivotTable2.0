/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import SwapHorizSharpIcon from '@mui/icons-material/SwapHorizSharp';
import "./App.css";

function PivotTable(props) {
  const {handleSwap,data}=props;
  const [expandedRows1, setExpandedRows1] = useState([]);
  const [expandedRows2, setExpandedRows2] = useState([]);
  const [isRowsExpanded, setisRowsExpanded] = useState(false);
  const [isColumnsExpanded, setisColumnsExpanded] = useState(false);
  const [expandedColumns1, setExpandedColumns1] = useState([]);
  const [expandedColumns2, setExpandedColumns2] = useState([]);
  // const [expandRows, setExpandedRows] = useState([]);
  const [isSwapped, setisSwapped] = useState(false);
 
  const rowdata = data.ROWS;
  const columndata = data.COLUMNS;
  
  //onclick functions for rows display
  const handleRow1Click = (row1Data) => {
    if (expandedRows1.includes(row1Data)) {
      setExpandedRows1(expandedRows1.filter((item) => item !== row1Data));
    } else {
      setExpandedRows1(expandedRows1.concat(row1Data));
    }
  };

  const handleRow2Click = (row2Data) => {
    if (expandedRows2.includes(row2Data)) {
      setExpandedRows2(expandedRows2.filter((item) => item !== row2Data));
    } else {
      setExpandedRows2(expandedRows2.concat(row2Data));
    }
  };

  const handleRow3Click = (row3Data) => {
    // if (expandedRows3.includes(row3Data)) {
    //   setExpandedRows3(expandedRows3.filter((item) => item !== row3Data));
    // } else {
    //   setExpandedRows3(expandedRows3.concat(row3Data));
    // }
  };
  const handleExpandAllRows = (rowdata) => {
    if (isRowsExpanded) {
      setisRowsExpanded(!isRowsExpanded);
      setExpandedRows1([]);
      setExpandedRows2([]);
    } else {
      setisRowsExpanded(!isRowsExpanded);
      setExpandedRows1(rowdata.EMPID)
      let records = [];
      rowdata.EMPID.map((record) => {
        const { label, columns, ...rest } = record;
        const newArr = Object.values(rest).map((arr) => arr[0]);
        newArr.map((obj) => {
          records.push(obj);
        })
        setExpandedRows2(records);
      })
    }
  }
  const handleExpandAllColumns = (coldata) => {
    if (isColumnsExpanded) {
      setisColumnsExpanded(!isColumnsExpanded);
      setExpandedColumns1([]);
      setExpandedColumns2([]);
    } else {
      setisColumnsExpanded(!isColumnsExpanded);
      setExpandedColumns1(coldata.YEAR)
      let records = [];
      coldata.YEAR.map((obj) =>{
          records=records.concat(obj.QUTR)
        })
      setExpandedColumns2(records)
    }
  };
  const handleNumFormater = (num) => {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  };

  // const renderValues = (values) => {
  //   return (
  //     <div className="data-value-cells">
  //       <div>{handleNumFormater(values?.WRITTEN) || 0}</div>
  //       <div className="border-none">
  //         {handleNumFormater(values?.PRACTICAL) || 0}
  //       </div>
  //     </div>
  //   );
  // };
  // const renderMarksHeadings = () => {
  //   return (
  //     <div className="sub-column-heading ">
  //       <div className="border-right">Written</div>
  //       <div className="border-none">Practical</div>
  //     </div>
  //   );
  // };

  //render functions for expanded rows display
  const renderColumn3Rows = (column3) => {
    let totalValue = 0;
    return (
      <>
        {column3.map((col3) => {
          totalValue = totalValue + col3.aggrValue;
          return (
            <td className="td">
              <span className="td-cells-padding">
                {col3.aggrValue == 0 ? " " : handleNumFormater(col3.aggrValue)}
              </span>
            </td>
          );
        })}
        <td className="td">
          <span className="td-cells-padding">
            {totalValue == 0 ? " " : handleNumFormater(totalValue)}
          </span>
        </td>
      </>
    );
  };

  const checkColumn3Condition = (column2, column1) => {
    const filteredYear = expandedColumns1.filter(
      (col1) => col1.value === column1
    )[0].QUTR;
    const filteredArray = expandedColumns2.filter((value) =>
      filteredYear.includes(value)
    );
    return filteredArray
      .map((col2val) => col2val.value)
      .includes(column2.value);
  };

  const renderColumn2Rows = (column1) => {
    const columns2 = column1.QUTR;
    let totalValue = 0;
    return (
      <>
        {columns2.map((column2) => {
          totalValue = totalValue + parseInt(column2.aggrValue);
          return (
            <>
              {checkColumn3Condition(column2, column1.value) ? (
                renderColumn3Rows(column2.MONTH)
              ) : (
                <td className="td">
                  <span className="td-cells-padding">
                    {column2.aggrValue == 0
                      ? ""
                      : handleNumFormater(column2.aggrValue)}
                  </span>
                </td>
              )}
            </>
          );
        })}
        <td className="td">
          <span className="td-cells-padding">
            {totalValue == 0 ? "" : handleNumFormater(totalValue)}
          </span>
        </td>
      </>
    );
  };

  // const renderRow4 = (row4Array) => {
  //   return row4Array?.map((record) => {
  //     return (
  //       <>
  //         <tr className="row-tr">
  //           <td className="td">
  //             <div className="student-items-flex">{record.label}</div>
  //           </td>
  //           {record.columns.YEAR.map((col1) => (
  //             <>
  //               {expandedColumns1
  //                 .map((col) => col.value)
  //                 .includes(col1.value) && renderColumn2Rows(col1)}
  //               {expandedColumns1
  //                 .map((col) => col.value)
  //                 .includes(col1.value) ? null : (
  //                 <td className="td">
  //                   <span className="td-cells-padding">{handleNumFormater(col1.aggrValue)}</span>
  //                 </td>
  //               )}
  //             </>
  //           ))}
  //         </tr>
  //       </>
  //     );
  //   });
  // };

  const renderRow3 = (row3Array) => {
    const { label, columns, ...rest } = row3Array;
    const newArr = Object.values(rest).map((arr) => arr[0]);
    return newArr?.map((record) => {
      return (
        <>
          <tr className="row-tr">
            <td className="td">
              <div className="batch-items-flex">
                <span className="marginleft">{record.label}</span>
              </div>
            </td>
            {record.columns.YEAR.map((col1) => (
              <>
                {expandedColumns1
                  .map((col) => col.value)
                  .includes(col1.value) ? (
                  renderColumn2Rows(col1)
                ) : (
                  <td className="td">
                    <span className="td-cells-padding">
                      {handleNumFormater(col1.aggrValue)}
                    </span>
                  </td>
                )}
              </>
            ))}
          </tr>
        </>
      );
    });
  };

  const renderRow2 = (row2Array) => {
    const { label, columns, ...rest } = row2Array;
    const newArr = Object.values(rest).map((arr) => arr[0]);
    return newArr.map((record) => {
      return (
        <>
          <tr className="row-tr">
            <td className="td">
              <div className="class-items-flex">
                {Object.keys(record).length > 2 &&
                  (expandedRows2.includes(record) ? (
                    <ArrowDropDownIcon
                      onClick={() => {
                        handleRow2Click(record);
                      }}
                    />
                  ) : (
                    <ArrowRightIcon
                      onClick={() => {
                        handleRow2Click(record);
                      }}
                    />
                  ))}
                <span
                  className={`${Object.keys(record).length > 2 ? "" : "marginleft"
                    }`}>
                  {record.label}
                </span>
              </div>
            </td>
            {record.columns.YEAR.map((col1) => (
              <>
                {expandedColumns1
                  .map((col) => col.value)
                  .includes(col1.value) ? (
                  renderColumn2Rows(col1)
                ) : (
                  <td className="td">
                    <span className="td-cells-padding">
                      {handleNumFormater(col1.aggrValue)}
                    </span>
                  </td>
                )}
              </>
            ))}
          </tr>
          {expandedRows2.includes(record) && renderRow3(record)}
        </>
      );
    });
  };

  //onclicks for columns section
  const handleColumn1Click = (column1Value) => {
    if (expandedColumns1.includes(column1Value)) {
      setExpandedColumns1(
        expandedColumns1.filter((item) => item !== column1Value)
      );
      setExpandedColumns2(
        expandedColumns2.filter((item) => !column1Value.QUTR.includes(item))
      );
    } else {
      setExpandedColumns1(expandedColumns1.concat(column1Value));
    }
  };
  const handleColumn2Click = (column2Value) => {
    if (expandedColumns2.includes(column2Value)) {
      setExpandedColumns2(
        expandedColumns2.filter((item) => item !== column2Value)
      );
    } else {
      setExpandedColumns2(expandedColumns2.concat(column2Value));
    }
  };

  //render functions for columns section

  const renderColumn3 = (col2Data, i) => {
    const column3Array = col2Data[i].MONTH;
    const col2 = col2Data[i].label;
    return (
      // {`sub-column-th ${i == col2Data.length - 1 ? "" : "border-right"}`}
      <div className="sub-column-th border-right">
        <div className="display-flex border-bottom height-30">
          <ArrowDropDownIcon
            onClick={() => {
              handleColumn2Click(col2Data[i]);
            }}
          />
          <span>{col2}</span>
        </div>
        <div className="display-flex">
          {column3Array.map((col3val, i) => (
            // className={`sub-column-th  ${i == column3Array.length - 1 ? "" : "border-right"}`}
            <div className="sub-column-th border-right">
              <div className=" height-30 displayFlex">{col3val.label}</div>
            </div>
          ))}
          <div className="sub-column-th">
            <div className=" height-30 displayFlex">Total</div>
          </div>
        </div>
      </div>
    );
  };
  const renderColumn2 = (col1) => {
    const column2Array = col1.QUTR;
    const column1 = col1.value;
    const column2InCurrentColumn1 = expandedColumns1.find(
      (col1) => col1.value === column1
    ).QUTR;
    const filteredArray = expandedColumns2.filter((value) =>
      column2InCurrentColumn1.includes(value)
    );
    return (
      <th
        colSpan={
          column2Array.length + 
          1 +
          filteredArray.length * 4 -
          filteredArray.length
        }
        className="th-colspan">
        <div className="display-flex height-30 border-bottom">
          <ArrowDropDownIcon
            onClick={() => {
              handleColumn1Click(col1);
            }}
          />
          <span className="expanded-year">{column1}</span>
        </div>
        <div className="flex">
          {column2Array.map((col2val, i) => (
            <>
              {expandedColumns2.includes(col2val) ? (
                renderColumn3(column2Array, i)
              ) : (
                // ${i == column2Array.length - 1 ? "" : "border-right"}
                <div className="sub-column-th border-right">
                  <div
                    className={`columns-flex ${expandedColumns2.length != 0 &&
                      !expandedColumns2.includes(col2val)
                      ? "height-60"
                      : "height-30"
                      }`}>
                    <ArrowRightIcon
                      onClick={() => {
                        handleColumn2Click(col2val);
                      }}
                    />
                    <span className="expanded-year">{col2val.label}</span>
                  </div>
                </div>
              )}
            </>
          ))}
          <div
            className={`sub-column-th columns-flex ${expandedColumns2.length != 0 ? "height-60" : "height-30"
              }`}>
            <span className="expanded-year marginleft">Total</span>
          </div>
        </div>
      </th>
    );
  };

  const prepareThead = (tableData) => {
    if (!tableData) return;
    let key = Object.keys(tableData)[0];
    return (
      <>
        {tableData[key].map((col1) => {
          return (
            <>
              {expandedColumns1.includes(col1) ? (
                renderColumn2(col1)
              ) : (
                <th>
                  <div
                    className={`columns-flex ${expandedColumns1.length != 0 &&
                      !expandedColumns1.includes(col1)
                      ? expandedColumns2.length != 0
                        ? "height-90"
                        : "height-60"
                      : "height-30"
                      }`}>
                    <ArrowRightIcon
                      onClick={() => {
                        handleColumn1Click(col1);
                      }}
                    />
                    <span>{col1.value ?? col1.label}</span>
                  </div>
                </th>
              )}
            </>
          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="App">
        
            <h1>Pivot Table</h1>
            <div className="table-container">
              <div className="table-scrollbar-container">
                <table>
                  <thead>
                    <tr className="freezeTr">
                      <th className="freezeTh">
                        <div className="icons-resize">
                        <KeyboardDoubleArrowDownIcon 
                        color={`${isRowsExpanded ?"primary":" "}`} 
                        onClick={() => handleExpandAllRows(rowdata)}
                         />
                        <KeyboardDoubleArrowRightIcon  
                        onClick={() => handleExpandAllColumns(columndata)} 
                        color={`${isColumnsExpanded ? "primary" : ""}`} />
                        <SwapHorizSharpIcon onClick={()=>{handleSwap()}} />

                        {/* <ArrowDropDownIcon onClick={() => { setisSwapped(!isSwapped) }} /> */}
                        </div>
                      </th>
                      {isSwapped
                        ? prepareThead(rowdata)
                        : prepareThead(columndata)}
                      {/* {columndata?.YEAR.map((col1) => {
                        return (
                          <>
                            {expandedColumns1.includes(col1) ? (
                              renderColumn2(col1)
                            ) : (
                              <th>
                                <div
                                  className={`columns-flex ${expandedColumns1.length != 0 &&
                                    !expandedColumns1.includes(col1)
                                    ? expandedColumns2.length != 0
                                      ? "height-90"
                                      : "height-60"
                                    : "height-30"
                                    }`}>
                                  <ArrowRightIcon
                                    onClick={() => {
                                      handleColumn1Click(col1);
                                    }}
                                  />
                                  <span>{col1.value}</span>
                                </div>
                              </th>
                            )}
                          </>
                        );
                      })} */}
                    </tr>
                  </thead>
                  <tbody>
                    {rowdata && rowdata[Object.keys(rowdata)[0]].map((record, i) => {
                      return (
                        <>
                          <tr className="row-tr">
                            <td className="td">
                              <div className="department-td">
                                {expandedRows1.includes(record) ? (
                                  <ArrowDropDownIcon
                                    onClick={() => {
                                      handleRow1Click(record);
                                    }}
                                  />
                                ) : (
                                  <ArrowRightIcon
                                    onClick={() => {
                                      handleRow1Click(record);
                                    }}
                                  />
                                )}
                                <span>{record.label}</span>
                              </div>
                            </td>
                            {record.columns.YEAR.map((col1) => {
                              // condition that we clicked the correct year
                              return (
                                <>
                                  {expandedColumns1
                                    .map((col) => col.value)
                                    .includes(col1.value) &&
                                    renderColumn2Rows(col1)}

                                  {expandedColumns1
                                    .map((col) => col.value)
                                    .includes(col1.value) ? null : (
                                    <td className="td"></td>
                                  )}
                                </>
                              );
                            })}
                          </tr>
                          {expandedRows1.includes(record) && renderRow2(record)}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
      </div>
    </>
  );
}
export default PivotTable;