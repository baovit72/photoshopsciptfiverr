/*********************************************************SETUP*************************************************************************/
//Step 1: You need to set layer prefixes that will be grouped in combinations.
const allowedPrefixes = ["Hand","Jacket"];
//Step 2: You need to set the export folder.
const rawExportFolder = "C:/NiRIFE Studio/Fiverr/PTS AUTOMATION 1ST/output";

/********************************************************HELPERS**********************************************************************/
function quick_export_png(path)
    {
    try
        {
        var d = new ActionDescriptor();

        var r = new ActionReference();

        r.putEnumerated(stringIDToTypeID("layer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));

        d.putReference(stringIDToTypeID("null"), r);

        d.putString(stringIDToTypeID("fileType"), "png");

        d.putInteger(stringIDToTypeID("quality"), 32);

        d.putInteger(stringIDToTypeID("metadata"), 0);

        d.putString(stringIDToTypeID("destFolder"), path);

        d.putBoolean(stringIDToTypeID("sRGB"), true);

        d.putBoolean(stringIDToTypeID("openWindow"), false);

        executeAction(stringIDToTypeID("exportDocumentAsFileTypePressed"), d, DialogModes.NO);
        }
    catch (e) { throw(e); }
}

function convertFilePath(filePath){
    if(filePath.indexOf("~") !=-1) return filePath;
    return "\/"  + filePath.replace(/\\/g,"\/").replace(/:/g,"")
 }

function TimeIt() {
  this.startTime = new Date();
  this.endTime = new Date();
  this.start = function () {
        this.startTime = new Date();
    }
  this.stop = function () {
        this.endTime = new Date();
    }
  this.getTime = function () {
        return (this.endTime.getTime() - this.startTime.getTime()) / 1000;
    }
    this.showTime = function () {
            alert((this.endTime.getTime() - this.startTime.getTime()) / 1000);
        }
  this.getElapsed = function () {
        this.endTime = new Date(); return this.getTime();
    }
}

function collectAllLayers (doc, allLayers){
    for (var m = 0; m < doc.layers.length; m++){
        var theLayer = doc.layers[m];
        if (theLayer.typename === "ArtLayer"){
            const layerName = theLayer.name;
            const groupName = allowedPrefixes.find(p=>layerName.indexOf(p) === 0);
            if(groupName){
                    !allLayers[groupName] && (allLayers[groupName] = [])
                    theLayer.visible = false;
                    allLayers[groupName].push(theLayer);
              }
        }else{
            theLayer.visible = true;
            collectAllLayers(theLayer, allLayers);
        }
    }
    return allLayers;
}

function exportToPNG(doc, fileDir){ 
    var jpgOptions = new JPEGSaveOptions();
    jpgOptions.quality = 12;
    doc.saveAs(new File(fileDir), jpgOptions, true, Extension.LOWERCASE);
    /*var options = new ExportOptionsSaveForWeb()
    options.format = SaveDocumentType.JPEG;
    options.PNG8 = false;
    options.quality = 20;
    options.optimized  = true;
    var saveFile = new File(fileDir);
    doc.exportDocument(saveFile, ExportType.SAVEFORWEB, options)*/
 }

/*******************************************************MAIN*********************************************************************/

var doc = app.activeDocument;
var totalTime = new TimeIt(); 
const alllLayers = {};
var allLayers = collectAllLayers(doc,alllLayers); 
var exportFolder  = rawExportFolder;

$.writeln(JSON.stringify(allLayers));
var folderObj = new Folder(exportFolder);
if (!folderObj.exists)
    folderObj.create();
 

/*
 for (var m = 0; m < 10 || allLayers.length; m++){
     allLayers[m].visible = true; 
     exportToPNG(doc, exportFolder + "/" + m + ".jpg");
 } 
 */