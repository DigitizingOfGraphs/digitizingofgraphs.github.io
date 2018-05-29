//alert('Hello!');
//var coord = document.getElementById('coord');
//coord.style.background = '#000000';
//var count = 0;
//alert(document.getElementById('coord').offsetHeight);
/*
 *Надо разобраться с методом 'change', можно ли его эмулировать программно?
 *Избавиться от глобальных переменных, возможно, надо объеденить несколько мгновенно вызываемых функций в одну
 *!Почему-то при масштабировании иногда рисунок с графиком пропадает в режиме Live Preview
 *!Масштабироване точек нужно переделать, повторяемость кода!
 */

var canvasWidth = document.getElementById('graphImg').offsetWidth;
var canvasHeight = document.getElementById('graphImg').offsetHeight;
document.getElementById('graphImg').setAttribute('oncontextmenu', 'return false');
document.getElementById('canvasDiv').setAttribute('oncontextmenu', 'return false');
document.getElementById('navigation').isHidden = true; //Вот это точно надо изменить!

//document.getElementById('navigation').setAttribute()

/*(function(){
    var coord = document.getElementById('coord');
    var horLine = document.getElementById('horisontalLine');
    var vertLine = document.getElementById('verticalLine');
    var graphImg = document.getElementById('graphImg');
    vertLine.style.top = document.getElementById('graphImg').offsetTop + 'px';
    //document.getElementById('graphImg').addEventListener('mousemove', function(event){
    document.getElementById('canvasDiv').addEventListener('mousemove', function(event){
        coord.style.visibility = 'visible';
        //horLine.style.visibility = 'visible';
        //vertLine.style.visibility = 'visible';
        coord.textContent = event.pageX + '; ' + event.pageY;
        if (event.pageX > document.body.clientWidth - coord.offsetWidth - 10){
            coord.style.left = event.pageX - coord.offsetWidth - 8 + 'px';
        } else {
            coord.style.left = event.pageX + 8 + 'px';
        }
        if (event.pageY < graphImg.offsetTop + 10){
            coord.style.top = event.pageY + 8 + 'px';
        } else {
            coord.style.top = event.pageY - coord.offsetHeight - 8 + 'px';    
        }
        //horLine.style.top = event.pageY + 'px';
        //vertLine.style.height = document.getElementById('canvasDiv').offsetHeight + 'px';
        //vertLine.style.left = event.pageX + 'px';
    });
})();*/

/*(function(){
    var coord = document.getElementById('coord');
    var vertLine = document.getElementById('verticalLine');
    document.getElementById('horisontalLine').addEventListener('mousemove', function(event){
        vertLine.style.visibility = 'visible';
        vertLine.style.left = event.pageX + 'px';
        coord.textContent = event.pageX + '; ' + event.pageY;
        if (event.pageX > document.body.clientWidth - coord.offsetWidth - 10){
            coord.style.left = event.pageX - coord.offsetWidth - 8 + 'px';
        } else {
            coord.style.left = event.pageX + 8 + 'px';
        }
    });
})();

(function(){
    var coord = document.getElementById('coord');
    var horLine = document.getElementById('horisontalLine');
    document.getElementById('verticalLine').addEventListener('mousemove', function(event){
        horLine.style.visibility = 'visible';
        horLine.style.top = event.pageY + 'px';
        coord.textContent = event.pageX + '; ' + event.pageY;
        coord.style.top = event.pageY - coord.offsetHeight - 8 + 'px';
    });
})();*/

(function(){
    document.getElementById('menuIcon').addEventListener('click', function(){
        document.getElementById('layout').style.visibility = 'visible';
        document.getElementById('coord').style.visibility = 'hidden';
    });    
})();

(function(){
    document.getElementById('contentDiv').addEventListener('click', function(){
       document.getElementById('layout').style.visibility = 'hidden'; 
    });
})();

(function(){
    document.getElementById('btnDownloadPoints').addEventListener('click', function(){
        var a = document.createElement("a");
        a.setAttribute("href", "data:text/plain," + document.getElementById('tarPoints').value);
        a.setAttribute("download", "Points.txt");
        a.click();
    });
})();

