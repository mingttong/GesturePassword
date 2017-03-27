## 360H5

**demo地址：[http://fuch.cn/GesturePassword/](http://fuch.cn/GesturePassword/)**

### 事件委托

用委托，canvas中的图形事件委托给canvas。

#### 在Ball类中添加事件

**触碰到小球事件：**
1. **先判断小球是否已经经过**（通过存储的code判断）
1. **先将之前的线段固定**
1. 添加isInPath来判断是否点击到了小球
2. isInPath需要ctx来支持，而参数中有ctx
3. 接下来就只要通过点击获取坐标就好了。
4. 再存储小球的code
5. **设置线的新起点**

**滑动事件：**
1. 只需要每次都根据手一动的位置重新画线就好了。
2. **那原来那条线怎么删掉呢？**
3. **还是说没移动一次都将所有小球都重新画，然后将原来画的那条线用背景色再画一遍？**

**手抬起事件：**
1. 原本我们不是重新画了条线吗？这时候我们必须把原来这条线删除掉
2. 原理和滑动事件是一样的。


> 参考[如何为Canvas中特定图形绑定事件？](http://www.tuicool.com/articles/ZNrMfmU)
> **但参考的资料中有点问题**
> 链接中判断触点是否经过某圆的方法是使用Canvas内置的isPointInPath()，但这有个缺陷，就是在**每次判断时都必须要将路径重新设定一遍**，如果想边画线边判断，这就会导致错误。
> 因此我自己用了一个更靠谱的方法，**判断和圆心的距离**，如果小于等于半径则说明在圆内（高中数学终于没白学）。