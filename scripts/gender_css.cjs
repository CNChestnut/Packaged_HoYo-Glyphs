const fs = require("fs");

json = fs.readFileSync(__dirname + "\\..\\info.json");

let info = JSON.parse(json).data;

let css = ``;
let map = [];
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
    map.push({
      font_name: file.font_name,
      font_family_name: font.font_family_name,
      font_css_tag_name: `hoyo-glyphs-${file.font_name}`
    });
    // Delete the filetype value
    // https://github.com/SpeedyOrc-C/HoYo-Glyphs/issues/18
  }
}

fs.writeFileSync(__dirname + "/../index.css", css);
fs.writeFileSync(__dirname + "/../map.json", JSON.stringify(map, null, 4));