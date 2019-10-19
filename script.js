/*
  To add:
    - ability to add a title (also to show in tooltip as series name)
    - ability to check/uncheck assignee
    - ability to choose between a daily schedule or weekly/monthly
    - ability to remove task
*/

$(document).ready(function() {
  let formData = {
    data: []
  };

  let tasks = 0;

  // Convert date to UTC
  const convertDate = function(dateString) {
    let dateArray = dateString.split("/");
    return Date.UTC(dateArray[2], dateArray[0] - 1, dateArray[1], 8);
  };

  const validateForm = function() {
    event.preventDefault();
    let formInvalid = false;
    $("#user-form input").each(function() {
      if ($(this).val() === "") {
        formInvalid = true;
      }
    });

    if (formInvalid) {
      alert("Please fill in all fields");
      return;
    }

    if (tasks === 1) {
      formData.data.pop();
    }

    let taskObject = {};

    taskObject.name = $("#project").val();
    taskObject.assignee = $("#assignee").val();
    taskObject.start = convertDate($("#startDate").val());
    taskObject.end = convertDate($("#endDate").val());
    taskObject.y = tasks;

    let addTask = {};
    addTask.name = "Add task...";
    addTask.assignee = "-";
    addTask.start = convertDate($("#startDate").val());
    addTask.end = convertDate($("#startDate").val());
    addTask.y = 1;

    formData.data.push(taskObject);

    if (tasks === 0) {
      formData.data.push(addTask);
    }

    tasks++;

    loadGanttChart(formData);
  };

  $("#add-task").click(function() {
    validateForm();
  });

  $(function() {
    $("#startDate").datepicker();
    $("#endDate").datepicker();
  });

  let defaultData = {
    name: "Project 1",
    data: [
      {
        start: Date.UTC(2017, 10, 18, 8),
        end: Date.UTC(2017, 10, 25, 16),
        name: "Start prototype",
        assignee: "Richards",
        y: 0
      },
      {
        start: Date.UTC(2017, 10, 20, 8),
        end: Date.UTC(2017, 10, 24, 16),
        name: "Develop",
        assignee: "Michaels",
        y: 1
      },
      {
        start: Date.UTC(2017, 10, 25, 16),
        end: Date.UTC(2017, 10, 25, 16),
        name: "Prototype done",
        assignee: "Richards",
        y: 2
      },
      {
        start: Date.UTC(2017, 10, 27, 8),
        end: Date.UTC(2017, 11, 3, 16),
        name: "Test prototype",
        assignee: "Richards",
        y: 3
      },
      {
        start: Date.UTC(2017, 10, 23, 8),
        end: Date.UTC(2017, 11, 15, 16),
        name: "Run acceptance tests",
        assignee: "Smith",
        y: 4
      }
    ]
  };

  const loadGanttChart = function(seriesData) {
    Highcharts.ganttChart("gantt-chart", {
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
                text: "Est. days"
              },
              labels: {
                formatter: function() {
                  var point = this.point,
                    days = 1000 * 60 * 60 * 24,
                    number = (point.x2 - point.x) / days;
                  return Math.round(number * 100) / 100;
                }
              }
            },
            {
              labels: {
                format: "{point.start:%e. %b}"
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
                format: "{point.end:%e. %b}"
              }
            }
          ]
        }
      },

      tooltip: {
        xDateFormat: "%e %b %Y, %H:%M"
      },

      series: [seriesData]
    });
  };

  loadGanttChart(defaultData);
});
