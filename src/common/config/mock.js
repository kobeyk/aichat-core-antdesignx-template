import imageBase64 from "./imgData";
import { LLMUtil } from "aichat-core";
const mockHistoryMessages = {
  "default-0": [
    {
      id: 1001,
      timed: Date.now(),
      role: "user",
      choices: [
        {
          content: "今天苏州天气如何？",
          typing: true,
          loading: false
        }
      ]
    },
    {
      id: 1002,
      timed: Date.now() + 5000,
      choices: [
        {
          index: 1, // 第一轮对话，模拟带tools的
          thinking: 2,   // -1 不带推理，1：思考中 2：思考结束
          reasoning_content: "我们有一个工具叫做tool_MC-get_weather，用于查询即时天气。根据描述，我们需要传入一个参数loc，即城市的英文名称。",
          content: "我将使用天气查询工具来获取苏州今天的即时天气信息。",
          // content: "```java\n int a = 1+1;\n",
          tools: [
            {
              id: "1-001",
              index: 0,
              name: "get_weather",
              arguments: '{"loc":"suzhou"}',
              content: '{"coord": {"lon": 116.3972, "lat": 39.9075}, "weather": [{"id": 804, "main": "Clouds", "description": "\u6c14\u6e29\u6bd4\u8f83\u51c9\u723d\uff0c\u9002\u5408\u51fa\u884c\uff01", "icon": "04d"}], "base": "stations", "main": {"temp": 23.94, "feels_like": 23.64, "temp_min": 23.94, "temp_max": 23.94, "pressure": 1008, "humidity": 48, "sea_level": 1008, "grnd_level": 1002}, "visibility": 10000, "wind": {"speed": 3.13, "deg": 170, "gust": 3.29}, "clouds": {"all": 100}, "dt": 1748766063, "sys": {"type": 1, "id": 9609, "country": "CN", "sunrise": 1748724495, "sunset": 1748777790}, "timezone": 28800, "id": 1816670, "name": "Suzhou", "cod": 200}'
            },
            {
              id: "1-002",
              index: 1,
              name: "get_weather",
              arguments: '{"loc":"beijing"}',
              content: '{"coord": {"lon": 116.3972, "lat": 39.9075}, "weather": [{"id": 804, "main": "Clouds", "description": "\u6c14\u6e29\u6bd4\u8f83\u51c9\u723d\uff0c\u9002\u5408\u51fa\u884c\uff01", "icon": "04d"}], "base": "stations", "main": {"temp": 23.94, "feels_like": 23.64, "temp_min": 23.94, "temp_max": 23.94, "pressure": 1008, "humidity": 48, "sea_level": 1008, "grnd_level": 1002}, "visibility": 10000, "wind": {"speed": 3.13, "deg": 170, "gust": 3.29}, "clouds": {"all": 100}, "dt": 1748766063, "sys": {"type": 1, "id": 9609, "country": "CN", "sunrise": 1748724495, "sunset": 1748777790}, "timezone": 28800, "id": 1816670, "name": "Suzhou", "cod": 200}'
            }
          ]
        },
        {
          index: 2,// 第二轮对话，基于第一轮对话工具调用的结果进行总结
          thinking: 2,   // -1 不带推理，1：思考中 2：思考结束
          reasoning_content: "我们调用了tool_get_weather工具查询苏州的天气，返回的结果是一个JSON字符串，其中包含了天气信息。",
          content: "根据天气查询结果，苏州今天的天气情况如下：晴天，23.64°，北京今天天气情况如下：阴天，25.4°",
        }
      ],
      role: "assistant",
      typing: true,
      loading: false
    },
    {
      id: 1003,
      timed: Date.now(),
      role: "user",
      choices: [
        {
          content: [
            {
              type: "text",
              text: "请帮我描述下这些图片分别表示什么内容？"
            },
            {
              type: "image_url",
              image_url: { url: LLMUtil.getBase64Data(imageBase64, "image/png") }
            },
            {
              type: "image_url",
              image_url: { url: LLMUtil.getBase64Data(imageBase64,"image/png") }
            },
            {
              type: "image_url",
              image_url: { url: LLMUtil.getBase64Data(imageBase64, "image/png") }
            },
            {
              type: "image_url",
              image_url: { url: LLMUtil.getBase64Data(imageBase64,"image/png") }
            },
            {
              type: "image_url",
              image_url: { url: LLMUtil.getBase64Data(imageBase64, "image/png") }
            },
            {
              type: "image_url",
              image_url: { url: LLMUtil.getBase64Data(imageBase64,"image/png") }
            }
          ],
          typing: true,
          loading: false
        }
      ]
    },
  ]
}
const mockHistoryMessages1 = {
  "default-0": [
    {
      id: 1751372884070,
      timed: 1751372887,
      model: "deepseek-r1-250528",
      role: "assistant",
      typing: true,
      loading: false,
      choices: [
        {
          index: 1,
          content: "\n# 五子棋小游戏实现\n\n我将为您创建一个完整的五子棋游戏，使用HTML、CSS和JavaScript实现。这个游戏包含完整的游戏逻辑、胜负判断和美观的界面设计。\n\n## 设计思路\n- 创建15×15的棋盘网格\n- 实现黑白棋子轮流落子功能\n- 添加胜负判断逻辑（水平、垂直、对角线五子连珠）\n- 设计简洁美观的界面\n- 添加游戏状态显示和重新开始功能\n\n下面是完整的实现代码：\n\n```html\n<!DOCTYPE html>\n<html lang=\"zh-CN\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>五子棋小游戏</title>\n    <style>\n        * {\n            margin: 0;\n            padding: 0;\n            box-sizing: border-box;\n        }\n        \n        body {\n            font-family: 'Microsoft YaHei', sans-serif;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            min-height: 100vh;\n            background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);\n            padding: 20px;\n        }\n        \n        .game-container {\n            background-color: rgba(255, 255, 255, 0.9);\n            border-radius: 15px;\n            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);\n            padding: 25px;\n            text-align: center;\n            max-width: 800px;\n            width: 100%;\n        }\n        \n        h1 {\n            color: #333;\n            margin-bottom: 15px;\n            font-size: 2.5rem;\n            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);\n        }\n        \n        .game-info {\n            margin: 20px 0;\n            font-size: 1.2rem;\n            color: #444;\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            padding: 0 10px;\n        }\n        \n        .status {\n            font-weight: bold;\n            font-size: 1.3rem;\n            padding: 8px 15px;\n            border-radius: 20px;\n            background-color: #f0f0f0;\n            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);\n        }\n        \n        .black-turn {\n            color: #000;\n        }\n        \n        .white-turn {\n            color: #555;\n        }\n        \n        .board-container {\n            display: flex;\n            justify-content: center;\n            margin: 20px 0;\n        }\n        \n        .board {\n            display: grid;\n            grid-template-columns: repeat(15, 30px);\n            grid-template-rows: repeat(15, 30px);\n            background-color: #e8c48a;\n            border: 2px solid #8b4513;\n            position: relative;\n            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);\n        }\n        \n        .cell {\n            width: 30px;\n            height: 30px;\n            position: relative;\n            cursor: pointer;\n        }\n        \n        .cell::before, .cell::after {\n            content: '';\n            position: absolute;\n            background-color: #8b4513;\n        }\n        \n        .cell::before {\n            width: 100%;\n            height: 1px;\n            top: 50%;\n            left: 0;\n            transform: translateY(-50%);\n        }\n        \n        .cell::after {\n            width: 1px;\n            height: 100%;\n            left: 50%;\n            top: 0;\n            transform: translateX(-50%);\n        }\n        \n        .stone {\n            position: absolute;\n            width: 26px;\n            height: 26px;\n            border-radius: 50%;\n            top: 50%;\n            left: 50%;\n            transform: translate(-50%, -50%);\n            z-index: 10;\n            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);\n        }\n        \n        .black {\n            background: radial-gradient(circle at 30% 30%, #555, #000);\n        }\n        \n        .white {\n            background: radial-gradient(circle at 30% 30%, #fff, #ddd);\n            border: 1px solid #aaa;\n        }\n        \n        .controls {\n            margin-top: 20px;\n        }\n        \n        button {\n            background: linear-gradient(to bottom, #4a7b9d, #2c3e50);\n            color: white;\n            border: none;\n            padding: 12px 25px;\n            font-size: 1.1rem;\n            border-radius: 50px;\n            cursor: pointer;\n            transition: all 0.3s;\n            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);\n        }\n        \n        button:hover {\n            transform: translateY(-3px);\n            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);\n            background: linear-gradient(to bottom, #5a8bad, #3c4e60);\n        }\n        \n        button:active {\n            transform: translateY(1px);\n        }\n        \n        .win-message {\n            position: fixed;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background-color: rgba(0, 0, 0, 0.8);\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            z-index: 100;\n            opacity: 0;\n            pointer-events: none;\n            transition: opacity 0.5s;\n        }\n        \n        .win-message.show {\n            opacity: 1;\n            pointer-events: all;\n        }\n        \n        .message-content {\n            background: linear-gradient(135deg, #ffd700, #ffa500);\n            padding: 40px;\n            border-radius: 15px;\n            text-align: center;\n            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);\n            transform: scale(0.8);\n            transition: transform 0.5s;\n        }\n        \n        .win-message.show .message-content {\n            transform: scale(1);\n        }\n        \n        .message-content h2 {\n            font-size: 2.5rem;\n            margin-bottom: 20px;\n            color: #8b0000;\n        }\n        \n        .message-content button {\n            margin-top: 20px;\n            background: linear-gradient(to bottom, #8b0000, #660000);\n        }\n        \n        @media (max-width: 600px) {\n            .board {\n                grid-template-columns: repeat(15, 20px);\n                grid-template-rows: repeat(15, 20px);\n            }\n            \n            .cell {\n                width: 20px;\n                height: 20px;\n            }\n            \n            .stone {\n                width: 18px;\n                height: 18px;\n            }\n            \n            h1 {\n                font-size: 2rem;\n            }\n        }\n    </style>\n</head>\n<body>\n    <div class=\"game-container\">\n        <h1>五子棋小游戏</h1>\n        \n        <div class=\"game-info\">\n            <div class=\"player-info\">\n                <div>黑棋玩家: ●</div>\n                <div>白棋玩家: ○</div>\n            </div>\n            <div class=\"status black-turn\">当前回合: 黑棋</div>\n        </div>\n        \n        <div class=\"board-container\">\n            <div class=\"board\" id=\"board\"></div>\n        </div>\n        \n        <div class=\"controls\">\n            <button id=\"restart\">重新开始游戏</button>\n        </div>\n    </div>\n    \n    <div class=\"win-message\" id=\"winMessage\">\n        <div class=\"message-content\">\n            <h2 id=\"winnerText\">黑棋获胜!</h2>\n            <button id=\"playAgain\">再玩一局</button>\n        </div>\n    </div>\n\n    <script>\n        document.addEventListener('DOMContentLoaded', () => {\n            const board = document.getElementById('board');\n            const status = document.querySelector('.status');\n            const restartBtn = document.getElementById('restart');\n            const winMessage = document.getElementById('winMessage');\n            const winnerText = document.getElementById('winnerText');\n            const playAgainBtn = document.getElementById('playAgain');\n            \n            // 游戏状态\n            let currentPlayer = 'black'; // 'black' 或 'white'\n            let gameBoard = Array(15).fill().map(() => Array(15).fill(null));\n            let gameOver = false;\n            \n            // 初始化棋盘\n            function initializeBoard() {\n                board.innerHTML = '';\n                for (let row = 0; row < 15; row++) {\n                    for (let col = 0; col < 15; col++) {\n                        const cell = document.createElement('div');\n                        cell.classList.add('cell');\n                        cell.dataset.row = row;\n                        cell.dataset.col = col;\n                        \n                        cell.addEventListener('click', () => placeStone(row, col));\n                        board.appendChild(cell);\n                    }\n                }\n            }\n            \n            // 放置棋子\n            function placeStone(row, col) {\n                if (gameOver || gameBoard[row][col] !== null) return;\n                \n                // 更新游戏状态\n                gameBoard[row][col] = currentPlayer;\n                \n                // 在棋盘上显示棋子\n                const cell = document.querySelector(`.cell[data-row=\"${row}\"][data-col=\"${col}\"]`);\n                const stone = document.createElement('div');\n                stone.classList.add('stone', currentPlayer);\n                cell.appendChild(stone);\n                \n                // 检查是否获胜\n                if (checkWin(row, col)) {\n                    gameOver = true;\n                    winnerText.textContent = `${currentPlayer === 'black' ? '黑棋' : '白棋'}获胜!`;\n                    winMessage.classList.add('show');\n                    return;\n                }\n                \n                // 检查是否平局\n                if (checkDraw()) {\n                    gameOver = true;\n                    winnerText.textContent = '平局!';\n                    winMessage.classList.add('show');\n                    return;\n                }\n                \n                // 切换玩家\n                currentPlayer = currentPlayer === 'black' ? 'white' : 'black';\n                updateStatus();\n            }\n            \n            // 检查是否获胜\n            function checkWin(row, col) {\n                const player = gameBoard[row][col];\n                const directions = [\n                    [0, 1],  // 水平\n                    [1, 0],  // 垂直\n                    [1, 1],  // 对角线 /\n                    [1, -1]  // 对角线 \\\n                ];\n                \n                for (const [dx, dy] of directions) {\n                    let count = 1; // 当前位置已经有一个棋子\n                    \n                    // 正向检查\n                    for (let i = 1; i <= 4; i++) {\n                        const newRow = row + dx * i;\n                        const newCol = col + dy * i;\n                        \n                        if (newRow >= 0 && newRow < 15 && newCol >= 0 && newCol < 15 && \n                            gameBoard[newRow][newCol] === player) {\n                            count++;\n                        } else {\n                            break;\n                        }\n                    }\n                    \n                    // 反向检查\n                    for (let i = 1; i <= 4; i++) {\n                        const newRow = row - dx * i;\n                        const newCol = col - dy * i;\n                        \n                        if (newRow >= 0 && newRow < 15 && newCol >= 0 && newCol < 15 && \n                            gameBoard[newRow][newCol] === player) {\n                            count++;\n                        } else {\n                            break;\n                        }\n                    }\n                    \n                    if (count >= 5) return true;\n                }\n                \n                return false;\n            }\n            \n            // 检查是否平局\n            function checkDraw() {\n                for (let row = 0; row < 15; row++) {\n                    for (let col = 0; col < 15; col++) {\n                        if (gameBoard[row][col] === null) {\n                            return false;\n                        }\n                    }\n                }\n                return true;\n            }\n            \n            // 更新状态显示\n            function updateStatus() {\n                status.textContent = `当前回合: ${currentPlayer === 'black' ? '黑棋' : '白棋'}`;\n                status.className = 'status ' + (currentPlayer === 'black' ? 'black-turn' : 'white-turn');\n            }\n            \n            // 重置游戏\n            function resetGame() {\n                gameBoard = Array(15).fill().map(() => Array(15).fill(null));\n                currentPlayer = 'black';\n                gameOver = false;\n                winMessage.classList.remove('show');\n                initializeBoard();\n                updateStatus();\n            }\n            \n            // 事件监听\n            restartBtn.addEventListener('click', resetGame);\n            playAgainBtn.addEventListener('click', resetGame);\n            \n            // 初始化游戏\n            initializeBoard();\n            updateStatus();\n        });\n    </script>\n</body>\n</html>\n```\n\n## 游戏功能说明\n\n1. **游戏界面**：\n   - 15×15的棋盘\n   - 游戏状态显示（当前轮到哪位玩家）\n   - 重新开始按钮\n\n2. **游戏规则**：\n   - 黑白双方轮流落子\n   - 先形成五子连珠（水平、垂直或对角线）的一方获胜\n   - 棋盘填满且无五子连珠时为平局\n\n3. **操作方法**：\n   - 点击棋盘上的交叉点放置棋子\n   - 点击\"重新开始游戏\"按钮重置游戏\n   - 游戏结束后点击\"再玩一局\"重新开始\n\n4. **视觉效果**：\n   - 木质纹理棋盘\n   - 具有立体感的棋子\n   - 渐变背景和阴影效果\n   - 响应式设计（适配不同屏幕尺寸）\n\n## 使用说明\n\n1. 将上述代码复制到一个文本文件中\n2. 将文件保存为HTML格式（例如：gobang.html）\n3. 用浏览器打开该文件即可开始游戏\n\n这个五子棋游戏包含了完整的游戏逻辑和美观的界面设计，您可以直接使用它来玩五子棋游戏！[点击查看](http://10.17.17.173:8866/gdos-iis-server/sample/data/preview?path=WjpcQUlPX0lJU19TYW1wbGVEYXRhXGlpc19zYW1wbGVfZGF0YXNcc2FtcGxlXDBcMjAyNV8wOF8wOFwxNzU0NjIyOTc2MTIwXDE3NTQ2MjI5OTIxMTJcMC44beWPmOWMluajgOa1i%2Bagt%2BacrOaVsOaNru%2B8iOW3peefv%2BeUqOWcsC3lsYXmsJHlnLDvvIlcMDAwMDAwMDJcMV8wMDAwMDBfMi50aWY%3D)", "thinking": 2, "reasoning_content": "由于用户要求用HTTP+CSS写一个五子棋游戏，但这里我们只能通过代码生成来提供。然而，请注意，我们当前的环境是一个文本交互环境，无法直接运行HTTP服务。但是，我可以提供一个使用HTML、CSS和JavaScript（用于交互逻辑）的五子棋游戏代码。由于用户要求用HTTP+CSS，我理解为使用网页技术（HTML+CSS+JS）来实现。\n\n 我们将创建一个简单的五子棋游戏，包括：\n 1. 一个15x15的棋盘。\n 2. 黑白双方轮流下棋。\n 3. 判断胜负（五子连珠）。\n\n 由于CSS用于样式，HTML用于结构，JavaScript用于逻辑。\n\n 注意：由于这里不能运行HTTP服务，我将提供完整的HTML代码，用户可以在本地保存为.html文件并用浏览器打开运行。\n\n 代码结构如下：\n - 棋盘使用表格（table）实现，每个单元格（td）代表一个交叉点。\n - 使用CSS设置棋盘的背景（木质）、线条以及棋子的样式（圆形，黑色和白色）。\n - 使用JavaScript处理点击事件，在点击的单元格中放置棋子（用div表示），并切换当前玩家，同时判断是否获胜。\n\n 由于五子棋的胜负判断需要检查水平、垂直、两个对角线方向是否有连续五个同色棋子，我们将编写一个函数来检查。\n\n 由于代码较长，我将逐步构建：\n\n 步骤：\n 1. 创建HTML结构，包括棋盘表格。\n 2. 使用CSS美化棋盘和棋子。\n 3. 使用JavaScript添加事件监听，实现下棋和胜负判断。\n\n 注意：为了简化，我们不考虑悔棋、重新开始等功能，但会包含一个简单的胜负提示。\n\n 以下是完整的代码：\n",
          "usage": {
            "completion_tokens": 3989,
            "prompt_tokens": 0,
            "total_tokens": 3989
          }
        }
      ]
    }
  ]

}
export {
  mockHistoryMessages,
}