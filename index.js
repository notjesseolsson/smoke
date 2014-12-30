$(function() {
  var canvas = $('canvas')[0]
  var things = []
  var rgbColor = 'rgb(0,0,0)'

  var cursor = new Image()
  cursor.src = 'cursor.webp'
  var colorWheel = new Image()

  $(colorWheel).on('load', function() {
    colorWheelContext = $('.color-wheel')[0].getContext('2d')
    colorWheelContext.drawImage(colorWheel, 0, 0, 150, 150)

    colorWheelContext.globalAlpha = .15
    colorWheelContext.fillStyle = '#000000'
    colorWheelContext.fillRect(0, 0, 150, 150)
    colorWheelContext.globalAlpha = 1

    $('.color-wheel').on('click', getRgb)
    $('.color-wheel').on('mousemove', function(e) {
      if (mousedown) {
        getRgb(e)
      }
    })

    function getRgb(e) {
      var x = e.pageX - $('.color-wheel').offset().left
      var y = e.pageY - $('.color-wheel').offset().top
      var rgb = colorWheelContext.getImageData(x, y, 1, 1).data
      rgbColor = 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')'
      $('.color').css('background-color', rgbColor)
    }
  })

  colorWheel.src = 'color-wheel.webp'
  var b2w = new Image()

  $(b2w).on('load', function() {
    var b2wContext = $('.b2w')[0].getContext('2d')
    b2wContext.drawImage(b2w, 0, 0)

    $('.b2w').on('click', darken)
    $('.b2w').on('mousemove', function(e) {
      if (mousedown) {
        darken(e)
      }
    })

    function darken(e) {
      var x = e.pageX - $('.b2w').offset().left
      var y = e.pageY - $('.b2w').offset().top
      var rgb = b2wContext.getImageData(x, y, 1, 1).data
      colorWheelContext.drawImage(colorWheel, 0, 0, 150, 150)
      var opacity = 1 - (rgb[0] / 255)
      colorWheelContext.globalAlpha = opacity
      colorWheelContext.fillStyle = '#000000'
      colorWheelContext.fillRect(0, 0, 150, 150)
      colorWheelContext.globalAlpha = 1
    }
  })

  b2w.src = 'b2w.webp'

  var mousePosition = false
  var mouseCanvasPosition = false
  var canvasLocation = {x: 0, y: 0}
  var mouseDown = false



  $(window).on('resize', function() {
    canvas.width = innerWidth
    canvas.height = innerHeight
  })

  $(window).trigger('resize')
  var ctx = canvas.getContext('2d')
  draw()

  function draw() {
    requestAnimationFrame(draw)
    inputs()
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    drawThings()
    drawCursor()
  }

  $('canvas').on('mousemove', move)

  function move(e) {
    mousePosition = [e.clientX, e.clientY]
    mouseCanvasPosition = applyNegativeCanvasTranslate(mousePosition)
    if (key.isPressed('a')) {
      addThing()
    }
    else if (key.isPressed('d')) {
      deleteThing()
    }
  }

  $('canvas').on('mouseleave', function() {
    mousePosition = false
  })

  key('a', addThing)
  key('d', deleteThing)

  function drawThings() {
    for (var i in things) {
      var thing = things[i]
      var drawPoints = [
        thing[0] * 20,
        thing[1] * 20,
      ]

      var points = applyCanvasTranslate(drawPoints)

      // dont draw if not on screen
      var thingPoint = [thing[0] * 20, thing[1] * 20]

      var screenBox = [
        -canvasLocation.x -20,
        -canvasLocation.y -20,
        -canvasLocation.x + innerWidth,
        -canvasLocation.y + innerHeight
      ]

      if (pointInBox(thingPoint, screenBox)) {
        ctx.fillStyle = rgbColor
        ctx.fillRect(points[0], points[1], 20, 20)
      }

    }
  }

  function addThing() {
    var boxMouse = new BoxMouse()
    things[boxMouse.x + ',' + boxMouse.y] = [boxMouse.x, boxMouse.y]
  }

  function deleteThing() {
    var boxMouse = new BoxMouse()
    delete things[boxMouse.x + ',' + boxMouse.y]
  }

  function drawCursor() {
    if (mousePosition) {
      ctx.drawImage(cursor, mousePosition[0] - 8, mousePosition[1] - 8)
    }
  }

  function BoxMouse() {
    this.x = Math.floor(mouseCanvasPosition[0] / 20)
    this.y = Math.floor(mouseCanvasPosition[1] / 20)
  }

  function inputs() {
    if (key.isPressed('right')) {
      moveCanvas('right')
    }
    if (key.isPressed('left')) {
      moveCanvas('left')
    }
    if (key.isPressed('up')) {
      moveCanvas('up')
    }
    if (key.isPressed('down')) {
      moveCanvas('down')
    }
  }

  function moveCanvas(direction) {
    var step = 4
    if (direction == 'right') {
      canvasLocation.x -= step
      $('html').css('background-position', canvasLocation.x + 'px ' + canvasLocation.y + 'px')
    }
    if (direction == 'left') {
      canvasLocation.x += step
      $('html').css('background-position', canvasLocation.x + 'px ' + canvasLocation.y + 'px')
    }
    if (direction == 'up') {
      canvasLocation.y += step
      $('html').css('background-position', canvasLocation.x + 'px ' + canvasLocation.y + 'px')
    }
    if (direction == 'down') {
      canvasLocation.y -= step
      $('html').css('background-position', canvasLocation.x + 'px ' + canvasLocation.y + 'px')
    }
    move({clientX: mousePosition[0], clientY: mousePosition[1]})
  }

  function applyCanvasTranslate(array) {
    return [
      array[0] + canvasLocation.x,
      array[1] + canvasLocation.y
    ]
  }

  function applyNegativeCanvasTranslate(array) {
    return [
      array[0] - canvasLocation.x,
      array[1] - canvasLocation.y
    ]
  }

  $('.colorClicker').on('click', function() {
    $('.colorWindow').toggleClass('hide')
  })

  function pointInBox(point, box) {
    var pointX = point[0]
    var pointY = point[1]
    var boxX1 = box[0]
    var boxY1 = box[1]
    var boxX2 = box[2]
    var boxY2 = box[3]

    if (pointX > boxX1 && pointX < boxX2 && pointY > boxY1 && pointY < boxY2) {
      return true
    }
    else {
      return false
    }

  }

  $(window).on('mousedown', function() {
    mousedown = true
  })
  $(window).on('mouseup', function() {
    mousedown = false
  })
})
