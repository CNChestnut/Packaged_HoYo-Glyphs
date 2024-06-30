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
      font_css_tag_name: `hoyo-glyphs-${file.font_name}`,
    });
    // Delete the filetype value
    // https://github.com/SpeedyOrc-C/HoYo-Glyphs/issues/18
  }
}

fs.writeFileSync(__dirname + "/../index.css", css);

//能否打开 ../data/description.json 并读取其中的内容？
let description = {};
if (fs.existsSync(__dirname + "/../data/description.json")) {
  try {
    const description_json = fs.readFileSync(
      __dirname + "/../data/description.json"
    );
    description = JSON.parse(description_json);
  } catch (e) {
    console.log(e);
  }
}

// 生成 map.json
let map_next = {};
map.forEach((font) => {
  const fontName = font.font_name.replace(/-\w+$/, "");
  if (!map_next[fontName]) {
    map_next[fontName] = {
      font_name: fontName,
      font_family_name: font.font_family_name,
      types: {},
    };
  }
  if (description[fontName]) {
    map_next[fontName].description = description[fontName];
  } else {
    map_next[fontName].description = "";
    description[fontName] = {
      zh: "",
      en: "",
    };
  }
  const fontType = font.font_name.split("-").pop();
  map_next[fontName].types[fontType] = font.font_css_tag_name;
});
map_next = Object.values(map_next);

fs.writeFileSync(
  __dirname + "/../data/description.json",
  JSON.stringify(description, null, 4)
);
fs.writeFileSync(__dirname + "/../map.json", JSON.stringify(map_next, null, 4));
