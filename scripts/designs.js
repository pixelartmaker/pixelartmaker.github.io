/* constants for jQuery Selectors */
const table = $("#pixelCanvas");
const win = $(window);
const heightField = $("#inputHeight");
const widthField = $("#inputWidth");
const submitButton = $("input[type=submit]");
const resetButton = $("input[type=reset]");
const defaultColor = "#8A2BE2";
const colorPicker = $("#colorPicker");
const tableContainer = $("#tableBox");
const cell = $("td");
const infoButton = $("span.info");
const infoDiv = $("#infoBox");
const closeButton = $("span.close");
const html = $("html, body");
const imageDiv = $("#previewImage");
const downloadButton = $("#downloadButton");
const previewButton = $("#previewButton");
const toolBoxContainer = $("#toolBox");
const borderColorPicker = $("#borderColorPicker");
const paintBrush = $("#paint-brush");

/* variables for color, height, width and markup field */
let isMouseDown = false;
let height;
let width;
let markUp = "";
let color = defaultColor;
let borderColor = defaultColor;
let getCanvas;

/* jQuery ready function for executing JS code only when document is fully loaded */
$(document).ready(function() {
  
  /** check paint brush or eraser handler */
function checkPaintBrush() {
  if (paintBrush.prop("checked")) {
    table.awesomeCursor("paint-brush", {
      flip: "vertical",
      color: "black",
      size: 18,
      rotate: 90
    });
  } else {
    table.awesomeCursor("eraser", {
      flip: "vertical",
      color: "black",
      size: 18,
      rotate: 90
    });
  }
}

/** check if to paint a cell or erase */
function eraseOrPaint(cell) {
  if (paintBrush.prop("checked")) {
    cell.css("background-color", color);
  } else {
    cell.css("background-color", "#fff");
  }
}
  
  // checks for if paint brush or eraser is active
  checkPaintBrush();

  /* code for setting max width for mobile devices */
  if (window.matchMedia("(max-width: 768px)").matches) {
    widthField.attr("max", "10");
  }

  /* jQuery window resizing event */
  win.resize(function() {
    if (window.matchMedia("(max-width: 768px)").matches) {
      widthField.attr("max", "10");
    } else {
      widthField.attr("max", "30");
    }
  });

  /* jQuery submit button click event */
  submitButton.on("click", function makegrid() {
    height = heightField.val();
    height = parseInt(height, 10);
    width = widthField.val();
    width = parseInt(width, 10);
    /**
     * form validation for input fields height and width
     * so that these are within specified range
     */
    if (height > 30 || width > 30) return;
    if (window.matchMedia("(max-width: 768px)").matches) {
      if (height > 30 || width > 10) return;
    }
    markUp = "";
    /* logic for creating canvas grid */
    for (let i = 0; i < height; i++) {
      markUp += "<tr>";
      for (let j = 0; j < width; j++) {
        markUp += "<td></td>";
      }
      markUp += "</tr>";
    }
    table.html(markUp);
    checkPaintBrush();
    // setting the border color of table
    $("table,tr,td").css("border-color", borderColor);

    /* animation code for scrolling to canvas */
    html.animate(
      {
        scrollTop: toolBoxContainer.offset().top
      },
      2000
    );

    previewButton.add(downloadButton).css("display", "inline");
    downloadButton.css({ "pointer-events": "none", "opacity": "0.5" });
    imageDiv.empty();

    return false;
  });

  /**
   * code for paint brush functionality and eraser depending upon single click or drag
   */
  table.on("mousedown", "td", function() {
    isMouseDown = true;
  });

  table.on("mouseup", "td", function() {
    isMouseDown = false;
  });

  table.on("mouseenter click", "td", function(evt) {
    if (evt.type == "click") {
      eraseOrPaint($(this));
    } else {
      if (isMouseDown) {
        eraseOrPaint($(this));
      }
    }
  });

  /**
   * reset button code
   */
  resetButton.on("click", function() {
    $('td').css("background-color", "#fff");
    colorPicker.val(defaultColor);
    color = defaultColor;
    imageDiv.empty();
   // table.empty();
   // previewButton.add(downloadButton).css("display", "none");
    downloadButton.css({ "pointer-events": "none", "opacity": "0.5" });
    borderColorPicker.val(defaultColor);
    borderColor=defaultColor;
    $("table,tr,td").css("border-color", borderColor);
  });

  /**
   * information button click event code
   */
  infoButton.on("click", function() {
    infoDiv.css("display", "block");
    infoDiv.animate(
      {
        opacity: 1
      },
      800
    );
  });

  /**
   * closebutton code for howto div
   */
  closeButton.on("click", function() {
    infoDiv.animate(
      {
        opacity: 0
      },
      800,
      function() {
        $(this).css("display", "none");
      }
    );
  });

  /**
   * colorPicker change event
   */
  colorPicker.change(function() {
    color = colorPicker.val();
  });

  /**
   * border color picker change event
   */
  borderColorPicker.change(function() {
    borderColor = $(this).val();
    $("table,tr,td").css("border-color", borderColor);
  });
  /**
   * code for preview and download the pixel art as png image.
   */
  previewButton.on("click", function() {
    // $("table,tr,td").css("border-color","#fff");
    html2canvas(tableContainer.get(0)).then(function(canvas) {
      imageDiv.html(canvas);
      getCanvas = canvas;
      // $("table,tr,td").css("border-color",borderColor);
    });

    downloadButton.css({ "pointer-events": "visible", opacity: "1" });
  });

  downloadButton.on("click", function() {
    var imgageData = getCanvas.toDataURL("image/png");
    // Now browser starts downloading it instead of just showing it
    var newData = imgageData.replace(
      /^data:image\/png/,
      "data:application/octet-stream"
    );
    downloadButton.attr("download", "pixel_art.png").attr("href", newData);
  });

  /**
   * radio button change event
   */
  $("input[type=radio]").on("change", checkPaintBrush);
});
