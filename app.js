(() => {
  'use strict';

  const BALL_SIZE = 15;
  const BLOCKS_HEIGHT = 6;
  const BLOCKS_WIDTH = 9;

  const canvas = document.getElementById('canvas');
  const count = document.getElementById('count');
  const ctx = canvas.getContext('2d');
  var counter = 0;
  var raf;
  var bar;
  var blocks = [];

  canvas.addEventListener('mouseover', mraf);

  function mraf(e) {
    raf = window.requestAnimationFrame(draw);
  }

  canvas.addEventListener('mouseout', function (e) {
    window.cancelAnimationFrame(raf);
  });

  canvas.addEventListener('mousemove', function (e) {
    moveBar(e);
  })

  function moveBar(e) {
    const rect = canvas.getBoundingClientRect();
    const barHeight = 30;
    const barWidth = 150;
    const positionX = e.clientX - rect.left;
    if (bar) {
      blocks.splice(blocks.indexOf(bar), 1);
    }

    bar = newBlock(positionX - barWidth / 2, canvas.height * 0.9, barHeight, barWidth, false);
    blocks.push(bar);
  }

  function newBall( x , y ) {
    return {
      x: x + BALL_SIZE/2,
      y: y + BALL_SIZE/2,
      vx: 4,
      vy: 8,
      radius: BALL_SIZE/2,
      color: 'red',
      draw: function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
  }

  function newBlock(x, y ,  height , width , isTarget) {
    return {
      x: x,
      y: y,
      height: height,
      width : width ,
      color: 'green',
      isTarget: isTarget ,
      draw: function () {
        const offset = this.height * 0.05;
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + offset, this.y + offset , this.width - offset, this.height - offset);
      },
      isHit: function (bx, by) {
        return (by > this.y && by < this.y + this.height && bx > this.x && bx < this.x + this.width);
      }
    }
  }

  function draw() {
    const bx = ball.x + ball.vx;
    const by = ball.y + ball.vy;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //ボールの描画
    ball.draw();

    //操作バーの描画
    bar.draw();

    //ブロックとの当たり判定
    blocks.forEach(block => {
      if (block.isTarget) {
        block.draw();
      }

      var pb = block.y - (block.height / block.width) * block.x;
      var mb = block.y - ( -block.height / block.width) * (block.x+block.width);

      if (block.isHit(bx, by)) {
        //ブロックの対角線確認用
        // for (var i = block.x; i < block.x + block.width; i++) {
        //   newBall(i, (block.height / block.width) * i + pb).draw();
        //   newBall(i, -1* (block.height / block.width)*i  + mb).draw();
        // }

        if (ball.vx > 0) {
          //進行方向が右
          if (ball.vy > 0) {
            //進行方向が右下
            if (by < (block.height / block.width) * bx + pb  ) {
                //上辺
              ball.vy = -ball.vy;
            } else {
              ball.vx = -ball.vx;
            }
          } else {
            //進行方向が右上
            if (by < -1 * (block.height / block.width) * bx + mb ) {
              //左辺
              ball.vx = -ball.vx;
            } else {
              //下辺
              ball.vy = -ball.vy;
            }
          }
        } else {
          //進行方向が左
          if (ball.vy > 0) {
            //進行方向が左下
            if (by < -1 * (block.height / block.width) * bx + mb ) {
              //上辺
              ball.vy = -ball.vy ;
            } else {
              //右辺
              ball.vx = -ball.vx;
            }
          } else {
            //進行方向が左上
            if (by < (block.height / block.width) * bx + pb  ) {
              //右辺
              ball.vx = -ball.vx;
            } else {
              //下辺
              ball.vy = -ball.vy ;
            }
          }
        }

        //ボールが加速する
        ball.vx *= 1.00001;
        ball.vy *= 1.00001;

        if (block.isTarget) {

          //当たったブロックは消す
          blocks.splice(blocks.indexOf(block), 1);

          //ポイントを加算する
          counter++;
          count.innerText = counter;

          if (counter === BLOCKS_HEIGHT * BLOCKS_WIDTH) {
            alert('Congratulations!')
          }
        }
      }
    });

    if (by > canvas.height) {
      counter -= 5
      count.innerText = counter;
    }

    //境界との当たり判定
    if (by > canvas.height || by < 0) {
      ball.vy = -ball.vy ;
    }
    if (bx  > canvas.width || bx < 0) {
      ball.vx = -ball.vx;
    }

    //ボールの移動処理
    ball.x += ball.vx;
    ball.y += ball.vy;
    raf = window.requestAnimationFrame(draw);
  }

  function setBlocks() {
    var unitHeight = Math.floor(canvas.height / 5 / BLOCKS_HEIGHT);
    var unitWidth = Math.floor(canvas.width / BLOCKS_WIDTH);
    var unitX = 0;
    var unitY = 0;
    for (var height = 0; height < BLOCKS_HEIGHT; height++){
      for (var width = 0; width < BLOCKS_WIDTH; width++){
        blocks.push( newBlock(unitX, unitY, unitHeight, unitWidth , true ) );
        unitX += unitWidth;
      }
      unitX = 0;
      unitY += unitHeight;
    }
  }

  setBlocks();
  const ball = newBall(20, canvas.height * 0.7);
  ball.draw();

})();
