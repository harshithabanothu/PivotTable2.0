
export const prepareSummaryData = (dataArray, heirarchy) => {
  // Prepare column heirarchy
  const pivotDataColumn = {};
  dataArray.forEach((record) => {
    let node = heirarchy.COLUMN.find((c) => c.PARENTKEY === "");
    if (!pivotDataColumn[node.KEY]) {
      pivotDataColumn[node.KEY] = [];
    }
    prepareColumnChildElement(
      record,
      pivotDataColumn[node.KEY],
      node,
      heirarchy.COLUMN
    );
  });
  const pivotDataRow = {};
  dataArray.forEach((record) => {
    let node = heirarchy.ROW.find((c) => c.PARENTKEY === "");
    if (!pivotDataRow[node.KEY]) {
      pivotDataRow[node.KEY] = [];
    }
    prepareRowChildElement(
      record,
      pivotDataRow[node.KEY],
      node,
      heirarchy.ROW,
      heirarchy.COLUMN,
      pivotDataColumn
    );
  });
  // console.log(pivotDataRow);
  return { COLUMNS: pivotDataColumn, ROWS: pivotDataRow };
};
const prepareColumnChildElement = (record, obj, node, columnHeir) => {
  let index = obj.findIndex((obj) => obj.value == record[node.KEY]);
  if (index > -1) {
    let childNodes = columnHeir.filter((c) => c.PARENTKEY === node.KEY);
    if (childNodes.length > 0) {
      childNodes.forEach((child) => {
        if (!obj[index][child.KEY]) {
          obj[index][child.KEY] = [];
        }
        prepareColumnChildElement(
          record,
          obj[index][child.KEY],
          child,
          columnHeir
        );
      });
    }
  } else {
    obj.push({
      value: record[node.KEY],
      aggrValue: 0,
      key : node.KEY,
    });
    if (node.KEY == "QUTR") {
      obj[obj.length - 1].label = "Quarter " + obj[obj.length - 1].value;
    } else if (node.KEY == "MONTH") {
      let monthsArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",

        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      obj[obj.length - 1].label = monthsArray[obj[obj.length - 1].value - 1];
    }
    let childNodes = columnHeir.filter((c) => c.PARENTKEY === node.KEY);
    if (childNodes.length > 0) {
      childNodes.forEach((child) => {
        obj[obj.length - 1][child.KEY] = [];
        prepareColumnChildElement(
          record,
          obj[obj.length - 1][child.KEY],
          child,
          columnHeir
        );
      });
    }
  }
};
const prepareRowChildElement = (
  record,
  obj,
  node,
  rowHeir,
  columnHeir,
  columns
) => {
  let index;
  if (node.TYPE == "characteristic") {
    index = obj.findIndex((obj) => obj.label == record[node.KEY]);
  } else {
    index = obj.findIndex((obj) => obj.label == node.LABEL);
  }
  if (index > -1) {
    if (node.TYPE == "metric") {
      prepareAggregation(
        record,
        obj[index],
        node,
        rowHeir,
        columnHeir,
        columns
      );
    }
    let childNodes = rowHeir.filter((c) => c.PARENTKEY === node.KEY);
    if (childNodes.length > 0) {
      childNodes.forEach((child) => {
        if (!obj[index][child.KEY]) {
          obj[index][child.KEY] = [];
        }
        prepareRowChildElement(
          record,
          obj[index][child.KEY],
          child,
          rowHeir,
          columnHeir,
          columns
        );
      });
    }
  } else {
    if (node.TYPE == "characteristic") {
      obj.push({
        label: record[node.KEY],
        columns: JSON.parse(JSON.stringify(columns)),
      });
    } else {
      obj.push({
        label: node.LABEL,
        key : node.KEY,
      });
      prepareAggregation(
        record,
        obj[obj.length - 1],
        node,
        rowHeir,
        columnHeir,
        columns
      );
    }
    let childNodes = rowHeir.filter((c) => c.PARENTKEY === node.KEY);
    if (childNodes.length > 0) {
      childNodes.forEach((child) => {
        obj[obj.length - 1][child.KEY] = [];
        prepareRowChildElement(
          record,
          obj[obj.length - 1][child.KEY],
          child,
          rowHeir,
          columnHeir,
          columns
        );
      });
    }
  }
};
const prepareAggregation = (
  record,
  obj,
  valueNode,
  rowHeir,
  columnHeir,
  columns
) => {
  let columnsData = JSON.parse(JSON.stringify(columns));
  if (!obj["columns"]) {
    obj["columns"] = columnsData;
  }
  let node = columnHeir.find((c) => c.PARENTKEY === "");
  prepareRowsColumnAggr(
    record,
    obj["columns"][node.KEY],
    node,
    rowHeir,
    columnHeir,
    valueNode
  );
};
const prepareRowsColumnAggr = (
  record,
  obj,
  node,
  rowHeir,
  columnHeir,
  valueNode
) => {
  let index = obj.findIndex((obj) => obj.value == record[node.KEY]);
  if (index > -1) {
    let value = 0;
    if (valueNode.FIELD.includes("SUM(")) {
      let fieldArray = valueNode.FIELD.split("SUM(")[1]
        .split(")")[0]
        .split(",");
      fieldArray.forEach((f) => {
        value = value + record[f.trim()];
      });
    } else if (valueNode.FIELD.includes("CALC(")) {
      let fieldArray = valueNode.FIELD.split("CALC(")[1]
        .split(")")[0]
        .split("-");
      fieldArray.forEach((f, i) => {
        let row = rowHeir.find((c) => c.KEY === f.trim());
        if (row && row.FIELD.includes("SUM(")) {
          let fieldArray1 = row.FIELD.split("SUM(")[1]
            .split(")")[0]
            .split(",");
          fieldArray1.forEach((f1) => {
            if (i == 0) {
              value = value + record[f1.trim()];
            } else {
              value = value - record[f1.trim()];
            }
          });
        } else {
          if (i == 0) {
            value = record[f.trim()];
          } else {
            value = value - record[f.trim()];
          }
        }
      });
    } else {
      value = record[valueNode.KEY];
    }
    if (obj[index].value !== undefined) {
      obj[index].aggrValue = obj[index].aggrValue + value;
    } else {
      obj[index].aggrValue = value;
    }
    let childNodes = columnHeir.filter((c) => c.PARENTKEY === node.KEY);
    if (childNodes.length > 0) {
      childNodes.forEach((child) => {
        prepareRowsColumnAggr(
          record,
          obj[index][child.KEY],
          child,
          rowHeir,
          columnHeir,
          valueNode
        );
      });
    }
  }
};

