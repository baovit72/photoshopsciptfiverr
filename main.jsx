/*********************************************************SETUP*************************************************************************/
//Step 1: You need to set layer prefixes that will be grouped in combinations.
const allowedPrefixes = [
  "HandDemo",
  "HatDemo",
  "MaskDemo",
  "JacketDemo",
  "VestDemo",
  "BottomDemo",
];

//Step 2: You need to set the export folder.
const rawExportFolder = "C:/NiRIFE Studio/Fiverr/PTS AUTOMATION 1ST/output";

//Step 3: Enter resume id (the last file number in export folder - default:: -1 )
const lastId = -1;

/*******************************************************FOR DEV LOG*************************************************************************/

var isDev = false;

/********************************************************HELPERS**********************************************************************/
function findItemInArray(array, cb) {
  for (var i = 0; i < array.length; i++) {
    var item = array[i];
    if (cb(item)) return item;
  }
  return null;
}

function convertFilePath(filePath) {
  if (filePath.indexOf("~") != -1) return filePath;
  return "/" + filePath.replace(/\\/g, "/").replace(/:/g, "");
}

function TimeIt() {
  this.startTime = new Date();
  this.endTime = new Date();
  this.start = function () {
    this.startTime = new Date();
  };
  this.stop = function () {
    this.endTime = new Date();
  };
  this.getTime = function () {
    return (this.endTime.getTime() - this.startTime.getTime()) / 1000;
  };
  this.showTime = function () {
    alert((this.endTime.getTime() - this.startTime.getTime()) / 1000);
  };
  this.getElapsed = function () {
    this.endTime = new Date();
    return this.getTime();
  };
}

function collectAllLayers(doc, allLayers) {
  for (var m = 0; m < doc.layers.length; m++) {
    var theLayer = doc.layers[m];
    var layerName = theLayer.name;
    if (theLayer.typename === "ArtLayer") {
      var groupName = findItemInArray(allowedPrefixes, function proc(p) {
        return layerName.indexOf(p + "_") === 0;
      });
      if (groupName) {
        !allLayers[groupName] && (allLayers[groupName] = []);
        theLayer.visible = false;
        allLayers[groupName].push(theLayer);
      }
    } else {
      theLayer.visible = true;
      collectAllLayers(theLayer, allLayers);
    }
  }
  return allLayers;
}

function exportToPNG(doc, fileDir) {
  var jpgOptions = new JPEGSaveOptions();
  jpgOptions.quality = 12;
  doc.saveAs(new File(fileDir), jpgOptions, true, Extension.LOWERCASE);
}

function getIndexArray(length) {
  var array = [];
  for (var i = 0; i < length; i++) {
    array[i] = -1;
  }
  return array;
}

/*******************************************************MAIN*********************************************************************/

var doc = app.activeDocument;
var totalTime = new TimeIt();
const alllLayers = {};
var exportFolder = rawExportFolder;
var folderObj = new Folder(exportFolder);
if (!folderObj.exists) folderObj.create();

//Get all layers by group
var allLayers = collectAllLayers(doc, alllLayers);

var indexes = getIndexArray(allowedPrefixes.length);

var numOfCombinations = 1;

for (var i = 0; i < indexes.length; i++) {
  isDev && $.writeln(allLayers[allowedPrefixes[i]].length);
  numOfCombinations *= allLayers[allowedPrefixes[i]].length;
}

isDev && $.writeln(numOfCombinations);

for (var i = 0; i < numOfCombinations; i++) {
  var nextIncrease = true;
  for (var j = 0; j < indexes.length; j++) {
    if (nextIncrease || indexes[j] == -1) {
      indexes[j] >= 0 &&
        (allLayers[allowedPrefixes[j]][indexes[j]].visible = false);
      indexes[j]++;
      if (indexes[j] === allLayers[allowedPrefixes[j]].length) {
        nextIncrease = true;
        indexes[j] = 0;
      } else {
        nextIncrease = false;
      }
      allLayers[allowedPrefixes[j]][indexes[j]].visible = true;
    }
  }
  i > lastId && exportToPNG(doc, exportFolder + "/" + i + ".jpg");
}

/*
 for (var m = 0; m < 10 || allLayers.length; m++){
     allLayers[m].visible = true; 
    
 } 
 */
