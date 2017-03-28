/**
 * Created by lenovo on 2017/3/26.
 */

window.onload = function () {

    /*
     *****以下我们将“圆”成为“小球”，让其更加平易近人。*****
     */

    var gesturePassword = new GesturePassword();

    var $setBtn = $('#setPwd'),
        $verifyBtn = $('#verifyPwd');

    $setBtn.on('click', function () {
        // 设置密码

        gesturePassword.setTips('请输入手势密码');
        gesturePassword.setPwd(); // 切换到设置密码

    });

    $verifyBtn.on('click', function () {
        // 验证密码

        gesturePassword.setTips('请输入您的密码');
        gesturePassword.verifyPwd(); // 切换到验证密码

    })

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
        codeList = [], // 路径列表
        ballList = [], // 小球列表
        imgData = null, // 缓存每次图片的数据
        lineWidth = 3,
        lineColor = '#ffa726',
        pwd, // 密码
        pwdCache, // 密码缓存，用于验证密码时
        isVerifyPwd = false, // 是否要验证密码
        hasPwd = false // 是否有密码了
        ;

    /**
     * 验证密码
     */
    this.verifyPwd = function () {
        isVerifyPwd = true;
    };

    /**
     * 设置密码
     */
    this.setPwd = function () {
        isVerifyPwd = false;
        // 删除密码
        if (!delete localStorage.pwd) {
            localStorage.pwd = '';
        }
    };

    /**
     * 初始化小球（或者应该叫初始化手势密码？）
     */
    this.initBalls = function () {

        var x, y, i,
            ball = null
            ;

        codeList = []; // 清空路径列表
        ballList = []; // 清空小球列表
        ctx.clearRect(0, 0, _width, _height); // 清空所有控件
        // 重置起始位置
        startX = undefined;
        startY = undefined;

        // 添加小球
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
     * 检测是否按在了小球上面
     */
    this.isTouchOnBall = function (x, y) {

        var ball = null,
            i;

        for (i = 0; i < ballList.length; i += 1) {

            ball = ballList[i];

            // 经过小球事件

            // 各个圆点向canvas添加委托

            // 经过这个点时，并且该点之前没有经过过
            if (ball.isInBall(x, y) && !ball.passed) {

                that.refresh();
                // 先给小球着色
                ball.drawBall();
                // 再将两小球的圆心连接起来
                ctx.beginPath();
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = lineColor;
                ctx.moveTo(startX, startY);
                ctx.lineTo(ball.x, ball.y); // 线画向圆心。
                ctx.stroke(); // 画上线

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

    };

    /**
     * 设置提示
     * @param text
     */
    this.setTips = function (text) {

        $('#tips span').text(text);

    };

    /**
     * 向Canvas添加事件
     */
    this.addEvent = function () {

        $canvas.on('touchstart', function (e) {

            e.preventDefault(); // 防止浏览器默认事件

            var x = e.pageX || e.originalEvent.targetTouches[0].pageX,
                y = e.pageY || e.originalEvent.targetTouches[0].pageY
            ;

            that.isTouchOnBall(x, y);

        });

        $canvas.on('touchmove', function (e) {

            e.preventDefault(); // 防止浏览器默认事件

            var x = e.originalEvent.targetTouches[0].pageX,
                y = e.originalEvent.targetTouches[0].pageY
                ;

            // 检测手指是否经过小球
            that.isTouchOnBall(x, y);

            // 移动画线事件
            that.refresh();
            ctx.beginPath(); // 注意一定要开启新的路径，不然会出现光波辐射
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = lineColor;
            ctx.moveTo(startX, startY);
            ctx.lineTo(x, y);
            ctx.stroke();

        });

        $canvas.on('touchend', function (e) {

            // 如果并没有碰到任何小球，则不做任何判断
            if (codeList.length === 0) {
                return;
            }

            that.refresh();

            var password = codeList.join('');

            setTimeout(that.initBalls, 300);

            // 设置密码
            if (!isVerifyPwd) {

                // 如果没有密码缓存
                if (!pwdCache) {

                    hasPwd = false;

                    // 检查密码长度
                    if (password.length < 4) {

                        // 提示密码长度太短
                        that.setTips('密码太短，至少需要4个点');


                    } else {

                        // 缓存密码，并且让其再次输入密码
                        pwdCache = password;

                        that.setTips('请再次输入手势密码');
                    }

                } else {
                    // 验证两次输入是否相同

                    if (pwdCache === password) {
                        // 设置密码

                        that.setTips('密码设置成功');

                        localStorage.pwd = password;
                        hasPwd = true;

                    } else {
                        // 两次密码不同

                        that.setTips('两次输入的不一致');

                    }

                    pwdCache = undefined; // 清除缓存密码
                }

            // 验证密码
            } else {

                if (!localStorage.pwd) {
                    that.setTips('您还没有设置密码！');
                    return;
                }

                if (localStorage.pwd && password === localStorage.pwd) {
                    that.setTips('密码正确！');
                } else {
                    that.setTips('输入的密码不正确');
                }

            }

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
     * @param bgColor
     * @param borderColor
     */
    this.drawBall = function (bgColor, borderColor) {

        bgColor = bgColor ? bgColor : '#ffa726'; // 颜色默认为橙色
        borderColor = borderColor ? borderColor : '#fd8e01'; // 默认边框颜色

        var ctx = this.ctx;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 360, false);
        ctx.lineWidth = 1;
        ctx.fillStyle = bgColor;
        ctx.strokeStyle = borderColor;
        ctx.stroke();
        ctx.fill();
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

    // 初始化小球，颜色为背景颜色（白色），边框颜色灰色
    this.drawBall(bgColor, borderColor);

};