(function(){
    document.getElementById('btnFileUpload').addEventListener('click', function(){
        var f = document.createElement("form");
        f.setAttribute('method',"post");
        f.setAttribute('enctype',"multipart/form-data");
        var hiddenInput = document.createElement('input');
        f.appendChild(hiddenInput);
        hiddenInput.setAttribute('type', 'file');
        hiddenInput.setAttribute('accept', 'image/*');
        hiddenInput.addEventListener('change', function(){
           //alert(hiddenInput.files[0]);
            var graphImg = document.getElementById('graphImg');
            graphImg.src = hiddenInput.files[0];
            var reader = new FileReader();
            reader.onloadend = function(){
					graphImg.src = reader.result;
			}
            reader.readAsDataURL(hiddenInput.files[0]);
        });
        hiddenInput.click();
    });
})();


(function(){
    var navigationWindow = document.getElementById('navigation');
    document.getElementById('canvasDiv').addEventListener('contextmenu', function(event){
        if (navigationWindow.isHidden == true){
            navigationWindow.style.left = event.pageX + 'px'; 
            navigationWindow.style.top = event.pageY + 'px';
            navigationWindow.style.display = 'block';
            navigationWindow.isHidden = false;
        } else {
            navigationWindow.style.display = 'none';
            navigationWindow.isHidden = true;
        }   
    });
})();

(function(){
    document.getElementById('navigation').addEventListener('mousemove', function(){
        document.getElementById('coord').style.visibility = 'hidden';
    });
})();

