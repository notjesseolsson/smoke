$(function() {
  var canvas = $('canvas')[0]
  var things = []
  var cursor = new Image()
  cursor.src = 'cursor.png'
  var mousePosition = false
  var mouseCanvasPosition = false
  canvasLocation = {x: 0, y: 0}

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

      //if (drawPoints[0] < innerWidth && drawPoints[1] < innerHeight) {
        ctx.fillStyle = '#000000'
        ctx.fillRect(points[0], points[1], 20, 20)
      //}

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
    var step = 2
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

  function log(msg) {
    $('.log').html(msg)
  }
})
