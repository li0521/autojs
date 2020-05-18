// // 等待启动无障碍服务
// auto.waitFor()
const deviceWidth = device.width
const deviceHeight = device.height
// // 请求截图权限
// if(!requestScreenCapture()){
//   toast('请求截图失败')
//   exit()
// }
// if(launchApp('微信')) {
//   sleep(3000)
//   swipe(width / 2, height / 2 - 500, width / 2, height / 2 + 500, 500)
//   click('跳一跳')
//   sleep(3000)
// }
const xdiffStartPoint = {
  x: 500,
  y: 900,
}

const ydiffStartPoint = {
  x: deviceWidth - 1,
  y: 900,
}

function getPointX(img, point, width, height, unit) {
  var x, y
  for(y = point.y; y < point.y + height; y += unit) {
    for(x = point.x; x < point.x + width; x += unit) {
      var color1 = images.pixel(img, x, y)
      var x2 = x + unit >= deviceWidth ? deviceWidth - 1 : x + unit
      var color2 = images.pixel(img, x2, y)

      if(!colors.isSimilar(color1, color2, 1)) {
        if(unit > 1) {
          var point = {
            x: x,
            y: y - unit
          }
          var nextWidth = point.x + unit * 2 > deviceWidth ? deviceWidth - point.x : unit * 2
          var nextHeight = point.y + unit * 2 > deviceHeight ? deviceHeight - point.y : unit * 2

          return getPointX(img, point, nextWidth, nextHeight, unit / 10)
        }
        return x + unit
      }
    }
  }
}

function getPointY(img, point, width, height, unit) {
  var x, y
  for(x = point.x; x > point.x - width; x -= unit) {
    for(y = point.y; y < point.y + height; y += unit) {
      var color1 = images.pixel(img, x, y)
      var y2 = y + unit >= deviceHeight ? deviceHeight - 1 : y + unit
      var color2 = images.pixel(img, x, y2)

      if(!colors.isSimilar(color1, color2, 1)) {
        if(unit > 1) {
          var point = {
            x: x + unit > deviceWidth ? deviceWidth - 1 : x + unit,
            y: y,
          }
          var nextWidth = point.x - unit * 2 < 0 ? point.x : unit * 2
          var nextHeight = point.y + unit * 2 > deviceHeight ? deviceHeight - point.y : unit * 2
          
          return getPointY(img, point, nextWidth, nextHeight, unit / 10)
        }
        return y + unit
      }
    }
  }
}

function getPoint(img) {
  var point = {
    x: getPointX(img, xdiffStartPoint, deviceWidth - xdiffStartPoint.x, deviceHeight - xdiffStartPoint.y, 100),
    y: getPointY(img, ydiffStartPoint, deviceWidth, deviceHeight - ydiffStartPoint.y, 100),
  }
  
  return point 
}

function start() {
  auto.waitFor()

  if(!requestScreenCapture()){
    toast('请求截图失败')
    exit()
  }

  console.show()
  sleep(1000)
  var img = captureScreen()
  var point = getPoint(img)
  console.log(point)
  var chessImg = images.read('/sdcard/1.png')
  if(chessImg) {
    console.log(chessImg.getWidth(), chessImg.getHeight())
    var chessPoint = images.findImage(img, chessImg)
    if(chessPoint) {
      console.log(chessPoint)
    }

    chessImg.recycle()
  }
}

start()

