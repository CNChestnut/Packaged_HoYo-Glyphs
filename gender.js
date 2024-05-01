const fs = require('fs');
const path = require('path');

// 遍历目录并构建数据结构
function traverseFontsDir(dirPath, visualize = true) {
    const fontsData = [];
    const fontCounts = {};

    function traverse(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                traverse(filePath);
            } else {
                const relativePath = path.relative('./fonts', filePath);
                const [game, fontFamily, fontFile] = relativePath.split(path.sep);
                const fileType = path.extname(fontFile).slice(1);
                
                // 构建字体数据结构
                const fontData = {
                    name: fontFamily,
                    game: game,
                    files: [
                        {
                            file_path: relativePath,
                            type: fileType
                        }
                    ]
                };

                // 更新字体统计
                fontCounts[game] = fontCounts[game] ? fontCounts[game] + 1 : 1;

                // 添加字体数据到字体数组
                const existingFont = fontsData.find(font => font.name === fontFamily && font.game === game);
                if (existingFont) {
                    existingFont.files.push({
                        file_path: relativePath,
                        type: fileType
                    });
                } else {
                    fontsData.push(fontData);
                }
            }
        });
    }

    traverse(dirPath);

    // 可视化字体树形结构
    if (visualize) {
        console.log('字体树形结构：');
        console.log('📚 Fonts');
        fontsData.forEach(font => {
            console.log(`  |-📁 ${font.game}/${font.name}`);
            font.files.forEach(file => {
                console.log(`      |-📄 ${file.file_path}`);
            });
        });

        console.log('\n字体统计 Font Counter ：');
        Object.entries(fontCounts).forEach(([game, count]) => {
            console.log(`🎮 ${game}: ${count} 个字体 Fonts`);
        });
    }

    return fontsData;
}

// 生成 info.json 文件
function generateJSONFile(data) {
	result = {
		author : 'github.com/CNChestnut',
        file_raw_repo : 'https://github.com/SpeedyOrc-C/HoYo-Glyphs/',
		font_file_update_time : '2024-5-1',
		info_file_build_time : new Date().toString(),
		data
	}
    fs.writeFileSync('info.json', JSON.stringify(result, null, 2));
    console.log('info.json 文件已生成');
}

// 主函数
function main() {
    const fontsDir = './fonts';
    const visualize = true;

    const fontsData = traverseFontsDir(fontsDir, visualize);
    generateJSONFile(fontsData);
}

// 运行主函数
main();
