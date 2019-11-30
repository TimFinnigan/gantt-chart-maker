/*
  To add:
    - ability to add a title (also to show in tooltip as series name)
    - ability to check/uncheck assignee
    - ability to choose between a daily schedule or weekly/monthly
    - ability to remove task
*/

$(document).ready(function () {
  let formData = {
    data: []
  };

  let tasks = 0;

  // Convert date to UTC
  const convertDate = function (dateString) {
    let dateArray = dateString.split("/");
    return Date.UTC(dateArray[2], dateArray[0] - 1, dateArray[1], 8);
  };

  const validateForm = function () {
    event.preventDefault();
    let formInvalid = false;
    $("#user_form input").each(function () {
      if ($(this).val() === "") {
        formInvalid = true;
      }
    });

    if (formInvalid) {
      alert("Please fill in all fields");
      return;
    }

    let startDate = convertDate($("#start_date").val());
    let endDate = convertDate($("#end_date").val());

    if (startDate > endDate) {
      alert("Start date must come before enÎd date");
      return;
    }

    if (tasks === 1) {
      formData.data.pop();
    }

    let taskObject = {};

    taskObject.name = $("#project").val();
    taskObject.assignee = $("#assignee").val();
    taskObject.start = startDate;
    taskObject.end = endDate;
    taskObject.y = tasks;

    let addTask = {};
    addTask.name = "Add task...";
    addTask.assignee = "-";
    addTask.start = startDate;
    addTask.end = endDate;
    addTask.y = 1;

    formData.data.push(taskObject);

    if (tasks === 0) {
      formData.data.push(addTask);
    }

    tasks++;

    loadGanttChart(formData);
  };

  $("#add_task").click(function () {
    validateForm();
  });

  $(function () {
    $("#start_date").datepicker();
    $("#end_date").datepicker();
  });

  let defaultData = {
    name: "Project 1",
    data: [
      {
        start: Date.UTC(2019, 10, 18, 0),
        end: Date.UTC(2019, 10, 25, 0),
        name: "Start prototype",
        assignee: "Richards",
        y: 0
      },
      {
        start: Date.UTC(2019, 10, 20, 0),
        end: Date.UTC(2019, 10, 24, 0),
        name: "Develop",
        assignee: "Michaels",
        y: 1
      },
      {
        start: Date.UTC(2019, 10, 25, 0),
        end: Date.UTC(2019, 10, 26, 0),
        name: "Prototype done",
        assignee: "Richards",
        y: 2
      },
      {
        start: Date.UTC(2019, 10, 27, 0),
        end: Date.UTC(2019, 11, 3, 0),
        name: "Test prototype",
        assignee: "Richards",
        y: 3
      },
      {
        start: Date.UTC(2019, 11, 1, 0),
        end: Date.UTC(2019, 11, 15, 0),
        name: "Run acceptance tests",
        assignee: "Smith",
        y: 4
      }
    ]
  };

  const loadGanttChart = function (seriesData) {
    Highcharts.ganttChart("gantt_container", {
      credits: { enabled: false },
      chart: {
        width: 1000
      },

      title: {
        text: "Gantt Chart Demo"
      },

      subtitle: {
        text: "Customize your own chart"
      },

      xAxis: {
        tickPixelInterval: 70
      },

      yAxis: {
        type: "category",
        grid: {
          enabled: true,
          borderColor: "rgba(0,0,0,0.3)",
          borderWidth: 1,
          columns: [
            {
              title: {
                text: "Project"
              },
              labels: {
                format: "{point.name}"
              }
            },
            {
              title: {
                text: "Assignee"
              },
              labels: {
                format: "{point.assignee}"
              }
            },
            {
              title: {
                text: "Days"
              },
              labels: {
                formatter: function () {
                  var point = this.point,
                    days = 1000 * 60 * 60 * 24,
                    number = (point.x2 - point.x) / days;
                  return parseInt(number);
                }
              }
            },
            {
              labels: {
                format: "{point.start:%b. %e}"
              },
              title: {
                text: "Start date"
              }
            },
            {
              title: {
                text: "End date"
              },
              offset: 30,
              labels: {
                format: "{point.end:%b. %e}"
              }
            }
          ]
        }
      },

      tooltip: {
        xDateFormat: "%b. %e"
      },

      series: [seriesData]
    });
  };

  loadGanttChart(defaultData);
});
