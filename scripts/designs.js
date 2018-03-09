/* constants for jQuery Selectors */
const table = $("#pixelCanvas");
const win = $(window);
const heightField = $("#inputHeight");
const widthField = $("#inputWidth");
const submitButton = $("input[type=submit]");
const resetButton = $("input[type=button]");
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
const colorTransparent = "rgba(256,256,256,0)";
const gridColorPicker = $('#gridColorPicker')


/* variables for color, height, width and markup field */
let isMouseDown = false;
let height;
let width;
let markUp = "";
let color = defaultColor;
let borderColor = "#c0c0c0";
let getCanvas;
let downloadCount = 0;
let gridColor = "white";
let imageName = "pixel_art.jpeg";
let pixelSize = 20;

/* jQuery ready function for executing JS code only when document is fully loaded */
$(document).ready(function() {

    /** check paint brush or eraser handler */
    function checkPaintBrush() {
        if (paintBrush.prop("checked")) {
            table.awesomeCursor("paint-brush", {
                flip: "vertical",
                color: "black",
                size: 18,
                rotate: 45
            });
        } else {
            table.awesomeCursor("eraser", {
                flip: "horizontal",
                color: "black",
                size: 18,
                rotate: 45
            });
        }
    }

    /** check if to paint a cell or erase */
    function eraseOrPaint(cell) {
        if (paintBrush.prop("checked")) {
            cell.css("background-color", color);
        } else {
            cell.css("background-color", colorTransparent);
        }
    }

    // checks for if paint brush or eraser is active
    checkPaintBrush();

    /* code for setting max width for mobile devices */
    if (window.matchMedia("(max-width: 768px)").matches) {
        widthField.attr("max", "10");
        heightField.attr("max", "50");
    }

    /* jQuery window resizing event */
    win.resize(function() {
        if (window.matchMedia("(max-width: 768px)").matches) {
            widthField.attr("max", "10");
            heightField.attr("max", "50");
        } else {
            widthField.attr("max", "130");
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
        if (height > 130 || width > 130) return;
        if (window.matchMedia("(max-width: 768px)").matches) {
            if (height > 50 || width > 10) return;
        }
        let tablejs = document.getElementById('pixelCanvas');
        tablejs.innerHTML="";
        markUp = "";
        /* logic for creating canvas grid */
        for (let i = 0; i < height; i++) {
            markUp += "<tr>";
            for (let j = 0; j < width; j++) {
                markUp += "<td></td>";
            }
            markUp += "</tr>";
        }
        tablejs.innerHTML=markUp;
        table.css("background-color", gridColor);
       // table.html(markUp);
        checkPaintBrush();
        // setting the border color of table
        $("table,tr,td").css("border-color", borderColor);
        if (window.matchMedia("(min-width: 601px)").matches) {
            $('tr').css("height", "" + pixelSize + "px");
            $('td').css("width", "" + pixelSize + "px");

        }

        /* animation code for scrolling to canvas */
        html.animate({
                scrollTop: toolBoxContainer.offset().top
            },
            800
        );

        previewButton.add(downloadButton).css("display", "inline");
        downloadButton.css({
            "pointer-events": "none",
            "opacity": "0.5"
        });
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
        $('td').css("background-color", colorTransparent);
        // colorPicker.val(defaultColor);
        // color = defaultColor;
        imageDiv.empty();
        // table.empty();
        // previewButton.add(downloadButton).css("display", "none");
        downloadButton.css({
            "pointer-events": "none",
            "opacity": "0.5"
        });
        // borderColorPicker.val(defaultColor);
        // borderColor=defaultColor;
        // $("table,tr,td").css("border-color", borderColor);
        paintBrush.prop('checked', true);
        checkPaintBrush();
    });

    /**
     * information button click event code
     */
    infoButton.on("click", function() {
        infoDiv.css("display", "block");
        infoDiv.animate({
                opacity: 1
            },
            800
        );
    });

    /**
     * closebutton code for howto div
     */
    closeButton.on("click", function() {
        infoDiv.animate({
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

    gridColorPicker.change(function() {
        gridColor = $(this).val();
        table.css("background-color", gridColor);
    });

    /**
     * code for preview and download the pixel art as png image.
     */
    previewButton.on('click', function() {
        imageDiv.empty();
        html2canvas(tableContainer.get(0), {
            useCORS: true
        }).then(function(canvas) {
            imageDiv.html(canvas);
            getCanvas = canvas;
        });
        downloadButton.css({
            "pointer-events": "visible",
            "opacity": "1"
        });
    });

    downloadButton.on('click', function() {
        if (navigator.msSaveBlob) {
            console.log('this is IE');
            let URL = window.URL;
            let BlobBuilder = window.MSBlobBuilder;
            navigator.saveBlob = navigator.msSaveBlob;
            let imgBlob = getCanvas.msToBlob();
            if (BlobBuilder && navigator.saveBlob) {
                var showSave = function(data, name, mimetype) {
                    let builder = new BlobBuilder();
                    builder.append(data);
                    let blob = builder.getBlob(mimetype || "application/octet-stream");
                    if (!name)
                        name = "Download.bin";
                    navigator.saveBlob(blob, name);
                };
                showSave(imgBlob, 'pixel_art.png', "image/png");
            }
        } else {

            let img = getCanvas.toDataURL("image/jpeg")
            img = img.replace('data:image/jpeg;base64,', '')
            let finalImageSrc = 'data:image/jpeg;base64,' + img
            downloadButton.attr("download", imageName).attr('href', finalImageSrc);
        }

    });

    /**
     * radio button change event
     */
    $("input[type=radio]").on("change", checkPaintBrush);

    $('#pixelInput').on("change", function() {

        let value = $(this).val();
        pixelSize = parseInt(value, 10);
        // alert(value);
       // console.log(value);
        $('tr').css("height", "" + pixelSize + "px");
        $('td').css("width", "" + pixelSize + "px");
    });

});