export const prepareSwappedSummaryData = (dataArray, heirarchy) => {
  // Prepare column heirarchy
  const pivotDataColumn = {};
  dataArray.forEach((record) => {
    let node = heirarchy.ROW.find((c) => c.PARENTKEY === "");
    if (!pivotDataColumn[node.KEY]) {
      pivotDataColumn[node.KEY] = [];
    }
    prepareSwappedColumnChildElement(
      record,
      pivotDataColumn[node.KEY],
      node,
      heirarchy.ROW
    );
  });

  const pivotDataRow = {};
  dataArray.forEach((record) => {
    let node = heirarchy.COLUMN.find((c) => c.PARENTKEY === "");
    if (!pivotDataRow[node.KEY]) {
      pivotDataRow[node.KEY] = [];
    }
    prepareSwappedRowChildElement(
      record,
      pivotDataRow[node.KEY],
      node,
      heirarchy.ROW,
      heirarchy.COLUMN,
      pivotDataColumn
    );
  });
  // console.log(pivotDataRow);
  return { COLUMNS: pivotDataColumn, ROWS: pivotDataRow };

};
const prepareSwappedColumnChildElement = (record, obj, node, rowHeir) => {
  let index;
  if (node.TYPE == "characteristic") {
    index = obj.findIndex((obj) => obj.label == record[node.KEY]);
  } else {
    index = obj.findIndex((obj) => obj.label == node.LABEL);
  }
  if (index > -1) {      
    let childNodes = rowHeir.filter((c) => c.PARENTKEY === node.KEY);
    if (childNodes.length > 0) {
      childNodes.forEach((child) => {
        if (!obj[index][child.KEY]) {
          obj[index][child.KEY] = [];
        }
        prepareSwappedColumnChildElement(
          record,
          obj[index][child.KEY],
          child,
          rowHeir
        );
      });
    }
  } else {
    if (node.TYPE == "characteristic") {
      obj.push({
        key: node.KEY,
        label: record[node.KEY],
        aggrValue: 0,
      });
    } else {
      obj.push({
        key: node.KEY,
        label: node.LABEL,
        aggrValue: 0,
      });
    }
    let childNodes = rowHeir.filter((c) => c.PARENTKEY === node.KEY);
    if (childNodes.length > 0) {
      childNodes.forEach((child) => {
        obj[obj.length - 1][child.KEY] = [];
        prepareSwappedColumnChildElement(
          record,
          obj[obj.length - 1][child.KEY],
          child,
          rowHeir
        );
      });
    }
  }
};
const prepareSwappedRowChildElement = (record, obj, node, rowHeir, columnHeir, columns) => {
  let index = obj.findIndex((obj) => obj.value == record[node.KEY]);
  if (index > -1) {
    prepareSwappedAggregation(
      record,
      obj[index],
      node,
      rowHeir,
      columnHeir,
      columns
    );
    let childNodes = columnHeir.filter((c) => c.PARENTKEY === node.KEY);
    if (childNodes.length > 0) {
      childNodes.forEach((child) => {
        if (!obj[index][child.KEY]) {
          obj[index][child.KEY] = [];
        }
        prepareSwappedRowChildElement(
          record,
          obj[index][child.KEY],
          child,
          rowHeir, columnHeir, columns
        );
      });
    }
  } else {
    obj.push({
      value: record[node.KEY],
      key:node.KEY
    });
    if (node.KEY == "QUTR") {
      obj[obj.length - 1].label = "Quarter " + obj[obj.length - 1].value;
    } else if (node.KEY == "MONTH") {
      let monthsArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",

        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      obj[obj.length - 1].label = monthsArray[obj[obj.length - 1].value - 1];
    }
    prepareSwappedAggregation(
      record,
      obj[obj.length - 1],
      node,
      rowHeir,
      columnHeir,
      columns
    );
    let childNodes = columnHeir.filter((c) => c.PARENTKEY === node.KEY);
    if (childNodes.length > 0) {
      childNodes.forEach((child) => {
        obj[obj.length - 1][child.KEY] = [];
        prepareSwappedRowChildElement(
          record,
          obj[obj.length - 1][child.KEY],
          child,
          rowHeir, columnHeir, columns
        );
      });
    }
  }
};
const prepareSwappedAggregation = (
  record,
  obj,
  valueNode,
  rowHeir,
  columnHeir,
  columns
) => {
  let columnsData = JSON.parse(JSON.stringify(columns));
  if (!obj["columns"]) {
    obj["columns"] = columnsData;
  }
  let node = rowHeir.find((c) => c.PARENTKEY === "");
  prepareSwappedRowsColumnAggr(
    record,
    obj["columns"][node.KEY],
    node,
    rowHeir,
    columnHeir,
    valueNode
  );
};
const prepareSwappedRowsColumnAggr = (
  record,
  obj,
  node,
  rowHeir,
  columnHeir,
  valueNode
) => {
  let index;
  if (node.TYPE == "characteristic") {
    index = obj.findIndex((obj) => obj.label == record[node.KEY]);
  }else{
    index = 0;
  }
  if (index > -1) {
    if (node.TYPE !== "characteristic") {
      let value = 0;
      if (node.FIELD.includes("SUM(")) {
        let fieldArray = node.FIELD.split("SUM(")[1]
          .split(")")[0]
          .split(",");
        fieldArray.forEach((f) => {
          value = value + record[f.trim()];
        });
      } else if (node.FIELD.includes("CALC(")) {
        let fieldArray = node.FIELD.split("CALC(")[1]
          .split(")")[0]
          .split("-");
        fieldArray.forEach((f, i) => {
          let row = rowHeir.find((c) => c.KEY === f.trim());
          if (row && row.FIELD.includes("SUM(")) {
            let fieldArray1 = row.FIELD.split("SUM(")[1]
              .split(")")[0]
              .split(",");
            fieldArray1.forEach((f1) => {
              if (i == 0) {
                value = value + record[f1.trim()];
              } else {
                value = value - record[f1.trim()];
              }
            });
          } else {
            if (i == 0) {
              value = record[f.trim()];
            } else {
              value = value - record[f.trim()];
            }
          }
        });
      } else {
        value = record[node.KEY];
      }
      if (obj[index].aggrValue !== undefined) {
        obj[index].aggrValue = obj[index].aggrValue + value;
      } else {
        obj[index].aggrValue = value;
      }
    }
    let childNodes = rowHeir.filter((c) => c.PARENTKEY === node.KEY);
    if (childNodes.length > 0) {
      childNodes.forEach((child) => {
        prepareSwappedRowsColumnAggr(
          record,
          obj[index][child.KEY],
          child,
          rowHeir,
          columnHeir,
          valueNode
        );
      });
    }
  }
};
