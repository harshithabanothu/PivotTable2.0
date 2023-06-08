/* eslint-disable eqeqeq */
import React, { useState, useRef } from "react";
import "@ui5/webcomponents-icons/dist/navigation-right-arrow.js";
import "@ui5/webcomponents-icons/dist/navigation-down-arrow";
import "@ui5/webcomponents-icons/dist/share";
import "@ui5/webcomponents-icons/dist/drill-down";
import "@ui5/webcomponents-icons/dist/process";
import { Icon } from "@ui5/webcomponents-react";
import "./App.css";
import hireData from "./hirarchydata.json";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function PivotTable(props) {
  const { handleSwap, data } = props;
  const [expandedRows1, setExpandedRows1] = useState([]);
  const [expandedRows2, setExpandedRows2] = useState([]);
  const [isRowsExpanded, setisRowsExpanded] = useState(false);
  const [isColumnsExpanded, setisColumnsExpanded] = useState(false);
  const [expandedColumns1, setExpandedColumns1] = useState([]);
  const [expandedColumns2, setExpandedColumns2] = useState([]);
  const [isSwapped, setisSwapped] = useState(false);
  const stylesRef = useRef(hireData);
  const pivotViewRef = useRef(null);
  // hireData && hireData !== {} ? hireData : null

  const rowdata = data.ROWS;
  // console.log(rowdata);
  const columndata = data.COLUMNS;
  // const styles=hireData.columns.find((obj)=>obj.name).style
  const prepareStyles = (key, props, key2) => {
    let styles;
    if (stylesRef && stylesRef.current && stylesRef.current[props]) {
      if (props == "cells") {
        if (key && key2) {
          styles = stylesRef.current[props].find(
            (obj) => obj.row === key && obj.column === key2
          )?.style;
        } else if (key) {
          styles = stylesRef.current[props].find(
            (obj) => obj.row === key && obj.column === ""
          )?.style;
        } else if (key2) {
          styles = stylesRef.current[props].find(
            (obj) => obj.row === "" && obj.column === key2
          )?.style;
        }
      } else if (props == "rows") {
        styles = stylesRef.current[props].find(
          (obj) => obj.name === key
        )?.style;
      } else if (props == "columns") {
        styles = stylesRef.current[props].find(
          (obj) => obj.name === key
        )?.style;
      }
      return styles;
    }
  };

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
  const handleExpandAllRows = (rowdata) => {
    if (isRowsExpanded) {
      setisRowsExpanded(!isRowsExpanded);
      setExpandedRows1([]);
      setExpandedRows2([]);
    } else {
      setisRowsExpanded(!isRowsExpanded);
      setExpandedRows1(rowdata.EMPID);
      let records = [];
      rowdata.EMPID.map((record) => {
        const { label, columns, ...rest } = record;
        const newArr = Object.values(rest).map((arr) => arr[0]);
        newArr.map((obj) => {
          records.push(obj);
        });
        setExpandedRows2(records);
      });
    }
  };
  const handleExpandAllColumns = (coldata) => {
    if (isColumnsExpanded) {
      setisColumnsExpanded(!isColumnsExpanded);
      setExpandedColumns1([]);
      setExpandedColumns2([]);
    } else {
      setisColumnsExpanded(!isColumnsExpanded);
      setExpandedColumns1(coldata.YEAR);
      let records = [];
      coldata.YEAR.map((obj) => {
        records = records.concat(obj.QUTR);
      });
      setExpandedColumns2(records);
    }
  };
  const handleNumFormater = (num) => {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  };

  //render functions for expanded rows display
  const renderColumn3Rows = (column3, selectedrow) => {
    let totalValue = 0;
    let columnMonthcellstyles, colStyles;
    return (
      <>
        {column3.map((col3) => {
          columnMonthcellstyles = prepareStyles(selectedrow, "Cells", col3.key);
          colStyles = prepareStyles(col3.key, "columns");
          totalValue = totalValue + col3.aggrValue;
          return (
            <td className="td" style={columnMonthcellstyles ?? colStyles}>
              <div className="td-cells-padding">
                {col3.aggrValue == 0 ? " " : handleNumFormater(col3.aggrValue)}
              </div>
            </td>
          );
        })}
        <td className="td" style={columnMonthcellstyles ?? colStyles}>
          <div className="td-cells-padding">
            {totalValue == 0 ? " " : handleNumFormater(totalValue)}
          </div>
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

  const renderColumn2Rows = (column1, selectedrow) => {
    const columns2 = column1.QUTR;
    let totalValue = 0;
    let columnQutrcellstyles, colStyles;
    return (
      <>
        {columns2.map((column2, index) => {
          columnQutrcellstyles = prepareStyles(
            selectedrow,
            "cells",
            column2.key
          );
          colStyles = prepareStyles(column2.key, "columns");
          totalValue = totalValue + parseInt(column2.aggrValue);
          return (
            <>
              {checkColumn3Condition(column2, column1.value) ? (
                renderColumn3Rows(column2.MONTH, selectedrow)
              ) : (
                <td style={columnQutrcellstyles ?? colStyles} className="td">
                  <div className="td-cells-padding">
                    {column2.aggrValue == 0
                      ? ""
                      : handleNumFormater(column2.aggrValue)}
                  </div>
                </td>
              )}
            </>
          );
        })}
        <td
          className="td"
          // style={columnQutrcellstyles ?? colStyles }
        >
          <span className="td-cells-padding">
            {totalValue == 0 ? "" : handleNumFormater(totalValue)}
          </span>
        </td>
      </>
    );
  };

  const renderRow3 = (row3Array) => {
    const { label, key, columns, ...rest } = row3Array;
    const newArr = Object.values(rest).map((arr) => arr[0]);
    return newArr?.map((record) => {
      let rowsubchildstyles = prepareStyles(record.key, "rows");
      let rowcellStyles = prepareStyles(record.key, "cells", "");
      return (
        <>
          <tr style={rowsubchildstyles} className="row-tr">
            <td
              style={rowcellStyles ?? rowsubchildstyles}
              className="td batch-items-flex ">
              <div
                style={{
                  ...(rowcellStyles ?? rowsubchildstyles),
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  alignItems: `${
                    rowcellStyles == undefined
                      ? rowsubchildstyles?.textVerticalAlignment == ""
                        ? "center"
                        : rowsubchildstyles?.textVerticalAlignment
                      : rowcellStyles?.textVerticalAlignment == ""
                      ? "center"
                      : rowcellStyles?.textVerticalAlignment
                  }`,
                  justifyContent: `${
                    rowcellStyles == undefined
                      ? rowsubchildstyles?.textAlignment == ""
                        ? "start"
                        : rowsubchildstyles?.textAlignment
                      : rowcellStyles?.textAlignment == ""
                      ? "start"
                      : rowcellStyles?.textAlignment
                  }`,
                }}
                className="paddingleft">
                {record.label}
              </div>
            </td>
            {record.columns[Object.keys(record.columns)[0]].map((col1) => {
              let rowcellstyles = prepareStyles(record.key, "cells", col1.key);
              let colstyles = prepareStyles(col1.key, "columns");
              return (
                <>
                  {expandedColumns1
                    .map((col) => col.value)
                    .includes(col1.value) ? (
                    renderColumn2Rows(col1, record.key)
                  ) : (
                    <td className="td" style={rowcellstyles ?? colstyles}>
                      <span className="td-cells-padding">
                        {handleNumFormater(col1.aggrValue)}
                      </span>
                    </td>
                  )}
                </>
              );
            })}
          </tr>
        </>
      );
    });
  };

  const renderRow2 = (row2Array) => {
    const { label, columns, key, ...rest } = row2Array;
    const newArr = Object.values(rest).map((arr) => arr[0]);
    // console.log(newArr);
    return newArr.map((record) => {
      let rowchildstyles = prepareStyles(record.key, "rows");
      let rowcellStyles = prepareStyles(record.key, "cells", "");
      return (
        <>
          <tr style={rowchildstyles} className="row-tr">
            <td
              style={rowcellStyles ?? rowchildstyles}
              className="td class-items-flex">
              {Object.keys(record).length > 3 &&
                (expandedRows2.includes(record) ? (
                  <Icon
                    name="navigation-down-arrow"
                    onClick={() => {
                      handleRow2Click(record);
                    }}
                    className="ui5-icon-styles"></Icon>
                ) : (
                  <Icon
                    name="navigation-right-arrow"
                    onClick={() => {
                      handleRow2Click(record);
                    }}
                    className="ui5-icon-styles"></Icon>
                ))}
              <div
                style={{
                  ...(rowcellStyles ?? rowchildstyles),
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  alignItems: `${
                    (rowcellStyles ?? rowchildstyles)?.textVerticalAlignment
                  }`,
                  justifyContent: `${
                    (rowcellStyles ?? rowchildstyles)?.textAlignment
                  }`,
                  paddingLeft: `${
                    Object.keys(record).length > 3 ? "" : "15px"
                  }`,
                }}
                className={`${
                  Object.keys(record).length > 2 ? "" : "marginleft"
                }`}>
                {record.label}
              </div>
            </td>
            {record.columns[Object.keys(record.columns)[0]].map((col1) => {
              let rowcellstyles = prepareStyles(record.key, "cells", col1.key);
              let colstyles = prepareStyles(col1.key, "columns");
              return (
                <>
                  {expandedColumns1
                    .map((col) => col.value)
                    .includes(col1.value) ? (
                    renderColumn2Rows(col1, record.key)
                  ) : (
                    <td className="td" style={rowcellstyles ?? colstyles}>
                      <span className="td-cells-padding">
                        {handleNumFormater(col1.aggrValue)}
                      </span>
                    </td>
                  )}
                </>
              );
            })}
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

  const renderColumn3 = (col2Data, i, subparentstyles) => {
    const column3Array = col2Data[i].MONTH;
    const col2 = col2Data[i].label;
    let column3Styles = prepareStyles(column3Array[0].key, "columns");

    let columncellStyles3 = prepareStyles("", "cells", column3Array[0].key);
    return (
      // {`sub-column-th ${i == col2Data.length - 1 ? "" : "border-right"}`}
      <div style={subparentstyles} className="sub-column-th border-right">
        <div className="display-flex border-bottom height-30">
          <Icon
            name="navigation-down-arrow"
            onClick={() => {
              handleColumn2Click(col2Data[i]);
            }}
            className="ui5-icon-styles"></Icon>
          <span>{col2}</span>
        </div>
        <div className="display-flex">
          {column3Array.map((col3val, i) => {
            // let column3CellStyles=prepareStyles("","cells",col3val.key)
            return (
              // className={`sub-column-th  ${i == column3Array.length - 1 ? "" : "border-right"}`}
              <div
                style={
                  columncellStyles3 ?? prepareStyles(col3val.key, "columns")
                }
                className="sub-column-th border-right">
                <div className=" height-30 displayFlex">{col3val.label}</div>
              </div>
            );
          })}
          <div
            style={columncellStyles3 ?? column3Styles}
            className="sub-column-th">
            <div className=" height-30 displayFlex">Total</div>
          </div>
        </div>
      </div>
    );
  };
  const renderColumn2 = (col1, parentcolstyles) => {
    const column2Array = col1.QUTR;
    // console.log(col1);
    // console.log(column2Array);
    const column1 = col1.value;
    const column2InCurrentColumn1 = expandedColumns1.find(
      (col1) => col1.value === column1
    ).QUTR;
    const filteredArray = expandedColumns2.filter((value) =>
      column2InCurrentColumn1.includes(value)
    );
    let column2CellStyles = prepareStyles("", "cells", column2Array[0].key);
    let column2Styles = prepareStyles(column2Array[0].key, "columns");

    // let cellStyles2 = stylesRef.current?.cells.find(
    //   (obj) => (obj.row === "" && obj.column === column2Array[0].key)
    // )?.style;
    return (
      <th
        style={parentcolstyles}
        colSpan={
          column2Array.length +
          1 +
          filteredArray.length * 4 -
          filteredArray.length
        }
        className="th-colspan">
        <div className="display-flex height-30 border-bottom borderTop">
          <Icon
            name="navigation-down-arrow"
            onClick={() => {
              handleColumn1Click(col1);
            }}
            className="ui5-icon-styles"></Icon>
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: `${
                parentcolstyles?.textVerticalAlignment
                  ? parentcolstyles?.textVerticalAlignment
                  : "center"
              }`,
              justifyContent: `${
                parentcolstyles?.textAlignment
                  ? parentcolstyles?.textAlignment
                  : "start"
              }`,
            }}
            className="expanded-year">
            {column1}
          </div>
        </div>
        <div className="flex">
          {column2Array.map((col2val, i) => {
            // let column2CellStyles = prepareStyles("","cells",col1.key)

            return (
              <>
                {expandedColumns2.includes(col2val) ? (
                  renderColumn3(
                    column2Array,
                    i,
                    column2CellStyles ?? prepareStyles(col2val.key, "columns")
                  )
                ) : (
                  // ${i == column2Array.length - 1 ? "" : "border-right"}
                  <div
                    style={
                      column2CellStyles ?? prepareStyles(col2val.key, "columns")
                    }
                    className="sub-column-th border-right">
                    <div
                      className={`columns-flex  ${
                        expandedColumns2.length != 0 &&
                        !expandedColumns2.includes(col2val)
                          ? "height-60"
                          : "height-30"
                      }`}>
                      <Icon
                        name="navigation-right-arrow"
                        onClick={() => {
                          handleColumn2Click(col2val);
                        }}
                        className="ui5-icon-styles"></Icon>
                      <div
                        style={{
                          height: "100%",
                          width: "100%",
                          display: "flex",
                          alignItems: `${
                            column2CellStyles?.textVerticalAlignment
                              ? column2CellStyles?.textVerticalAlignment
                              : "center"
                          }`,
                          justifyContent: `${
                            column2CellStyles?.textAlignment
                              ? column2CellStyles?.textAlignment
                              : "start"
                          }`,
                        }}
                        className="expanded-year">
                        {col2val.label}
                      </div>
                    </div>
                  </div>
                )}
              </>
            );
          })}
          <div
            style={column2CellStyles ?? column2Styles}
            className={`sub-column-th columns-flex ${
              expandedColumns2.length != 0 ? "height-60" : "height-30"
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
          let columnCellStyles = prepareStyles("", "cells", col1.key);
          return (
            <>
              {expandedColumns1.includes(col1) ? (
                renderColumn2(
                  col1,
                  columnCellStyles ?? prepareStyles(col1.key, "columns")
                )
              ) : (
                <th
                  style={
                    columnCellStyles ?? prepareStyles(col1.key, "columns")
                  }>
                  <div
                    className={`columns-flex borderTop ${
                      expandedColumns1.length != 0 &&
                      !expandedColumns1.includes(col1)
                        ? expandedColumns2.length != 0
                          ? "height-90"
                          : "height-60"
                        : "height-30"
                    }`}>
                    <Icon
                      name="navigation-right-arrow"
                      onClick={() => {
                        handleColumn1Click(col1);
                      }}
                      className="ui5-icon-styles"></Icon>
                    <div
                      style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        alignItems: `${
                          columnCellStyles?.textVerticalAlignment
                            ? columnCellStyles?.textVerticalAlignment
                            : "center"
                        }`,
                        justifyContent: `${
                          columnCellStyles?.textAlignment
                            ? columnCellStyles?.textAlignment
                            : "start"
                        }`,
                      }}>
                      {col1.value ?? col1.label}
                    </div>
                  </div>
                </th>
              )}
            </>
          );
        })}
      </>
    );
  };
  const handleDownload = (ref) => {
    const table = ref.current;
    const rows = table.querySelectorAll('tr');
    const csvData = [];
  
    // Get header row and cells
    const headerRow = table.querySelector('thead tr');
    const headerCells = headerRow.querySelectorAll('th');
  
    const headerValues = [];
    let headerCellIndex = 0;
  
    // Process header cells
    for (let j = 0; j < headerCells.length; j++) {
      const headerCell = headerCells[j];
      const headerCellValue = headerCell.innerText;
      const colspan = headerCell.getAttribute('colSpan') || 1;
  
      const quotedHeaderCellValue = `"${headerCellValue}"`.repeat(colspan); // Repeat header cell value with colspan
  
      if (colspan > 1) {
        // Handle header cells with colspan > 1
        for (let k = 0; k < colspan; k++) {
          headerValues.push(''); // Add empty cells for each colspan
        }
      }
  
      headerValues[headerCellIndex] = quotedHeaderCellValue;
      headerCellIndex += colspan;
    }
  
    csvData.push(headerValues.join(','));
  
    // Process data rows
    for (let i = 0; i < rows.length; i++) {
      const row = [];
      const cells = rows[i].querySelectorAll('td, th'); // Include th cells as well
  
      let cellIndex = 0;
      for (let j = 0; j < cells.length; j++) {
        const cell = cells[j];
        const cellValue = cell.innerText;
        const colspan = cell.getAttribute('colSpan') || 1;
  
        const quotedCellValue = `"${cellValue}"`.repeat(colspan); // Repeat cell value with colspan
  
        if (colspan > 1) {
          // Handle cells with colspan > 1
          for (let k = 0; k < colspan; k++) {
            row.push(''); // Add empty cells for each colspan
          }
        }
  
        row[cellIndex] = quotedCellValue;
        cellIndex += colspan;
      }
  
      csvData.push(row.join(','));
    }
  
    // Modify the pivot table structure
    const modifiedCsvData = [];
    const numRows = csvData.length;
    const numCols = 17; // Number of columns in the modified pivot table
  
    for (let i = 0; i < numRows; i += 4) {
      const pivotRow = [];
  
      for (let j = 0; j < numCols; j++) {
        const dataIndex = i + Math.floor(j / 4) + 1;
  
        if (dataIndex < numRows) {
          pivotRow.push(csvData[dataIndex]);
        } else {
          pivotRow.push('');
        }
      }
  
      modifiedCsvData.push(pivotRow.join(','));
    }
  
    const csvContent = 'data:text/csv;charset=utf-8,' + modifiedCsvData.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  
  return (
    <>
      <div className="App">
         <div className="display-flex">
            <h1>Synopsis Table</h1>
            {/* <button onClick={handleDownload}>Download</button> */}
         </div>

        <div className="table-container">
          <div className="table-scrollbar-container">
            <table ref={pivotViewRef}>
              <thead>
                <tr className="freezeTr">
                  <th className="freezeTh">
                    <div className="icons-resize">
                      <Icon
                        name="drill-down"
                        className="ui5-icon-styles"
                        color={`${isRowsExpanded ? "primary" : " "}`}
                        onClick={() => handleExpandAllRows(rowdata)}></Icon>
                      <Icon
                        name="process"
                        className="ui5-icon-styles"
                        onClick={() => handleExpandAllColumns(columndata)}
                        color={`${isColumnsExpanded ? "primary" : ""}`}></Icon>
                      <Icon
                        name="share"
                        className="ui5-icon-styles"
                        onClick={() => {
                          handleSwap();
                        }}></Icon>
                    </div>
                  </th>
                  {isSwapped ? prepareThead(rowdata) : prepareThead(columndata)}
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
                {rowdata &&
                  rowdata[Object.keys(rowdata)[0]].map((record, i) => {
                    let rowStyles = prepareStyles(
                      Object.keys(rowdata)[0],
                      "rows"
                    );
                    let rowcellStyles = prepareStyles(
                      Object.keys(rowdata)[0],
                      "cells",
                      ""
                    );
                    return (
                      <>
                        <tr style={rowStyles} className="row-tr">
                          <td
                            style={{
                              ...(rowcellStyles ?? rowStyles),
                            }}
                            className="td department-td">
                            {expandedRows1.includes(record) ? (
                              <Icon
                                name="navigation-down-arrow"
                                onClick={() => {
                                  handleRow1Click(record);
                                }}
                                className="ui5-icon-styles"></Icon>
                            ) : (
                              <Icon
                                name="navigation-right-arrow"
                                onClick={() => {
                                  handleRow1Click(record);
                                }}
                                className="ui5-icon-styles"></Icon>
                            )}
                            <div
                              style={{
                                height: "100%",
                                width: "100%",
                                display: "flex",
                                alignItems: `${
                                  rowcellStyles?.textVerticalAlignment ??
                                  "center"
                                }`,
                                justifyContent: `${
                                  rowcellStyles?.textAlignment ?? "start"
                                }`,
                              }}>
                              {record.label}
                            </div>
                          </td>
                          {record.columns[Object.keys(record.columns)[0]].map(
                            (col1, index) => {
                              // condition that we clicked the correct year
                              let columnStyles = prepareStyles(
                                Object.keys(record.columns)[0],
                                "columns"
                              );
                              let cellStyles = prepareStyles(
                                Object.keys(rowdata)[0],
                                "columns",
                                col1.key
                              );
                              return (
                                <>
                                  {expandedColumns1
                                    .map((col) => col.value)
                                    .includes(col1.value) ? (
                                    renderColumn2Rows(
                                      col1,
                                      Object.keys(rowdata)[0]
                                    )
                                  ) : (
                                    <td
                                      style={cellStyles ?? columnStyles}
                                      className="td"></td>
                                  )}
                                </>
                              );
                            }
                          )}
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
