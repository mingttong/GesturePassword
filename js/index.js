/**
 * Created by lenovo on 2017/3/26.
 */

window.onload = function () {

    /*
     *****以下我们将“圆”成为“小球”，让其更加平易近人。*****
     */

    var gesturePassword = new GesturePassword();

};

var GesturePassword = function () {

    var _width = $(document.body).width(),
        _height = Math.round($(document.body).width() * 0.95);

    var _radius = 15,
        _gap = 88,
        _marginLeft = (_width - _gap * 2) / 2,
        _marginTop = (_height - _gap * 2) / 2
        ;

    var canvas = document.querySelector('#canvas');
    var $canvas = $(canvas); // jquery对象

    // 检测浏览器是否支持Canvas
    if (!canvas.getContext) {
        throw new Error('浏览器不支持Canvas');
    }

    canvas.width = _width;
    canvas.height = _height;

    var ctx = canvas.getContext('2d'),
        that = this,
        // 记录起始位置
        startX,
        startY,
        codeList = [], // 行径列表
        ballList = [], // 小球列表
        imgData = null // 缓存每次图片的数据
        ;

    /**
     * 初始化小球
     */
    this.initBalls = function () {

        var x, y, i,
            ball = null
            ;

        for (i = 0; i < 9; i += 1) {

            x = i % 3;
            y = Math.floor(i / 3);

            ball = new Ball(ctx, _marginLeft + x * _gap, _marginTop + y * _gap, _radius, i + 1);

            ballList.push(ball);

        }

        // 将初始化的图片缓存
        imgData = ctx.getImageData(0, 0, _width, _height);

    };

    /**
     * 刷新画布
     */
    this.refresh = function () {

        ctx.clearRect(0, 0, _width, _height);
        ctx.putImageData(imgData, 0, 0);

    };

    /**
     * 向Canvas添加事件
     */
    this.addEvent = function () {

        $canvas.on('touchmove', function (e) {

            var i,
                x = e.originalEvent.targetTouches[0].pageX,
                y = e.originalEvent.targetTouches[0].pageY,
                ball = null
                ;

            // 各个圆点向canvas添加委托

            for (i = 0; i < ballList.length; i += 1) {

                ball = ballList[i];

                // 经过小球事件

                // 经过这个点时，并且该点之前没有经过过
                if (ball.isInBall(x, y) && !ball.passed) {

                    // 先将两点连上线
                    that.refresh();
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(ball.x, ball.y); // 线画向圆心。
                    ctx.stroke(); // 画上线
                    ball.drawBall(); // 给小球着色

                    // 缓存下起点坐标，起点坐标就是圆心坐标
                    startX = ball.x;
                    startY = ball.y;

                    // 重置路径，起点设为圆心
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);

                    codeList.push(ball.code); // 数字存储
                    ball.passed = true;
                    imgData = ctx.getImageData(0, 0, _width, _height); // 缓存图像

                }

            }

            // 画线事件

            that.refresh();
            ctx.beginPath(); // 注意一定要开启新的路径，不然会出现光波辐射
            ctx.moveTo(startX, startY);
            ctx.lineTo(x, y);
            ctx.stroke();

        });

        $canvas.on('touchend', function (e) {
            that.refresh();
        })

    };

    this.initBalls();
    this.addEvent();

};

/**
 * 小球类
 * @param ctx 上下文
 * @param x 横坐标
 * @param y 纵坐标
 * @param radius 半径
 * @param code 代表的数字
 * @constructor
 */
var Ball = function (ctx, x, y, radius, code) {

    // 防止错误调用
    if (!(this instanceof Ball)) {
        return new Ball(ctx, x, y, radius, code);
    }

    var borderColor = '#b3b3b3'; // 小球的边框色
    var bgColor = '#ffffff'; // 小球的背景色
    var that = this;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.code = code;
    this.passed = false;

    /**
     * 将小球绘制到画板中
     * @param color
     */
    this.drawBall = function (color) {

        color = color ? color : '#ffa726'; // 颜色默认为橙色

        var ctx = this.ctx;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 360, false);
        ctx.fillStyle = color;
        ctx.strokeStyle = borderColor;
        ctx.stroke();
        ctx.fill();
        //ctx.save();
        //ctx.closePath();
        ctx.beginPath();

    };

    /**
     * 判断路径是否在某个圆弧范围内。
     * @param targetX
     * @param targetY
     * @returns {boolean}
     */
    this.isInBall = function (targetX, targetY) {

        var result;

        // 如果间距小于等于半径，则在圆内。
        Math.sqrt(Math.pow(targetX - that.x, 2) + Math.pow(targetY - that.y, 2)) <= that.radius ? result = true : result = false;

        return result;
    };

    // 初始化小球
    this.drawBall(bgColor);

};