function addPoint() {
    var _points = []
    var _checkedPointIndex = -1;
    
    
    function getCenter(_point) {
        if (_point.isChecked === false) {
            return {
                x: _point.offsetLeft + 14,
                y: _point.offsetTop + 14
            };
        } else {
            return {
                x: _point.offsetLeft + 15,
                y: _point.offsetTop + 15
            };
        }
    }
    
    function findPointOnAxis(_point1, _value1, _point2, _value2) {
        return {
            x: _point1.x - (_point2.x - _point1.x) * _value1 / (_value2 - _value1),
            y: _point1.y - (_point2.y - _point1.y) * _value1 / (_value2 - _value1)
        };
    }
    
    function createLine(_point, _k) {
        if (_k === Infinity) {
            return {
                k: _k,
                b: _point.x
            };
        } else {
            return {
                k: _k,
                b: _point.y - _k * _point.x
            };
        }
    }
    
    function findCrossPoint(_line1, _line2) {
        if (_line1.k === _line2.k) {
            return {
                x: NaN,
                y: NaN
            };
        } else {
            if (_line1.k === Infinity) {
                return {
                    x: _line1.b,
                    y: _line2.k * _line1.b + _line2.b
                };
            } else {
                if (_line2.k === Infinity) {
                    return {
                        x: _line2.b,
                        y: _line1.k * _line2.b + _line1.b
                    };
                } else {
                    return {
                        x: (_line2.b - _line1.b) / (_line1.k - _line2.k),
                        y: _line1.k * (_line2.b - _line1.b) / (_line1.k - _line2.k) + _line1.b
                    };
                }
            }
        }
    }
    
    function calculate_k1_k2() {
        var _k = [];
        if (_points[0].offsetLeft == _points[1].offsetLeft && _points[0].offsetTop == _points[1].offsetTop){
            _k[0] = 0.0;
            _k[1] = Infinity;
        } else {
            _k[0] = (_points[1].offsetTop - _points[0].offsetTop) / (_points[1].offsetLeft - _points[0].offsetLeft);
            switch (_k[0]){
                case 0:
                    _k[1] = Infinity;
                    break;
                case -Infinity:
                    _k[0] = Infinity;
                    _k[1] = 0;
                    break;
                case Infinity:
                    _k[1] = 0;
                    break;
                default:
                    _k[1] = -1.0 / _k[0];
            }
        }
        return _k;
    }
    
    function calculateSC() {
        var _controlPoints = [];
        var _controlLines = [];
        var _k = calculate_k1_k2();
        var _alpha = Math.atan(_k[0]);
        var _result = [];
        var _newX1 = +document.getElementById('txtX1').value;
        var _newX2 = +document.getElementById('txtX2').value;
        var _newY3 = +document.getElementById('txtY3').value;
        var _newY4 = +document.getElementById('txtY4').value;
        _controlPoints[0] = getCenter(_points[0]);
        _controlPoints[1] = getCenter(_points[1]);
        _controlPoints[2] = getCenter(_points[2]);
        _controlPoints[3] = getCenter(_points[3]);
        _controlPoints[4] = findPointOnAxis(_controlPoints[0], _newX1, _controlPoints[1], _newX2);
        _controlLines[0] = createLine(_controlPoints[4], _k[1]);
        _controlLines[1] = createLine(_controlPoints[2], _k[0]);
        _controlLines[2] = createLine(_controlPoints[3], _k[1]);
        _controlPoints[5] = findCrossPoint(_controlLines[1], _controlLines[2]);
        _controlPoints[6] = findPointOnAxis(_controlPoints[5], _newY3, _controlPoints[3], _newY4);
        _controlLines[3] = createLine(_controlPoints[6], _k[0]);
        _controlPoints[7] = findCrossPoint(_controlLines[3], _controlLines[0]);
        if (_k[0] === Infinity){
            _result[0] = (_newX2 - _newX1) / (_controlPoints[1].y - _controlPoints[0].y);
            _result[1] = (_newY4 - _newY3) / (_controlPoints[5].x - _controlPoints[3].x);
        } else {
            _result[0] = Math.cos(_alpha) * (_newX2 - _newX1) / (_controlPoints[1].x - _controlPoints[0].x);
            _result[1] = Math.cos(_alpha) * (_newY4 - _newY3) / (_controlPoints[5].y - _controlPoints[3].y);
        }
        _result[2] = _alpha;
        _result[3] = _controlPoints[7];
        return _result;
    }
    
    return {
        createPoint: function(_event, _pictureSource) {
            var newPoint = document.createElement('img');
            newPoint.id = 'point ' + (_points.length + 1);
            newPoint.src = _pictureSource;
            newPoint.style.position = 'absolute';
            newPoint.setAttribute('oncontextmenu', 'return false')
            document.getElementById('canvasDiv').appendChild(newPoint);
            newPoint.style.left = _event.pageX - 14 + 'px';
            newPoint.style.top = _event.pageY - 14 + 'px';
            newPoint.style.zIndex = 500;
            newPoint.setAttribute('title', newPoint.id);
            newPoint.isChecked = false;
            newPoint.addEventListener('click', function(){
                if (newPoint.isChecked){
                    newPoint.isChecked = false;
                    newPoint.style.border = '';
                    newPoint.style.top = newPoint.offsetTop + 1 + 'px';
                    newPoint.style.left = newPoint.offsetLeft + 1 + 'px';
                    _checkedPointIndex = -1;
                } else {
                    for (var i = 0; i < _points.length; i++){
                        if (_points[i].isChecked){
                            _points[i].style.border = '';
                            _points[i].style.top = _points[i].offsetTop + 1 + 'px';
                            _points[i].style.left = _points[i].offsetLeft + 1 + 'px';
                            _points[i].isChecked = false;
                        }
                    }
                    newPoint.isChecked = true;
                    newPoint.style.border = '1px dashed #00eb55';
                    newPoint.style.top = newPoint.offsetTop - 1 + 'px';
                    newPoint.style.left = newPoint.offsetLeft - 1 + 'px';
                    _checkedPointIndex = +newPoint.id.slice(newPoint.id.indexOf(' ') + 1) - 1;
                }
            });
            _points.push(newPoint);
        },
        
        amountOfPoints: function() {
            return _points.length;
        },
        
        getCheckedPointIndex: function() {
            return _checkedPointIndex;
        },
        
        movePoint: function(_pointIndex, _event) {
            _points[_pointIndex].style.left = _event.pageX - 15 + 'px';
            _points[_pointIndex].style.top = _event.pageY - 15 + 'px';
        },
        
        scalePoints: function(_oldCanvasLeft, _oldCanvasTop, _oldCanvasWidth) {
            var canvasImg = document.getElementById('graphImg');
            for (var i = 0; i < _points.length; i++){
                /*_points[i].style.top = (canvasImg.offsetTop + 1) + (_points[i].offsetTop + 14 - (_oldCanvasTop + 1)) * canvasImg.offsetWidth / _oldCanvasWidth - 14 + 'px';
                _points[i].style.left = (canvasImg.offsetLeft + 1) + (_points[i].offsetLeft + 14 - (_oldCanvasLeft + 1)) * canvasImg.offsetWidth / _oldCanvasWidth - 14 + 'px';*/
                _points[i].style.top = canvasImg.offsetTop + (_points[i].offsetTop + 14 - _oldCanvasTop) * canvasImg.offsetWidth / _oldCanvasWidth - 14 + 'px';
                _points[i].style.left = canvasImg.offsetLeft + (_points[i].offsetLeft + 14 - _oldCanvasLeft) * canvasImg.offsetWidth / _oldCanvasWidth - 14 + 'px';
            }
        },
        
        calculateScaleCoefficients: function() {
            var _controlPoints = [];
            var _controlLines = [];
            var _k = calculate_k1_k2();
            var _alpha = Math.atan(_k[0]);
            var _result = [];
            var _newX1 = +document.getElementById('txtX1').value;
            var _newX2 = +document.getElementById('txtX2').value;
            var _newY3 = +document.getElementById('txtY3').value;
            var _newY4 = +document.getElementById('txtY4').value;
            _controlPoints[0] = getCenter(_points[0]);
            _controlPoints[1] = getCenter(_points[1]);
            _controlPoints[2] = getCenter(_points[2]);
            _controlPoints[3] = getCenter(_points[3]);
            _controlPoints[4] = findPointOnAxis(_controlPoints[0], _newX1, _controlPoints[1], _newX2);
            _controlLines[0] = createLine(_controlPoints[4], _k[1]);
            _controlLines[1] = createLine(_controlPoints[2], _k[0]);
            _controlLines[2] = createLine(_controlPoints[3], _k[1]);
            _controlPoints[5] = findCrossPoint(_controlLines[1], _controlLines[2]);
            _controlPoints[6] = findPointOnAxis(_controlPoints[5], _newY3, _controlPoints[3], _newY4);
            _controlLines[3] = createLine(_controlPoints[6], _k[0]);
            _controlPoints[7] = findCrossPoint(_controlLines[3], _controlLines[0]);
            if (_k[0] === Infinity){
                _result[0] = (_newX2 - _newX1) / (_controlPoints[1].y - _controlPoints[0].y);
                _result[1] = (_newY4 - _newY3) / (_controlPoints[5].x - _controlPoints[3].x);
            } else {
                _result[0] = Math.cos(_alpha) * (_newX2 - _newX1) / (_controlPoints[1].x - _controlPoints[0].x);
                _result[1] = Math.cos(_alpha) * (_newY4 - _newY3) / (_controlPoints[5].y - _controlPoints[3].y);
            }
            _result[2] = _alpha;
            _result[3] = _controlPoints[7];
            return _result;
        },
        
        getAlpha: function() {
            return Math.atan(calculate_k1_k2()[0]);
        }, 
        
        calculatePoints: function() {
            function coordinateChange(_point, _point0, _sc1, _sc2, _phi) {
                if (_phi === Math.PI / 2.0) {
                    return {
                        x: (_point.y - _point0.y) * _sc1,
                        y: (_point.x - _point0.x) * _sc2
                    };
                } else {
                    return {
                        x: ((_point.x - _point0.x) * Math.cos(_phi) + (_point.y - _point0.y) * Math.sin(_phi)) * _sc1,
                        y: ((_point0.y - _point.y) * Math.cos(_phi) - (_point.x - _point0.x) * Math.sin(-_phi)) * _sc2
                    };					
                }
            }
            
            var sc = calculateSC();
            var _result = [];
            for (var i = 4; i < _points.length; i++){
                _result[i - 4] = coordinateChange(getCenter(_points[i]), sc[3], sc[0], sc[1], sc[2]); //push
            }
            return _result;
        },
        
        getPoint: function(_index) {
            return _points[_index];
        }
    };
}

