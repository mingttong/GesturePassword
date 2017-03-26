/**
 * Created by lenovo on 2017/3/26.
 */

window.onload = function () {


};

var GesturePassword = function () {

    /*
     RADIUS = 15
     GAP = 88
     整个宽度/高度：(GAP + RADIUS) * 2
     MARGIN_LEFT = (WIDTH - (GAP + RADIUS) * 2) / 2
     MARGIN_TOP = (HEIGHT - (GAP + RADIUS) * 2) / 2
     */

    var WIDTH = $(document.body).width();
    var HEIGHT = Math.round($(document.body).width() * 0.95);

    var RADIUS = 15,
        GAP = 88,
        MARGIN_LEFT = (WIDTH - (GAP + RADIUS) * 2) / 2,
        MARGIN_TOP = (HEIGHT - (GAP + RADIUS) * 2) / 2,
        lineColor = '#ffa726',
        ballColor = '#ffffff'
        ;

    var canvas = document.querySelector('#canvas');

    // 检测浏览器是否支持Canvas
    if (!canvas.getContext) {
        throw new Error('浏览器不支持Canvas');
    }

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    var ctx = canvas.getContext('2d');

    // 初始化圆


    function addBall(ctx, x, y, radius) {
        // 画一个空心圆
        ctx.beginPath();

        // x, y, radius, startAngle, endAngle, anticlockwise
        ctx.arc(x, y, radius, 0, 360, false);
        ctx.fillStyle = '#ffa726';
        ctx.strokeStyle = '#b3b3b3';
        ctx.stroke();
        ctx.fill();

        ctx.closePath();
    }

};