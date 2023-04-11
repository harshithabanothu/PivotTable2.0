/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";
import $ from "jquery";
import "./App.css";
import { myFunction } from "./script";

function App() {
  const [expandedDepartments, setExpandedDeparments] = useState([]);
  const [expandedClasses, setexpandedClasses] = useState([]);
  const [expandedBatches, setexpandedBatches] = useState([]);
  const [expandedYears, setexpandedYears] = useState([]);
  const [expandedSemesters, setexpandedSemesters] = useState([]);
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
  const handleDepartmentClick = (departmentData) => {
    if (expandedDepartments.includes(departmentData)) {
      setExpandedDeparments(
        expandedDepartments.filter((item) => item !== departmentData)
      );
      setexpandedClasses(
        expandedClasses.filter((item) => !departmentData.CLASS.includes(item))
      );
    } else {
      setExpandedDeparments(expandedDepartments.concat(departmentData));
    }
  };

  const handleClassClick = (classData) => {
    if (expandedClasses.includes(classData)) {
      setexpandedClasses(expandedClasses.filter((item) => item !== classData));
      setexpandedBatches(
        expandedBatches.filter((item) => !classData.BATCH.includes(item))
      );
    } else {
      setexpandedClasses(expandedClasses.concat(classData));
    }
  };

  const handleBatchClick = (batchData) => {
    if (expandedBatches.includes(batchData)) {
      setexpandedBatches(expandedBatches.filter((item) => item !== batchData));
    } else {
      setexpandedBatches(expandedBatches.concat(batchData));
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
  const renderSubjectRows = (subjects) => {
    return subjects.map((subject) => (
      <td className="td">{renderValues(subject.VALUES)}</td>
    ));
  };

  const checkSubjectCondition = (semester, year) => {
    const filteredYear = expandedYears.filter(
      (yearData) => yearData.VALUE === year
    )[0].SEMESTER;
    const filteredArray = expandedSemesters.filter((value) =>
      filteredYear.includes(value)
    );
    return filteredArray.map((sem) => sem.VALUE).includes(semester.VALUE);
  };

  const renderSemesterRows = (year) => {
    const semesters = year.SEMESTER;
    return semesters.map((semester) => (
      <>
        {checkSubjectCondition(semester, year.VALUE) &&
          renderSubjectRows(semester.SUBJECT)}
        {checkSubjectCondition(semester, year.VALUE) ? null : (
          <td className="td">{renderValues(semester.VALUES)}</td>
        )}
      </>
    ));
  };
  const renderStudentRows = (studentArray) => {
    return studentArray?.map((record) => {
      return (
        <>
          <tr className="row-tr">
            <td className="td">
              <div className="student-items-flex">{record.VALUE}</div>
            </td>
            {record.COLUMNS.YEAR.map((colYear) => (
              <>
                {expandedYears
                  .map((col) => col.VALUE)
                  .includes(colYear.VALUE) && renderSemesterRows(colYear)}
                {expandedYears
                  .map((col) => col.VALUE)
                  .includes(colYear.VALUE) ? null : (
                  <td className="td">{renderValues(colYear.VALUES)}</td>
                )}
              </>
            ))}
          </tr>
        </>
      );
    });
  };
  const renderBatchRows = (batchArray) => {
    return batchArray?.map((record) => {
      return (
        <>
          <tr className="row-tr">
            <td className="td">
              <div className="batch-items-flex">
                {expandedBatches.includes(record) ? (
                  <ArrowDropDownIcon
                    onClick={() => {
                      handleBatchClick(record);
                    }}
                  />
                ) : (
                  <ArrowRightIcon
                    onClick={() => {
                      handleBatchClick(record);
                    }}
                  />
                )}
                <span>{record.VALUE}</span>
              </div>
            </td>
            {record.COLUMNS.YEAR.map((colYear) => (
              <>
                {expandedYears
                  .map((col) => col.VALUE)
                  .includes(colYear.VALUE) && renderSemesterRows(colYear)}
                {expandedYears
                  .map((col) => col.VALUE)
                  .includes(colYear.VALUE) ? null : (
                  <td className="td">{renderValues(colYear.VALUES)}</td>
                )}
              </>
            ))}
          </tr>
          {expandedBatches.includes(record) &&
            renderStudentRows(record.STUDENT)}
        </>
      );
    });
  };

  const renderClassRows = (classArray) => {
    return classArray.map((record) => {
      return (
        <>
          <tr className="row-tr">
            <td className="td">
              <div className="class-items-flex">
                {expandedClasses.includes(record) ? (
                  <ArrowDropDownIcon
                    onClick={() => {
                      handleClassClick(record);
                    }}
                  />
                ) : (
                  <ArrowRightIcon
                    onClick={() => {
                      handleClassClick(record);
                    }}
                  />
                )}
                <span>{record.VALUE}</span>
              </div>
            </td>
            {record.COLUMNS.YEAR.map((colYear) => (
              <>
                {expandedYears
                  .map((col) => col.VALUE)
                  .includes(colYear.VALUE) && renderSemesterRows(colYear)}
                {expandedYears
                  .map((col) => col.VALUE)
                  .includes(colYear.VALUE) ? null : (
                  <td className="td">{renderValues(colYear.VALUES)}</td>
                )}
              </>
            ))}
          </tr>
          {expandedClasses.includes(record) && renderBatchRows(record.BATCH)}
        </>
      );
    });
  };

  //onclicks for columns section
  const handleYearClick = (columnyear) => {
    if (expandedYears.includes(columnyear)) {
      setexpandedYears(expandedYears.filter((item) => item !== columnyear));
      setexpandedSemesters(
        expandedSemesters.filter((item) => !columnyear.SEMESTER.includes(item))
      );
    } else {
      setexpandedYears(expandedYears.concat(columnyear));
    }
  };
  const handleSemesterClick = (columnSemester) => {
    if (expandedSemesters.includes(columnSemester)) {
      setexpandedSemesters(
        expandedSemesters.filter((item) => item !== columnSemester)
      );
    } else {
      setexpandedSemesters(expandedSemesters.concat(columnSemester));
    }
  };

  //render functions for columns section

  const renderSubjectsColumns = (semesterData, i) => {
    const subjectArray = semesterData[i].SUBJECT;
    const semester = semesterData[i].VALUE;
    return (
      <div
        colSpan={subjectArray.length}
        className={`sub-column-th ${
          i == semesterData.length - 1 ? "" : "border-right"
        }`}
        style={{ minWidth: "484px" }}>
        <div className="display-flex border-bottom height-30">
          <ArrowDropDownIcon
            onClick={() => {
              handleSemesterClick(semesterData[i]);
            }}
          />
          <span>{semester}</span>
        </div>
        <div className="display-flex">
          {subjectArray.map((subval, i) => (
            <div
              className={`sub-column-th height-60 ${
                i == subjectArray.length - 1 ? "" : "border-right"
              }`}>
              <div
                className="border-bottom height-30"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                {subval.VALUE}
              </div>
              {renderMarksHeadings()}
            </div>
          ))}
        </div>
      </div>
    );
  };
  const renderSemesterColumns = (yearData) => {
    const semesterArray = yearData.SEMESTER;
    const year = yearData.VALUE;
    const semestersInCurrentYear = expandedYears.filter(
      (year) => year.VALUE === yearData.VALUE
    )[0].SEMESTER;
    const filteredArray = expandedSemesters.filter((value) =>
      semestersInCurrentYear.includes(value)
    );
    return (
      <th
        colSpan={
          semesterArray.length + filteredArray.length * 4 - filteredArray.length
        }
        className="th-colspan">
        <div className="display-flex height-30 border-bottom">
          <ArrowDropDownIcon
            onClick={() => {
              handleYearClick(yearData);
            }}
          />
          <span className="expanded-year">{year}</span>
        </div>

        <div className="flex">
          {semesterArray.map((semval, i) => (
            <>
              {/* {expandedSemesters.includes(semval) &&renderSubjectsColumns(semval)} */}
              {expandedSemesters.includes(semval) ? (
                renderSubjectsColumns(semesterArray, i)
              ) : (
                <div
                  className={`sub-column-th ${
                    i == semesterArray.length - 1 ? "" : "border-right"
                  }`}>
                  <div
                    className={`columns-flex ${
                      expandedSemesters.length != 0 &&
                      !expandedSemesters.includes(semval)
                        ? "height-60"
                        : "height-30"
                    }`}>
                    {semval.VALUE == "Total" ? (
                      <span className="empty-span"></span>
                    ) : (
                      <ArrowRightIcon
                        onClick={() => {
                          handleSemesterClick(semval);
                        }}
                      />
                    )}
                    <span className="expanded-year">{semval.VALUE}</span>
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
                      {columndata?.map((coldata) => {
                        return (
                          <>
                            {expandedYears.includes(coldata) ? (
                              renderSemesterColumns(coldata)
                            ) : (
                              <th>
                                <div
                                  className={`columns-flex ${
                                    expandedYears.length != 0 &&
                                    !expandedYears.includes(coldata)
                                      ? expandedSemesters.length != 0
                                        ? "height-90"
                                        : "height-60"
                                      : "height-30"
                                  }`}>
                                  <ArrowRightIcon
                                    onClick={() => {
                                      handleYearClick(coldata);
                                    }}
                                  />
                                  <span>{coldata.VALUE}</span>
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
                                {expandedDepartments.includes(record) ? (
                                  <ArrowDropDownIcon
                                    onClick={() => {
                                      handleDepartmentClick(record);
                                    }}
                                  />
                                ) : (
                                  <ArrowRightIcon
                                    onClick={() => {
                                      handleDepartmentClick(record);
                                    }}
                                  />
                                )}
                                <span>{record.VALUE}</span>
                              </div>
                            </td>
                            {record.COLUMNS.YEAR.map((colYear) => {
                              // condition that we clicked the correct year
                              // console.log(colYear.VALUE);

                              return (
                                <>
                                  {expandedYears
                                    .map((col) => col.VALUE)
                                    .includes(colYear.VALUE) &&
                                    renderSemesterRows(colYear)}

                                  {expandedYears
                                    .map((col) => col.VALUE)
                                    .includes(colYear.VALUE) ? null : (
                                    <td className="td">
                                      {renderValues(colYear.VALUES)}
                                    </td>
                                  )}
                                </>
                              );
                            })}
                          </tr>
                          {expandedDepartments.includes(record) &&
                            renderClassRows(record.CLASS)}
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
