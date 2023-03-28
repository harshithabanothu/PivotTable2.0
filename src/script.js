
export  function myFunction() {
    // Your task goes here
    //code for generating the array of objects
    let department = [
      "Department 1",
      "Department 2",
      "Department 3",
      "Department 4",
      "Department 5"
    ]
    let classes = ["Class A","Class B"];
    let subjects = ["Subject 1", "Subject 2", "Subject 3"];
    let batches = [
      "Batch 1", // 1 to 15
      "Batch 2", // 16 to 30
      "Batch 3", // 31 to 45
      "Batch 4" // 46 to 60
    ];
    let Semester = ["Summer" , "Winter"];
    let dataArray = [];          
    // for (let i = 0; i < 100000; i++) {
    //   let bIndex = Math.floor(Math.random() * batches.length);
    //   let batch = batches[bIndex];
    //   let studentID ="Student " + (Math.floor(Math.random() * 14) + 1 + 15 * bIndex);

    //   let newObj = {
    //     Student: studentID,
    //     Department:
    //       department[Math.floor(Math.random() * department.length)],
    //     Year: Math.floor(Math.random() * 4) + 2000,
    //     Semester: Semester[Math.floor(Math.random() * Semester.length)],
    //     Class: classes[Math.floor(Math.random() * classes.length)],
    //     Batch: batch,
    //     Subject: subjects[Math.floor(Math.random() * subjects.length)],
    //     Written: Math.floor(Math.random() * 40) + 10,
    //     Practical: Math.floor(Math.random() * 40) + 10,
    //     Oral: Math.floor(Math.random() * 40) + 10,
    //   };
    //   dataArray.push(newObj);
    // }
    for (var dp = 0; dp < department.length; dp++) {
      for (var c = 0; c < classes.length; c++) {
        for (var b = 0; b < batches.length; b++) {
          for (var s = 1; s < 16; s++) {
            for (var year = 2000; year < 2005; year++) {
              for (var sm = 0; sm < Semester.length; sm++) {
                for (var sb = 0; sb < subjects.length; sb++) {
                  let studentID = "Student " + (s + 15 * b);
                  let newObj = {
                    Student: studentID,
                    Department: department[dp],
                    Year: year,
                    Semester: Semester[sm],
                    Class: classes[c],
                    Batch: batches[b],
                    Subject: subjects[sb],
                    Written: Math.floor(Math.random() * 40) + 10,
                    Practical: Math.floor(Math.random() * 40) + 10,
                    // Oral: Math.floor(Math.random() * 40) + 10,
                  };
                  dataArray.push(newObj);
                }
              }
            }
          }
        }
      }
    }
    // dataArray.sort((a,b)=>{return a.Year-b.Year});
    const pivotDataRow = {};
    const rows = ["Department", "Class", "Batch", "Student"];
    const columns = ["Year", "Semester", "Subject"];
    const values = ["Written", "Practical"];

    const pivotDataColumn = {};

    // let dA = dataArray.sort((a,b)=>{
    //   if(a.Year == b.Year){
    //     if(a.Semester == b.Semester){
    //       return a.Subject < b.Subject ? -1 : 1;
    //     }else{
    //       return a.Semester < b.Semester ? -1 : 1;
    //     }
    //   }else{
    //     return a.Year-b.Year;
    //   }
    // })
    let d = new Date();  
    dataArray.forEach((record) => {
      
      if (!pivotDataColumn[columns[0]]) {
        pivotDataColumn[columns[0]] = [];
      }
      let dIndex = pivotDataColumn[columns[0]].findIndex((obj) => obj.value == record[columns[0]]);
      if (dIndex > -1) {
        if (!pivotDataColumn[columns[0]][dIndex][columns[1]]) {
          pivotDataColumn[columns[0]][dIndex][columns[1]] = [];
        }
        let cIndex = pivotDataColumn[columns[0]][dIndex][columns[1]].findIndex((obj) => obj.value == record[columns[1]]);
        if (cIndex > -1) {
          if (!pivotDataColumn[columns[0]][dIndex][columns[1]][cIndex][columns[2]]) {
            pivotDataColumn[columns[0]][dIndex][columns[1]][cIndex][columns[2]] = [];
          }
          let bIndex = pivotDataColumn[columns[0]][dIndex][columns[1]][cIndex][columns[2]].findIndex((obj) => obj.value == record[columns[2]]);
          if (bIndex > -1) {
            // if (!pivotDataColumn[columns[0]][dIndex][columns[1]][cIndex][columns[2]][bIndex][columns[3]]) {
            //   pivotDataColumn[columns[0]][dIndex][columns[1]][cIndex][columns[2]][bIndex][columns[3]] = [];
            // }
            // let sIndex = pivotDataColumn[columns[0]][dIndex][columns[1]][cIndex][columns[2]][bIndex][columns[3]].findIndex((obj) => obj.value == record[columns[3]]);
            // if (sIndex > -1) {
            //   // last row reached
            // } else {
            //   pivotDataColumn[columns[0]][dIndex][columns[1]][cIndex][columns[2]][bIndex][columns[3]].push({
            //     value: record[columns[3]]
            //   });
            // }
          } else {
            pivotDataColumn[columns[0]][dIndex][columns[1]][cIndex][columns[2]].push({
              value: record[columns[2]]
            });
            // pivotDataColumn[columns[0]][dIndex][columns[1]][cIndex][columns[2]][0][columns[3]] = [];
            // pivotDataColumn[columns[0]][dIndex][columns[1]][cIndex][columns[2]][0][columns[3]].push({
            //   value: record[columns[3]]
            // });
          }
        } else {
          pivotDataColumn[columns[0]][dIndex][columns[1]].push({
            value: record[columns[1]]
          });
          pivotDataColumn[columns[0]][dIndex][columns[1]][0][columns[2]] = [];
          pivotDataColumn[columns[0]][dIndex][columns[1]][0][columns[2]].push({
            value: record[columns[2]]
          });
          // pivotDataColumn[columns[0]][dIndex][columns[1]][0][columns[2]][0][columns[3]] = [];
          // pivotDataColumn[columns[0]][dIndex][columns[1]][0][columns[2]][0][columns[3]].push({
          //   value: record[columns[3]]
          // });
        }
      } else {
        pivotDataColumn[columns[0]].push({
          value: record[columns[0]]
        });
        pivotDataColumn[columns[0]][pivotDataColumn[columns[0]].length - 1][columns[1]] = [];
        pivotDataColumn[columns[0]][pivotDataColumn[columns[0]].length - 1][columns[1]].push({
          value: record[columns[1]]
        });
        pivotDataColumn[columns[0]][pivotDataColumn[columns[0]].length - 1][columns[1]][0][columns[2]] = [];
        pivotDataColumn[columns[0]][pivotDataColumn[columns[0]].length - 1][columns[1]][0][columns[2]].push({
          value: record[columns[2]]
        });
        // pivotDataColumn[columns[0]][pivotDataColumn[columns[0]].length - 1][columns[1]][0][columns[2]][0][columns[3]] = [];
        // pivotDataColumn[columns[0]][pivotDataColumn[columns[0]].length - 1][columns[1]][0][columns[2]][0][columns[3]].push({
        //   value: record[columns[3]]
        // });
      }
    });
    dataArray.forEach((record) => {        
      if (!pivotDataRow[rows[0]]) {
        pivotDataRow[rows[0]] = [];
      }
      let dIndex = pivotDataRow[rows[0]].findIndex((obj) => obj.value == record[rows[0]]);
      if (dIndex > -1) {
        pivotDataRow[rows[0]][dIndex]["columns"] = prepareAggregation(record, pivotDataColumn, pivotDataRow[rows[0]][dIndex]);
        if (!pivotDataRow[rows[0]][dIndex][rows[1]]) {
          pivotDataRow[rows[0]][dIndex][rows[1]] = [];
        }
        let cIndex = pivotDataRow[rows[0]][dIndex][rows[1]].findIndex((obj) => obj.value == record[rows[1]]);
        if (cIndex > -1) {
          pivotDataRow[rows[0]][dIndex][rows[1]][cIndex]["columns"] = 
          prepareAggregation(record, pivotDataColumn, pivotDataRow[rows[0]][dIndex][rows[1]][cIndex]);
          if (!pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]]) {
            pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]] = [];
          }
          let bIndex = pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]].findIndex((obj) => obj.value == record[rows[2]]);
          if (bIndex > -1) {
            pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]][bIndex]["columns"] = 
            prepareAggregation(record, pivotDataColumn, pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]][bIndex]);
            if (!pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]][bIndex][rows[3]]) {
              pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]][bIndex][rows[3]] = [];
            }
            let sIndex = pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]][bIndex][rows[3]].findIndex((obj) => obj.value == record[rows[3]]);
            if (sIndex > -1) {
              pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]][bIndex][rows[3]][sIndex]["columns"] =
              prepareAggregation(record, pivotDataColumn, pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]][bIndex][rows[3]][sIndex]);
              // last row reached
            } else {
              pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]][bIndex][rows[3]].push({
                value: record[rows[3]]
              });
              let length = pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]][bIndex][rows[3]].length;
              pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]][bIndex][rows[3]][length - 1]["columns"] = 
              prepareAggregation(record, pivotDataColumn, pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]][bIndex][rows[3]][length - 1]);
            }
          } else {
            pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]].push({
              value: record[rows[2]]
            });
            let length = pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]].length;
            pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]][length - 1]["columns"] =
            prepareAggregation(record, pivotDataColumn, pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]][length - 1]);
            pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]][length - 1][rows[3]] = [];
            pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]][length - 1][rows[3]].push({
              value: record[rows[3]]
            });
            pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]][length - 1][rows[3]][0]["columns"] =
            prepareAggregation(record, pivotDataColumn, pivotDataRow[rows[0]][dIndex][rows[1]][cIndex][rows[2]][length - 1][rows[3]][0]);
          }
        } else {
          pivotDataRow[rows[0]][dIndex][rows[1]].push({
            value: record[rows[1]]
          });
          let length = pivotDataRow[rows[0]][dIndex][rows[1]].length;
          pivotDataRow[rows[0]][dIndex][rows[1]][length - 1]["columns"] =
          prepareAggregation(record, pivotDataColumn, pivotDataRow[rows[0]][dIndex][rows[1]][length - 1]);
          pivotDataRow[rows[0]][dIndex][rows[1]][length - 1][rows[2]] = [];
          pivotDataRow[rows[0]][dIndex][rows[1]][length - 1][rows[2]].push({
            value: record[rows[2]]
          });
          pivotDataRow[rows[0]][dIndex][rows[1]][length - 1][rows[2]][0]["columns"] =
          prepareAggregation(record, pivotDataColumn, pivotDataRow[rows[0]][dIndex][rows[1]][length - 1][rows[2]][0]);
          pivotDataRow[rows[0]][dIndex][rows[1]][length - 1][rows[2]][0][rows[3]] = [];
          pivotDataRow[rows[0]][dIndex][rows[1]][length - 1][rows[2]][0][rows[3]].push({
            value: record[rows[3]]
          });
          pivotDataRow[rows[0]][dIndex][rows[1]][length - 1][rows[2]][0][rows[3]][0]["columns"] =
          prepareAggregation(record, pivotDataColumn, pivotDataRow[rows[0]][dIndex][rows[1]][length - 1][rows[2]][0][rows[3]][0]);
        }
      } else {
        pivotDataRow[rows[0]].push({
          value: record[rows[0]]
        });
        pivotDataRow[rows[0]][pivotDataRow[rows[0]].length - 1]["columns"] =
        prepareAggregation(record, pivotDataColumn, pivotDataRow[rows[0]][pivotDataRow[rows[0]].length - 1]);          
        pivotDataRow[rows[0]][pivotDataRow[rows[0]].length - 1][rows[1]] = [];
        pivotDataRow[rows[0]][pivotDataRow[rows[0]].length - 1][rows[1]].push({
          value: record[rows[1]]
        });
        pivotDataRow[rows[0]][pivotDataRow[rows[0]].length - 1][rows[1]][0]["columns"] =
        prepareAggregation(record, pivotDataColumn, pivotDataRow[rows[0]][pivotDataRow[rows[0]].length - 1][rows[1]][0]);
        pivotDataRow[rows[0]][pivotDataRow[rows[0]].length - 1][rows[1]][0][rows[2]] = [];
        pivotDataRow[rows[0]][pivotDataRow[rows[0]].length - 1][rows[1]][0][rows[2]].push({
          value: record[rows[2]]
        });
        pivotDataRow[rows[0]][pivotDataRow[rows[0]].length - 1][rows[1]][0][rows[2]][0]["columns"] =
        prepareAggregation(record, pivotDataColumn, pivotDataRow[rows[0]][pivotDataRow[rows[0]].length - 1][rows[1]][0][rows[2]][0]);
        pivotDataRow[rows[0]][pivotDataRow[rows[0]].length - 1][rows[1]][0][rows[2]][0][rows[3]] = [];
        pivotDataRow[rows[0]][pivotDataRow[rows[0]].length - 1][rows[1]][0][rows[2]][0][rows[3]].push({
          value: record[rows[3]]
        });
        pivotDataRow[rows[0]][pivotDataRow[rows[0]].length - 1][rows[1]][0][rows[2]][0][rows[3]][0]["columns"] =
        prepareAggregation(record, pivotDataColumn, pivotDataRow[rows[0]][pivotDataRow[rows[0]].length - 1][rows[1]][0][rows[2]][0][rows[3]][0]);
      }
    });
    pivotDataRow.Department = pivotDataRow.Department.sort((a,b)=> (parseInt(a.value.split(" ")[1])) - (parseInt(b.value.split(" ")[1])));
    let d1 = new Date();
    let sec = d1.getTime() - d.getTime();
    console.log("Actual Time taken:" + sec);   
    return( {...pivotDataRow,...pivotDataColumn});      
  }
  function prepareAggregation(record, columnsData1, obj){
    const columns = ["Year", "Semester", "Subject"];
    let columnsData = JSON.parse(JSON.stringify(columnsData1));      
    if(!obj["columns"]){
      obj["columns"] = columnsData;
    }
    let dIndex = obj["columns"][columns[0]].findIndex((obj) => obj.value == record[columns[0]]);
      if (dIndex > -1) {
        addValues(obj["columns"][columns[0]][dIndex], record);
        let cIndex = obj["columns"][columns[0]][dIndex][columns[1]].findIndex((obj) => obj.value == record[columns[1]]);
        if (cIndex > -1) {
          addValues(obj["columns"][columns[0]][dIndex][columns[1]][cIndex], record);
          let bIndex = obj["columns"][columns[0]][dIndex][columns[1]][cIndex][columns[2]].findIndex((obj) => obj.value == record[columns[2]]);
          if (bIndex > -1) {
            addValues(obj["columns"][columns[0]][dIndex][columns[1]][cIndex][columns[2]][bIndex], record);
          }
        }
      } 
      return obj["columns"];     
  }
  function addValues(obj , record){
    const values = ["Written", "Practical"];
    if(!obj.values){
      obj.values = {};
    }
    for(var i=0; i<values.length; i++){
      if(obj.values[values[i]] !== undefined){
        obj.values[values[i]] = obj.values[values[i]] + record[values[i]]
      }else{
        obj.values[values[i]] = record[values[i]];
      }
    }
  }