(function() {
    var points = addPoint();
    
    document.getElementById('graphImg').addEventListener('click', function(event){
        if (points.getCheckedPointIndex() === -1){
            switch(points.amountOfPoints()){
                case 0:
                    points.createPoint(event, 'crossX1.png');
                    var newX1 = prompt('Введите значение абсциссы точки', 10);
                    document.getElementById('txtX1').value = newX1;
                    break;
                case 1:
                    points.createPoint(event, 'crossX2.png');
                    var newX2 = prompt('Введите значение абсциссы точки', 30);
                    document.getElementById('txtX2').value = newX2;
                    break;
                case 2:
                    points.createPoint(event, 'crossY3.png');
                    var newY3 = prompt('Введите значение ординаты точки', 5);
                    document.getElementById('txtY3').value = newY3;
                    break;
                case 3:
                    points.createPoint(event, 'crossY4.png');
                    var newY4 = prompt('Введите значение ординаты точки', 10);
                    document.getElementById('txtY4').value = newY4;
                    break;
                default:
                    points.createPoint(event, 'black_cross4.png');
            }
        } else {
            points.movePoint(points.getCheckedPointIndex(), event);
        }
    });
    
    var zoom = document.getElementById('tbxZoom');
    var canvasImg = document.getElementById('graphImg');
    var headerDiv = document.getElementById('topline');
    
    zoom.onchange = function(){
        if (zoom.value > 0){
            var oldCanvasLeft = canvasImg.offsetLeft;
            var oldCanvasTop = canvasImg.offsetTop;
            var oldCanvasWidth = canvasImg.offsetWidth;
            canvasImg.style.width = canvasWidth * (+zoom.value) / 100 + 'px';
            canvasImg.style.height = canvasHeight * (+zoom.value) / 100 + 'px';
            points.scalePoints(oldCanvasLeft, oldCanvasTop, oldCanvasWidth);
            if (canvasImg.offsetWidth > document.body.clientWidth){
                headerDiv.style.width = canvasImg.style.width;
            } else {
                headerDiv.style.width = document.body.clientWidth + 'px';
            }
        }
    };
    
    document.getElementById('btnZoomIn').addEventListener('click', function(){
        //zoom.focus();
        zoom.value = +zoom.value + 25;
        var oldCanvasLeft = canvasImg.offsetLeft;
        var oldCanvasTop = canvasImg.offsetTop;
        var oldCanvasWidth = canvasImg.offsetWidth;
        canvasImg.style.width = canvasWidth * (+zoom.value) / 100 + 'px';
        canvasImg.style.height = canvasHeight * (+zoom.value) / 100 + 'px';
        points.scalePoints(oldCanvasLeft, oldCanvasTop, oldCanvasWidth);
        if (canvasImg.offsetWidth > document.body.clientWidth){
            headerDiv.style.width = canvasImg.style.width;
        } else {
            headerDiv.style.width = document.body.clientWidth + 'px';
        }
        //zoom.blur();
    });
    
    document.getElementById('btnZoomOut').addEventListener('click', function() {
        if (zoom.value > 25){
            zoom.value = +zoom.value - 25;
            var oldCanvasLeft = canvasImg.offsetLeft;
            var oldCanvasTop = canvasImg.offsetTop;
            var oldCanvasWidth = canvasImg.offsetWidth;
            canvasImg.style.width = canvasWidth * (+zoom.value) / 100 + 'px';
            points.scalePoints(oldCanvasLeft, oldCanvasTop, oldCanvasWidth);
            canvasImg.style.height = canvasHeight * (+zoom.value) / 100 + 'px';
            if (canvasImg.offsetWidth > document.body.clientWidth){
                headerDiv.style.width = canvasImg.style.width;
            } else {
                headerDiv.style.width = document.body.clientWidth + 'px';
            }
        }
    });
    
    var sc = [1.0, 1.0];
    
    document.getElementById('btnApplyAxis').addEventListener('click', function() {
       //alert("Applied!");
        if (points.amountOfPoints() > 3){
            sc = points.calculateScaleCoefficients();
            var accur = document.getElementById('txtAccuraсy');
            document.getElementById('canvasDiv').addEventListener('mousemove', function(event){
                coord.style.visibility = 'visible';
                var newCoord = coordinateChange(event, sc[3], sc[0], sc[1], sc[2])
                coord.textContent = newCoord.x.toFixed(+accur.value) + '; ' + newCoord.y.toFixed(+accur.value);
                if (event.pageX > document.body.clientWidth - coord.offsetWidth - 10){
                    coord.style.left = event.pageX - coord.offsetWidth - 8 + 'px';
                } else {
                    coord.style.left = event.pageX + 8 + 'px';
                }
                if (event.pageY < graphImg.offsetTop + 10){
                    coord.style.top = event.pageY + 8 + 'px';
                } else {
                    coord.style.top = event.pageY - coord.offsetHeight - 8 + 'px';    
                }
            });
            //alert('We can calculate it!');
        }
    });
    
    document.getElementById('btnApplyPoints').addEventListener('click', function() {
        if (points.amountOfPoints() > 4) {
           var newCoords = points.calculatePoints();
        }
        var tarPoints = document.getElementById('tarPoints');
        var accur = document.getElementById('txtAccuraсy');
        tarPoints.value = '';
        for (var i = 0; i < points.amountOfPoints() - 4; i++){
            tarPoints.value += ((i + 1) + ';' + newCoords[i].x.toFixed(+accur.value) + ';' + newCoords[i].y.toFixed(+accur.value) + '\n');
        }
    });
    
    function coordinateChange(_e, _point0, _sc1, _sc2, _phi) {
        if (_phi === Math.PI / 2.0) {
            return {
                x: (_e.pageY - _point0.y) * _sc1,
                y: (_e.pageX - _point0.x) * _sc2
            };
        } else {
            return {
                x: ((_e.pageX - _point0.x) * Math.cos(_phi) + (_e.pageY - _point0.y) * Math.sin(_phi)) * _sc1,
                y: ((_point0.y - _e.pageY) * Math.cos(_phi) - (_e.pageX - _point0.x) * Math.sin(-_phi)) * _sc2
            };					
        }
    }
    
    document.getElementById('btnUp').addEventListener('click', function(){
        var shift = +document.getElementById('tbxShift').value;
        var checkedPointIndex = points.getCheckedPointIndex();
        if (checkedPointIndex != -1) {
            var thisPoint = points.getPoint(checkedPointIndex);
            points.getPoint(checkedPointIndex).style.top = (points.getPoint(checkedPointIndex).offsetTop - shift) + 'px';
        }
    });
    //var coord = document.getElementById('coord');
    //var graphImg = document.getElementById('graphImg');
    

})();


