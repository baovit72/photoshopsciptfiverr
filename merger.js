const mergeImages = require("merge-images");
const { Canvas, Image } = require("canvas");
mergeImages(
  new Array(12).fill(0).map((v, i) => "example/" + (i + 1) + ".gif"),
  { Canvas: Canvas, Image: Image }
).then((b64) => console.log("done"));
