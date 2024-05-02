const fs = require("fs");

json = fs.readFileSync(__dirname + "\\..\\info.json");

let info = JSON.parse(json).data;

let css = ``;
let files = [];

for (let font of info) {
  for (let file of font.files) {
    css += `
@font-face {
    font-family: "${file.font_name}";
    src: url("./fonts/${file.file_path.replace("\\", "/").replace("\\", "/")}");
}
.hoyo-glyphs-${file.font_name} {
    font-family: "${file.font_name}";
}
`;
    // Delete the filetype value
    // https://github.com/SpeedyOrc-C/HoYo-Glyphs/issues/18
  }
}

fs.writeFileSync(__dirname + "/../index.css", css);