/*
(function(){
    var canvasImg = document.getElementById('graphImg');
    var firstDiv = document.getElementById('firstDiv');
    var headerDiv = document.getElementById('topline');
    document.getElementById('btnZoomIn').addEventListener('click', function(){
        var zoom = document.getElementById('tbxZoom');
        if (+zoom.value < 300){
            zoom.value = +zoom.value + 25;
            canvasImg.style.width = canvasWidth * (+zoom.value) / 100 + 'px';
            canvasImg.style.height = canvasHeight * (+zoom.value) / 100 + 'px';
            if (canvasImg.offsetWidth > document.body.clientWidth){
                headerDiv.style.width = canvasImg.style.width;
            } else {
                headerDiv.style.width = document.body.clientWidth + 'px';
            }
        }
    });
})();

(function(){
    var canvasImg = document.getElementById('graphImg');
    var firstDiv = document.getElementById('firstDiv');
    var headerDiv = document.getElementById('topline');
    document.getElementById('btnZoomOut').addEventListener('click', function(){
        var zoom = document.getElementById('tbxZoom');
        if (+zoom.value > 25){
            zoom.value = +zoom.value - 25;
            canvasImg.style.width = canvasWidth * (+zoom.value) / 100 + 'px';
            canvasImg.style.height = canvasHeight * (+zoom.value) / 100 + 'px';
            if (canvasImg.offsetWidth > document.body.clientWidth){
                headerDiv.style.width = canvasImg.style.width;
            } else {
                headerDiv.style.width = document.body.clientWidth + 'px';
            }
        }
    });
})();

(function(){
    var zoom = document.getElementById('tbxZoom');
    var canvasImg = document.getElementById('graphImg');
    document.getElementById('tbxZoom').addEventListener('change', function(){
        canvasImg.style.width = canvasWidth * (+zoom.value) / 100 + 'px';
        canvasImg.style.height = canvasHeight * (+zoom.value) / 100 + 'px';
    })
})();
*/
