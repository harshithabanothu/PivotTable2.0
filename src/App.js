/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";
import $ from "jquery";
import "./App.css";
import { myFunction } from "./script";

function App() {
  const [expandedRows1, setExpandedRows1] = useState([]);
  const [expandedRows2, setExpandedRows2] = useState([]);
  const [expandedRows3, setExpandedRows3] = useState([]);
  const [expandedColumns1, setExpandedColumns1] = useState([]);
  const [expandedColumns2, setExpandedColumns2] = useState([]);
  const [data, setData] = useState({});
  const dataFetchRef = useRef(false);

  useEffect(() => {
    if (dataFetchRef.current) return;
    dataFetchRef.current = true;
    $.ajax({
      url: "http://shelby.vistex.local:8000/sap/opu/odata/sap/ZSYNDATA_SRV/PivotDataSet?$format=json",
    }).done((response) => {
      console.log(JSON.parse(response.d.results[0].Data));
      setData(JSON.parse(response.d.results[0].Data));
    });
  }, []);
  const rowdata = data.ROWS;
  const columndata = data.COLUMNS;

  //onclick functions for rows display
  const handleRow1Click = (row1Data) => {
    if (expandedRows1.includes(row1Data)) {
      setExpandedRows1(
        expandedRows1.filter((item) => item !== row1Data)
      );
      setExpandedRows2(
        expandedRows2.filter((item) => !row1Data.CLASS.includes(item))
      );
    } else {
      setExpandedRows1(expandedRows1.concat(row1Data));
    }
  };

  const handleRow2Click = (row2Data) => {
    if (expandedRows2.includes(row2Data)) {
      setExpandedRows2(expandedRows2.filter((item) => item !== row2Data));
      setExpandedRows2(
        expandedRows3.filter((item) => !row2Data.BATCH.includes(item))
      );
    } else {
      setExpandedRows2(expandedRows2.concat(row2Data));
    }
  };

  const handleRow3Click = (row3Data) => {
    if (expandedRows3.includes(row3Data)) {
      setExpandedRows3(expandedRows3.filter((item) => item !== row3Data));
    } else {
      setExpandedRows3(expandedRows3.concat(row3Data));
    }
  };
  const handleNumFormater = (num) => {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  };

  const renderValues = (values) => {
    return (
      <div className="data-value-cells">
        <div>{handleNumFormater(values?.WRITTEN) || 0}</div>
        <div className="border-none">
          {handleNumFormater(values?.PRACTICAL) || 0}
        </div>
      </div>
    );
  };
  const renderMarksHeadings = () => {
    return (
      <div className="sub-column-heading ">
        <div className="border-right">Written</div>
        <div className="border-none">Practical</div>
      </div>
    );
  };

  //render functions for expanded rows display
  const renderColumn3Rows = (column3) => {
    return column3.map((col3) => (
      <td className="td">{renderValues(col3.VALUES)}</td>
    ));
  };

  const checkColumn3Condition = (column2, column1) => {
    const filteredYear = expandedColumns1.filter(
      (col1) => col1.VALUE === column1
    )[0].SEMESTER;
    const filteredArray = expandedColumns2.filter((value) =>
      filteredYear.includes(value)
    );
    return filteredArray.map((col2val) => col2val.VALUE).includes(column2.VALUE);
  };

  const renderColumn2Rows = (column1) => {
    const columns2 = column1.SEMESTER;
    return columns2.map((column2) => (
      <>
        {checkColumn3Condition(column2, column1.VALUE) &&
          renderColumn3Rows(column2.SUBJECT)}
        {checkColumn3Condition(column2, column1.VALUE) ? null : (
          <td className="td">{renderValues(column2.VALUES)}</td>
        )}
      </>
    ));
  };
  const renderRow4 = (row4Array) => {
    return row4Array?.map((record) => {
      return (
        <>
          <tr className="row-tr">
            <td className="td">
              <div className="student-items-flex">{record.VALUE}</div>
            </td>
            {record.COLUMNS.YEAR.map((col1) => (
              <>
                {expandedColumns1
                  .map((col) => col.VALUE)
                  .includes(col1.VALUE) && renderColumn2Rows(col1)}
                {expandedColumns1
                  .map((col) => col.VALUE)
                  .includes(col1.VALUE) ? null : (
                  <td className="td">{renderValues(col1.VALUES)}</td>
                )}
              </>
            ))}
          </tr>
        </>
      );
    });
  };
  const renderRow3 = (row3Array) => {
    return row3Array?.map((record) => {
      return (
        <>
          <tr className="row-tr">
            <td className="td">
              <div className="batch-items-flex">
                {expandedRows3.includes(record) ? (
                  <ArrowDropDownIcon
                    onClick={() => {
                      handleRow3Click(record);
                    }}
                  />
                ) : (
                  <ArrowRightIcon
                    onClick={() => {
                      handleRow3Click(record);
                    }}
                  />
                )}
                <span>{record.VALUE}</span>
              </div>
            </td>
            {record.COLUMNS.YEAR.map((col1) => (
              <>
                {expandedColumns1
                  .map((col) => col.VALUE)
                  .includes(col1.VALUE) && renderColumn2Rows(col1)}
                {expandedColumns1
                  .map((col) => col.VALUE)
                  .includes(col1.VALUE) ? null : (
                  <td className="td">{renderValues(col1.VALUES)}</td>
                )}
              </>
            ))}
          </tr>
          {expandedRows3.includes(record) &&
            renderRow4(record.STUDENT)}
        </>
      );
    });
  };

  const renderRow2 = (row2Array) => {
    return row2Array.map((record) => {
      return (
        <>
          <tr className="row-tr">
            <td className="td">
              <div className="class-items-flex">
                {expandedRows2.includes(record) ? (
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
                )}
                <span>{record.VALUE}</span>
              </div>
            </td>
            {record.COLUMNS.YEAR.map((col1) => (
              <>
                {expandedColumns1
                  .map((col) => col.VALUE)
                  .includes(col1.VALUE) && renderColumn2Rows(col1)}
                {expandedColumns1
                  .map((col) => col.VALUE)
                  .includes(col1.VALUE) ? null : (
                  <td className="td">{renderValues(col1.VALUES)}</td>
                )}
              </>
            ))}
          </tr>
          {expandedRows2.includes(record) && renderRow3(record.BATCH)}
        </>
      );
    });
  };

  //onclicks for columns section
  const handleColumn1Click = (column1Value) => {
    if (expandedColumns1.includes(column1Value)) {
      setExpandedColumns1(expandedColumns1.filter((item) => item !== column1Value));
      setExpandedColumns2(
        expandedColumns2.filter((item) => !column1Value.SEMESTER.includes(item))
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
    const column3Array = col2Data[i].SUBJECT;
    const col2 = col2Data[i].VALUE;
    return (
      <div
        colSpan={column3Array.length}
        className={`sub-column-th ${
          i == col2Data.length - 1 ? "" : "border-right"
        }`}
        style={{ minWidth: "484px" }}>
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
            <div
              className={`sub-column-th height-60 ${
                i == column3Array.length - 1 ? "" : "border-right"
              }`}>
              <div
                className="border-bottom height-30"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                {col3val.VALUE}
              </div>
              {renderMarksHeadings()}
            </div>
          ))}
        </div>
      </div>
    );
  };
  const renderColumn2 = (col1) => {
    const column2Array = col1.SEMESTER;
    const column1 = col1.VALUE;
    const column2InCurrentColumn1 = expandedColumns1.find(
      (col1) => col1.VALUE === col1.VALUE
    ).SEMESTER;
    const filteredArray = expandedColumns2.filter((value) =>
      column2InCurrentColumn1.includes(value)
    );
    return (
      <th
        colSpan={
          column2Array.length + filteredArray.length * 4 - filteredArray.length
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
              {/* {expandedColumns2.includes(semval) &&renderColumn3(semval)} */}
              {expandedColumns2.includes(col2val) ? (
                renderColumn3(column2Array, i)
              ) : (
                <div
                  className={`sub-column-th ${
                    i == column2Array.length - 1 ? "" : "border-right"
                  }`}>
                  <div
                    className={`columns-flex ${
                      expandedColumns2.length != 0 &&
                      !expandedColumns2.includes(col2val)
                        ? "height-60"
                        : "height-30"
                    }`}>
                    {col2val.VALUE == "Total" ? (
                      <span className="empty-span"></span>
                    ) : (
                      <ArrowRightIcon
                        onClick={() => {
                          handleColumn2Click(col2val);
                        }}
                      />
                    )}
                    <span className="expanded-year">{col2val.VALUE}</span>
                  </div>

                  {renderMarksHeadings()}
                </div>
              )}
            </>
          ))}
        </div>
      </th>
    );
  };

  return (
    <>
      <div className="App">
        {dataFetchRef.current ? (
          <>
            <h1>Pivot Table</h1>
            <div className="table-container">
              <div className="table-scrollbar-container">
                <table>
                  <thead>
                    <tr className="freezeTr">
                      <th className="freezeTh"></th>
                      {columndata?.map((col1) => {
                        return (
                          <>
                            {expandedColumns1.includes(col1) ? (
                              renderColumn2(col1)
                            ) : (
                              <th>
                                <div
                                  className={`columns-flex ${
                                    expandedColumns1.length != 0 &&
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
                                  <span>{col1.VALUE}</span>
                                </div>
                                {renderMarksHeadings()}
                              </th>
                            )}
                          </>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {rowdata?.map((record, i) => {
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
                                <span>{record.VALUE}</span>
                              </div>
                            </td>
                            {record.COLUMNS.YEAR.map((col1) => {
                              // condition that we clicked the correct year
                              // console.log(colYear.VALUE);

                              return (
                                <>
                                  {expandedColumns1
                                    .map((col) => col.VALUE)
                                    .includes(col1.VALUE) &&
                                    renderColumn2Rows(col1)}

                                  {expandedColumns1
                                    .map((col) => col.VALUE)
                                    .includes(col1.VALUE) ? null : (
                                    <td className="td">
                                      {renderValues(col1.VALUES)}
                                    </td>
                                  )}
                                </>
                              );
                            })}
                          </tr>
                          {expandedRows1.includes(record) &&
                            renderRow2(record.CLASS)}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="spinner-container">
            <HourglassFullIcon className="loading-spinner" />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
