var today = new Date(),
  day = 1000 * 60 * 60 * 24,
  each = Highcharts.each,
  reduce = Highcharts.reduce,
  btnShowDialog = document.getElementById("btnShowDialog"),
  btnRemoveTask = document.getElementById("btnRemoveSelected"),
  btnAddTask = document.getElementById("btnAddTask"),
  btnCancelAddTask = document.getElementById("btnCancelAddTask"),
  addTaskDialog = document.getElementById("addTaskDialog"),
  inputName = document.getElementById("inputName"),
  selectDepartment = document.getElementById("selectDepartment"),
  selectDependency = document.getElementById("selectDependency"),
  chkMilestone = document.getElementById("chkMilestone"),
  isAddingTask = false;

// Set to 00:00:00:000 today
today.setUTCHours(0);
today.setUTCMinutes(0);
today.setUTCSeconds(0);
today.setUTCMilliseconds(0);
today = today.getTime();

// Update disabled status of the remove button, depending on whether or not we
// have any selected points.
function updateRemoveButtonStatus() {
  var chart = this.series.chart;
  // Run in a timeout to allow the select to update
  setTimeout(function () {
    btnRemoveTask.disabled = !chart.getSelectedPoints().length || isAddingTask;
  }, 10);
}

// Create the chart
var chart = Highcharts.ganttChart("container", {
  exporting: {
    enabled: true,
  },
  credits: {
    enabled: false,
  },
  chart: {
    styledMode: true,
    spacingLeft: 1,
    marginTop: 100,
  },

  title: {
    text: "Interactive Gantt Chart",
  },

  subtitle: {
    text: "Drag and drop points to edit",
    marginTop: 100,
  },

  plotOptions: {
    series: {
      animation: false, // Do not animate dependency connectors
      dragDrop: {
        draggableX: true,
        draggableY: true,
        dragMinY: 0,
        dragMaxY: 4,
        dragPrecisionX: day / 3, // Snap to eight hours
      },
      dataLabels: {
        enabled: true,
        format: "{point.name}",
        y: 18, // allow user to toggle label position
        style: {
          color: "black",
          cursor: "default",
          pointerEvents: "none",
        },
      },
      allowPointSelect: true,
      point: {
        events: {
          select: updateRemoveButtonStatus,
          unselect: updateRemoveButtonStatus,
          remove: updateRemoveButtonStatus,
        },
      },
    },
  },

  yAxis: {
    type: "category",
    categories: ["Planning", "Design", "Development", "Launch", ""],
    min: 0,
    max: 4,
  },

  xAxis: {
    currentDateIndicator: true,
  },

  tooltip: {
    xDateFormat: "%a %b %d, %H:%M",
  },

  series: [
    {
      name: "Project 1",
      data: [
        {
          start: today + 1,
          end: today + day * 2,
          name: "Gather Requirements",
          id: "prototype",
          y: 0,
        },
        {
          start: today + day * 3,
          name: "Mockup Complete",
          milestone: true,
          dependency: "prototype",
          id: "proto_done",
          y: 1,
        },
        {
          start: today + day * 4,
          end: today + day * 7,
          name: "Design Prototype",
          id: "design",
          dependency: "proto_done",
          y: 1,
        },
        {
          start: today + day * 8,
          end: today + day * 10,
          name: "Testing",
          id: "testing",
          dependency: "design",
          y: 2,
        },
        {
          start: today + day * 10,
          end: today + day * 12,
          name: "Publish App",
          dependency: "testing",
          y: 3,
        },
      ],
    },
  ],
});

/* Add button handlers for add/remove tasks */

btnRemoveTask.onclick = function () {
  var points = chart.getSelectedPoints();
  each(points, function (point) {
    point.remove();
  });
};

btnShowDialog.onclick = function () {
  // Update dependency list
  var depInnerHTML = '<option value=""></option>';
  each(chart.series[0].points, function (point) {
    depInnerHTML +=
      '<option value="' + point.id + '">' + point.name + " </option>";
  });
  selectDependency.innerHTML = depInnerHTML;

  // Show dialog by removing "hidden" class
  addTaskDialog.className = "overlay";
  isAddingTask = true;

  // Focus name field
  inputName.value = "";
  inputName.focus();
};

btnAddTask.onclick = function () {
  // Get values from dialog
  var series = chart.series[0],
    name = inputName.value,
    undef,
    dependency = chart.get(
      selectDependency.options[selectDependency.selectedIndex].value
    ),
    y = parseInt(
      selectDepartment.options[selectDepartment.selectedIndex].value,
      10
    ),
    maxEnd = reduce(
      series.points,
      function (acc, point) {
        return point.y === y && point.end ? Math.max(acc, point.end) : acc;
      },
      0
    ),
    milestone = chkMilestone.checked || undef;

  // Empty category
  if (maxEnd === 0) {
    maxEnd = today;
  }

  // Add the point
  series.addPoint({
    start: maxEnd + (milestone ? day : 0),
    end: milestone ? undef : maxEnd + day,
    y: y,
    name: name,
    dependency: dependency ? dependency.id : undef,
    milestone: milestone,
  });

  // Hide dialog
  addTaskDialog.className += " hidden";
  isAddingTask = false;
};

btnCancelAddTask.onclick = function () {
  // Hide dialog
  addTaskDialog.className += " hidden";
  isAddingTask = false;
};
