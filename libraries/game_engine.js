var Game;
(function (Game) {
    var EventDispatcher = (function () {
        function EventDispatcher(args) {
            this._listeners = {};
        }
        /*
            'listener' will receive a 'data' argument when its called.
            What 'data' is, depends on the event type.
    
            type: 'click'
            data: { event: MouseEvent; }
    
            type: 'collision'
            data: { element: Unit;
                    collidedWith: Unit; }
    
         */
        EventDispatcher.prototype.addEventListener = function (type, listener) {
            if (!this._listeners[type]) {
                this._listeners[type] = [];
            }
            if (Utilities.isFunction(listener)) {
                if (this._listeners[type].indexOf(listener) < 0) {
                    this._listeners[type].push(listener);
                    return true;
                }
            }
            return false;
        };
        /*
            Removes a specific listener of an event type, or all the listeners for that type (if 'listener' is not provided)
         */
        EventDispatcher.prototype.removeEventListener = function (type, listener) {
            if (this._listeners[type]) {
                if (typeof listener !== 'undefined') {
                    var index = this._listeners[type].indexOf(listener);
                    if (index >= 0) {
                        this._listeners.splice(index, 1);
                        return true;
                    }
                }
                else {
                    this._listeners[type] = [];
                    return true;
                }
            }
            return false;
        };
        EventDispatcher.prototype.removeAllEventListeners = function () {
            this._listeners = {};
        };
        /**
            Dispatches an event, which will trigger the listeners of that event
    
            @param type - type of the event to dispatch
            @param data - Data to be sent to every listener
         */
        EventDispatcher.prototype.dispatchEvent = function (type, data) {
            var listeners = this._listeners[type];
            if (listeners) {
                for (var a = listeners.length - 1; a >= 0; a--) {
                    listeners[a](data);
                }
            }
        };
        EventDispatcher.prototype.hasListeners = function (type) {
            if (this._listeners[type] && this._listeners[type].length > 0) {
                return true;
            }
            return false;
        };
        return EventDispatcher;
    })();
    Game.EventDispatcher = EventDispatcher;
})(Game || (Game = {}));
/// <reference path="event_dispatcher.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game;
(function (Game) {
    var Element = (function (_super) {
        __extends(Element, _super);
        function Element(args) {
            _super.call(this, args);
            var x = 0;
            var y = 0;
            if (typeof args !== 'undefined') {
                if (typeof args.x !== 'undefined') {
                    x = args.x;
                }
                if (typeof args.y !== 'undefined') {
                    y = args.y;
                }
            }
            this.visible = true;
            this.x = x;
            this.y = y;
            this.width = 0;
            this.height = 0;
            this.opacity = 1;
            this.column = -1;
            this.line = -1;
            this._container = null;
            this._rotation = 0;
            this._has_logic = false;
            this._removed = false;
        }
        /**
            Draws just this element
    
            @param ctx - canvas context
            @abstract
         */
        Element.prototype.drawElement = function (ctx) {
            throw new Error('Implement .drawElement().');
        };
        /*
            Draws this element, and all of its _children
         */
        Element.prototype.draw = function (ctx) {
            this.drawElement(ctx);
        };
        /*
            Logic code here (runs every tick)
         */
        Element.prototype.logic = function (deltaTime) {
            // optional
        };
        /**
            @abstract
         */
        Element.prototype.intersect = function (x, y, event) {
            throw new Error('Implement .intersect().');
        };
        Object.defineProperty(Element.prototype, "rotation", {
            /**
                @returns - Rotation in radians
             */
            get: function () {
                return this._rotation;
            },
            /**
                @param angle - Rotate by a certain angle (in radians)
             */
            set: function (angle) {
                this.rotate(angle, false);
            },
            enumerable: true,
            configurable: true
        });
        /**
            @param angle - angle of rotation
            @param degrees - whether the angle provided is in degrees or radians
         */
        Element.prototype.rotate = function (angle, degrees) {
            if (degrees === true) {
                this._rotation = Math.PI / 180 * angle;
            }
            else {
                this._rotation = angle;
            }
        };
        Element.prototype.remove = function () {
            this._removed = true;
            if (this._container !== null) {
                this._container.removeChild(this);
            }
            else {
                Game.removeElement(this);
            }
        };
        /**
            @abstract
         */
        Element.prototype.clone = function () {
            throw new Error('Implement .clone().');
        };
        return Element;
    })(Game.EventDispatcher);
    Game.Element = Element;
})(Game || (Game = {}));
/// <reference path="element.ts" />
var Game;
(function (Game) {
    /**
     * Basic Usage:
     *
     *     var bitmap = new Game.Bitmap({
     *             x: 10,
     *             y: 20,
     *             image: Game.Preload.get( 'id' )
     *         });
     *     Game.addElement( image );
     */
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap(args) {
            _super.call(this, args);
            this.image = args.image;
            this._source_x = 0;
            this._source_y = 0;
        }
        Bitmap.prototype.drawElement = function (ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.globalAlpha *= this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.drawImage(this._image, this._source_x, this._source_y, this.width, this.height, -this._half_width, -this._half_height, this.width, this.height);
            ctx.restore();
        };
        Bitmap.prototype.intersect = function (x, y, event) {
            var refX = 0;
            var refY = 0;
            if (this._container !== null) {
                refX = this._container.x;
                refY = this._container.y;
            }
            if (Utilities.pointBoxCollision(x, y, refX + this.x - this._half_width, refY + this.y - this._half_height, this.width, this.height)) {
                this.dispatchEvent(event.type, { event: event });
                return true;
            }
            return false;
        };
        Bitmap.prototype.clone = function () {
            return new Game.Bitmap({
                x: this.x,
                y: this.y,
                image: this._image
            });
        };
        Object.defineProperty(Bitmap.prototype, "image", {
            get: function () {
                return this._image;
            },
            set: function (newImage) {
                this.width = newImage.width;
                this.height = newImage.height;
                this._half_width = newImage.width / 2;
                this._half_height = newImage.height / 2;
                this._image = newImage;
            },
            enumerable: true,
            configurable: true
        });
        return Bitmap;
    })(Game.Element);
    Game.Bitmap = Bitmap;
})(Game || (Game = {}));
/// <reference path="element.ts" />
var Game;
(function (Game) {
    var Container = (function (_super) {
        __extends(Container, _super);
        function Container(args) {
            _super.call(this, args);
            this._children = [];
            if (typeof args !== 'undefined') {
                if (typeof args.children !== 'undefined') {
                    this.addChild(args.children);
                }
            }
        }
        /*
            addChild( element );
            addChild( element1, element2 );
            addChild( [ element1, element2 ] );
         */
        Container.prototype.addChild = function (elements) {
            var children = arguments;
            if (elements instanceof Array) {
                children = elements;
            }
            var length = children.length;
            for (var a = 0; a < length; a++) {
                var element = children[a];
                this._children.push(element);
                element._container = this;
            }
            this.calculateDimensions();
        };
        /*
            removeChild( element );
            removeChild( element1, element2 );
            removeChild( [ element1, element2 ] );
         */
        Container.prototype.removeChild = function (args) {
            var children = arguments;
            if (args instanceof Array) {
                children = args;
            }
            var length = children.length;
            for (var a = 0; a < length; a++) {
                var element = children[a];
                var index = this._children.indexOf(element);
                if (index >= 0) {
                    this._children.splice(index, 1);
                }
                element.container = null;
            }
        };
        Container.prototype.draw = function (ctx) {
            ctx.save();
            ctx.globalAlpha *= this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            var length = this._children.length;
            var child;
            for (var a = 0; a < length; a++) {
                child = this._children[a];
                if (child.visible) {
                    child.drawElement(ctx);
                }
            }
            ctx.restore();
        };
        Container.prototype.drawElement = function (ctx) {
            this.draw(ctx); // to allow containers to be inside containers
        };
        Container.prototype.intersect = function (x, y, event) {
            var found = false;
            for (var a = this._children.length - 1; a >= 0; a--) {
                var element = this._children[a];
                if (element.intersect(x, y, event)) {
                    found = true;
                }
            }
            if (found === true) {
                this.dispatchEvent(event.type, { event: event });
            }
            return found;
        };
        /*
            calculate the width/height of the container
         */
        Container.prototype.calculateDimensions = function () {
            if (this._children.length === 0) {
                this.width = this.height = 0;
            }
            var firstChild = this._children[0];
            var leftMost = firstChild.x;
            var rightMost = firstChild.x + firstChild.width;
            var topMost = firstChild.y;
            var bottomMost = firstChild.y + firstChild.height;
            var length = this._children.length;
            for (var a = 1; a < length; a++) {
                var element = this._children[a];
                if (element.x < leftMost) {
                    leftMost = element.x;
                }
                else if (element.x + element.width > rightMost) {
                    rightMost = element.x + element.width;
                }
                if (element.y < topMost) {
                    topMost = element.y;
                }
                else if (element.y + element.height > bottomMost) {
                    bottomMost = element.y + element.height;
                }
            }
            this.width = rightMost - leftMost;
            this.height = bottomMost - topMost;
        };
        Container.prototype.logic = function (deltaTime) {
            for (var a = this._children.length - 1; a >= 0; a--) {
                var element = this._children[a];
                if (element._has_logic === true) {
                    element.logic(deltaTime);
                }
            }
        };
        Container.prototype.clone = function () {
            var children = [];
            var length = this._children.length;
            for (var a = 0; a < length; a++) {
                children.push(this._children[a].clone());
            }
            return new Game.Container({
                x: this.x,
                y: this.y,
                children: children
            });
        };
        return Container;
    })(Game.Element);
    Game.Container = Container;
})(Game || (Game = {}));
/// <reference path="container.ts" />
var Game;
(function (Game) {
    var Bullet = (function (_super) {
        __extends(Bullet, _super);
        function Bullet(args) {
            _super.call(this, args);
            this._has_logic = true;
            this.movement_speed = args.movement_speed;
            // its an angle
            if (typeof args.angleOrTarget === 'number') {
                this._move_x = Math.cos(args.angleOrTarget) * args.movement_speed;
                this._move_y = Math.sin(args.angleOrTarget) * args.movement_speed;
                this.rotation = args.angleOrTarget;
                this.logic = this.fixedLogic;
            }
            else {
                this._target = args.angleOrTarget;
                this.logic = this.targetLogic;
            }
            if (typeof args.remove === 'undefined') {
                this._remove = this.remove;
            }
            else {
                this._remove = args.remove;
            }
            Bullet._container.addChild(this);
            Bullet._all.push(this);
        }
        Bullet.init = function () {
            Bullet._all = [];
            Bullet._container = new Game.Container();
            Bullet._container._has_logic = true;
            Game.getCanvas().addElement(Bullet._container);
        };
        Bullet.prototype.remove = function () {
            _super.prototype.remove.call(this);
            var index = Bullet._all.indexOf(this);
            Bullet._all.splice(index, 1);
            Bullet._container.removeChild(this);
        };
        /*
            logic for when the bullet is moving in a fixed direction
         */
        Bullet.prototype.fixedLogic = function (deltaTime) {
            this.x += this._move_x * deltaTime;
            this.y += this._move_y * deltaTime;
            if (!Game.getCanvas().isInCanvas(this.x, this.y)) {
                this._remove();
            }
        };
        /*
            logic for when the bullet is following a target
         */
        Bullet.prototype.targetLogic = function (deltaTime) {
            var target = this._target;
            var angle = Utilities.calculateAngle(this.x, this.y * -1, target.x, target.y * -1);
            this.x += Math.cos(angle) * this.movement_speed * deltaTime;
            this.y += Math.sin(angle) * this.movement_speed * deltaTime;
            this.rotation = angle;
            if (Utilities.boxBoxCollision(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height, target.x - target.width / 2, target.y - target.height / 2, target.width, target.height)) {
                this._remove();
            }
        };
        Bullet.prototype.logic = function (deltaTime) {
            // this is going to assigned to either .fixedLogic() or .targetLogic(), depending on the type of bullet
        };
        Bullet.prototype.clone = function () {
            var children = [];
            var length = this._children.length;
            for (var a = 0; a < length; a++) {
                children.push(this._children[a].clone());
            }
            var angleOrTarget;
            if (this._target) {
                angleOrTarget = this._target;
            }
            else {
                angleOrTarget = this.rotation;
            }
            return new Game.Bullet({
                x: this.x,
                y: this.y,
                children: children,
                movement_speed: this.movement_speed,
                angleOrTarget: angleOrTarget,
                remove: this._remove
            });
        };
        return Bullet;
    })(Game.Container);
    Game.Bullet = Bullet;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Canvas = (function () {
        function Canvas(args) {
            this._canvas = document.createElement('canvas');
            this._canvas.className = 'Game-Canvas';
            this._ctx = this._canvas.getContext('2d');
            this._canvas.width = this._width = args.width;
            this._canvas.height = this._height = args.height;
            this._elements = [];
            this.events_enabled = true;
            this.update_on_loop = true;
        }
        /*
            addElement( element );
            addElement( element1, element2 );
            addElement( [ element1, element2 ] );
         */
        Canvas.prototype.addElement = function (args) {
            var elements = arguments;
            if (args instanceof Array) {
                elements = args;
            }
            var length = elements.length;
            for (var a = 0; a < length; a++) {
                this._elements.push(elements[a]);
            }
        };
        /*
            removeElement( element );
            removeElement( element1, element2 );
            removeElement( [ element1, element2 ] );
        */
        Canvas.prototype.removeElement = function (args) {
            var elements = arguments;
            var removed = false;
            if (args instanceof Array) {
                elements = args;
            }
            var length = elements.length;
            for (var a = 0; a < length; a++) {
                var element = elements[a];
                var index = this._elements.indexOf(element);
                if (index >= 0) {
                    this._elements.splice(index, 1);
                    removed = true;
                }
            }
            return removed;
        };
        Canvas.prototype.logic = function (deltaTime) {
            for (var a = this._elements.length - 1; a >= 0; a--) {
                var element = this._elements[a];
                if (element._has_logic === true) {
                    element.logic(deltaTime);
                }
            }
        };
        Canvas.prototype.draw = function () {
            this._ctx.clearRect(0, 0, this._width, this._height);
            var length = this._elements.length;
            for (var a = 0; a < length; a++) {
                var element = this._elements[a];
                if (element.visible) {
                    element.draw(this._ctx);
                }
            }
        };
        Canvas.prototype.mouseEvents = function (event) {
            var elements = this._elements;
            var rect = this._canvas.getBoundingClientRect();
            var x = event.x - rect.left;
            var y = event.y - rect.top;
            var type = event.type;
            for (var a = elements.length - 1; a >= 0; a--) {
                var element = elements[a];
                // check if there's listeners on this element
                if (element.hasListeners(type)) {
                    if (element.intersect(x, y, event)) {
                        break;
                    }
                }
            }
        };
        Canvas.prototype.updateDimensions = function (width, height) {
            this._canvas.width = this._width = width;
            this._canvas.height = this._height = height;
        };
        Canvas.prototype.getRandomPosition = function () {
            return {
                x: Utilities.getRandomInt(0, this._width),
                y: Utilities.getRandomInt(0, this._height)
            };
        };
        /*
            Check if a position is located in the canvas
         */
        Canvas.prototype.isInCanvas = function (x, y) {
            if (x < 0 || x > this._width || y < 0 || y > this._height) {
                return false;
            }
            return true;
        };
        Canvas.prototype.getWidth = function () {
            return this._width;
        };
        Canvas.prototype.getHeight = function () {
            return this._height;
        };
        Canvas.prototype.getHtmlCanvasElement = function () {
            return this._canvas;
        };
        Canvas.prototype.getCanvasContext = function () {
            return this._ctx;
        };
        Canvas.prototype.getElements = function () {
            return this._elements;
        };
        return Canvas;
    })();
    Game.Canvas = Canvas;
})(Game || (Game = {}));
/// <reference path="element.ts" />
var Game;
(function (Game) {
    var Circle = (function (_super) {
        __extends(Circle, _super);
        function Circle(args) {
            _super.call(this, args);
            this._radius = args.radius;
            this.width = this.height = args.radius * 2;
            this.color = args.color;
        }
        Object.defineProperty(Circle.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            set: function (value) {
                this._radius = value;
                this.width = this.height = value * 2;
            },
            enumerable: true,
            configurable: true
        });
        Circle.prototype.drawElement = function (ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.globalAlpha *= this.opacity;
            ctx.fillStyle = this.color;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.arc(0, 0, this._radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        };
        Circle.prototype.intersect = function (x, y, event) {
            var refX = 0;
            var refY = 0;
            if (this._container !== null) {
                refX = this._container.x;
                refY = this._container.y;
            }
            if (Utilities.circlePointCollision(refX + this.x, refY + this.y, this._radius, x, y)) {
                this.dispatchEvent(event.type, { event: event });
                return true;
            }
            return false;
        };
        Circle.prototype.clone = function () {
            return new Game.Circle({
                x: this.x,
                y: this.y,
                radius: this._radius,
                color: this.color
            });
        };
        return Circle;
    })(Game.Element);
    Game.Circle = Circle;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Html;
    (function (Html) {
        var HtmlElement = (function () {
            function HtmlElement(args) {
                var container = document.createElement('div');
                container.className = 'Game-Element';
                if (typeof args !== 'undefined') {
                    // add an optional id
                    if (typeof args.cssId !== 'undefined') {
                        container.id = args.cssId;
                    }
                    // add optional class/classes
                    if (typeof args.cssClass !== 'undefined') {
                        if (typeof args.cssClass === 'string') {
                            container.classList.add(args.cssClass);
                        }
                        else {
                            for (var a = args.cssClass.length - 1; a >= 0; a--) {
                                container.classList.add(args.cssClass[a]);
                            }
                        }
                    }
                    // add optional pre text
                    if (typeof args.preText !== 'undefined') {
                        var preText = document.createElement('span');
                        preText.innerHTML = args.preText;
                        container.appendChild(preText);
                    }
                }
                this.container = container;
                this.isActive = true;
            }
            HtmlElement.prototype.setActive = function (yesNo) {
                // already in that state
                if (yesNo === this.isActive) {
                    return;
                }
                if (yesNo === true) {
                    this.addEvents();
                    this.container.classList.remove('Game-inactive');
                }
                else {
                    this.removeEvents();
                    this.container.classList.add('Game-inactive');
                }
                this.isActive = yesNo;
            };
            HtmlElement.prototype.addEvents = function () {
                // implement this if needed
            };
            HtmlElement.prototype.removeEvents = function () {
                // implement this if needed
            };
            HtmlElement.prototype.clear = function () {
                // implement this if needed
            };
            return HtmlElement;
        })();
        Html.HtmlElement = HtmlElement;
        var HtmlContainer = (function (_super) {
            __extends(HtmlContainer, _super);
            function HtmlContainer(args) {
                _super.call(this, args);
                this.container.classList.add('Game-Container');
                this._children = [];
                if (typeof args !== 'undefined') {
                    if (typeof args.children !== 'undefined') {
                        this.addChild(args.children);
                    }
                }
            }
            /*
                addChild( element );
                addChild( element1, element2 );
                addChild( [ element1, element2 ] );
    
                element is of type 'HtmlElement'
             */
            HtmlContainer.prototype.addChild = function (args) {
                var elements = arguments;
                if (args instanceof Array) {
                    elements = args;
                }
                var length = elements.length;
                for (var a = 0; a < length; a++) {
                    var child = elements[a];
                    this._children.push(child);
                    this.container.appendChild(child.container);
                }
            };
            /*
                removeChild( element );
                removeChild( element1, element2 );
                removeChild( [ element1, element2 ] );
    
                element is of type 'Component'
             */
            HtmlContainer.prototype.removeChild = function (args) {
                var elements = arguments;
                if (args instanceof Array) {
                    elements = args;
                }
                var length = elements.length;
                for (var a = 0; a < length; a++) {
                    var child = elements[a];
                    var index = this._children.indexOf(child);
                    if (index >= 0) {
                        this._children.splice(index, 1);
                        child.clear();
                    }
                }
            };
            /*
                Removes the game menu, plus all of its components (can't use the menu after this)
             */
            HtmlContainer.prototype.clear = function () {
                for (var a = this._children.length - 1; a >= 0; a--) {
                    this._children[a].clear();
                }
                this.container.parentNode.removeChild(this.container);
                this._children.length = 0;
            };
            return HtmlContainer;
        })(HtmlElement);
        Html.HtmlContainer = HtmlContainer;
        var Value = (function (_super) {
            __extends(Value, _super);
            function Value(args) {
                // set properties before this
                _super.call(this, args);
                // .container only available after super()
                this.element = document.createElement('span');
                this.container.appendChild(this.element);
                this.container.classList.add('Game-Value');
                this.setValue(args.value);
            }
            Value.prototype.setValue = function (value) {
                if (value === this.value) {
                    return;
                }
                this.value = value;
                this.element.innerHTML = value;
            };
            Value.prototype.getValue = function () {
                return this.value;
            };
            Value.prototype.clear = function () {
                this.value = null;
            };
            return Value;
        })(HtmlElement);
        Html.Value = Value;
        var Button = (function (_super) {
            __extends(Button, _super);
            function Button(args) {
                var _this = this;
                if (typeof this.click_ref === 'undefined') {
                    this.click_ref = function () {
                        args.callback(_this);
                    };
                }
                // set properties before this
                _super.call(this, args);
                // .container only available after super()
                this.container.classList.add('Game-Button');
                this.addEvents();
            }
            Button.prototype.addEvents = function () {
                this.container.addEventListener('click', this.click_ref);
            };
            Button.prototype.removeEvents = function () {
                this.container.removeEventListener('click', this.click_ref);
            };
            Button.prototype.clear = function () {
                _super.prototype.clear.call(this);
                this.removeEvents();
                this.click_ref = null;
            };
            return Button;
        })(Value);
        Html.Button = Button;
        var Boolean = (function (_super) {
            __extends(Boolean, _super);
            function Boolean(args) {
                var _this = this;
                this.click_ref = function () {
                    _this.setValue(!_this.value);
                    args.callback(_this);
                };
                // set properties before this
                _super.call(this, args);
                // .container only available after super()
                this.element = document.createElement('span');
                this.container.appendChild(this.element);
                this.container.classList.add('Game-Boolean');
                this.setValue(args.value);
                this.addEvents();
            }
            Boolean.prototype.addEvents = function () {
                this.container.addEventListener('click', this.click_ref);
            };
            Boolean.prototype.removeEvents = function () {
                this.container.removeEventListener('click', this.click_ref);
            };
            Boolean.prototype.setValue = function (value) {
                if (value === this.value) {
                    return;
                }
                if (value === true) {
                    this.element.innerHTML = 'On';
                }
                else {
                    this.element.innerHTML = 'Off';
                }
                this.value = value;
            };
            Boolean.prototype.getValue = function () {
                return this.value;
            };
            Boolean.prototype.clear = function () {
                this.removeEvents();
                this.click_ref = null;
            };
            return Boolean;
        })(HtmlElement);
        Html.Boolean = Boolean;
        var TwoState = (function (_super) {
            __extends(TwoState, _super);
            function TwoState(args) {
                var _this = this;
                this.isValue1 = true;
                this.click_ref = function () {
                    if (_this.isValue1) {
                        _this.element.innerHTML = args.value2;
                        args.callback(_this);
                    }
                    else {
                        _this.element.innerHTML = args.value;
                        args.callback2(_this);
                    }
                    _this.isValue1 = !_this.isValue1;
                };
                // set properties before this
                _super.call(this, args);
                // .container only available after super()
                this.container.classList.add('Game-TwoState');
            }
            return TwoState;
        })(Button);
        Html.TwoState = TwoState;
        var MultipleOptions = (function (_super) {
            __extends(MultipleOptions, _super);
            function MultipleOptions(args) {
                var _this = this;
                this.click_ref = function () {
                    var element = this;
                    if (element === _this.selected) {
                        return;
                    }
                    var position = _this.elements.indexOf(element);
                    _this.select(position);
                    args.callback(_this, position, element);
                };
                // set properties before this
                _super.call(this, args);
                // .container only available after super()
                this.elements = [];
                var length = args.options.length;
                for (var a = 0; a < length; a++) {
                    var option = document.createElement('span');
                    option.innerHTML = args.options[a];
                    this.container.appendChild(option);
                    this.elements.push(option);
                }
                this.container.classList.add('Game-MultipleOptions');
                this.selected = null;
                this.select(0);
                this.addEvents();
            }
            MultipleOptions.prototype.select = function (position) {
                var element = this.elements[position];
                if (!element || element === this.selected) {
                    return;
                }
                if (this.selected) {
                    this.selected.classList.remove('Game-selected');
                }
                this.selected = element;
                element.classList.add('Game-selected');
            };
            MultipleOptions.prototype.addEvents = function () {
                for (var a = this.elements.length - 1; a >= 0; a--) {
                    this.elements[a].addEventListener('click', this.click_ref);
                }
            };
            MultipleOptions.prototype.removeEvents = function () {
                for (var a = this.elements.length - 1; a >= 0; a--) {
                    this.elements[a].removeEventListener('click', this.click_ref);
                }
            };
            MultipleOptions.prototype.clear = function () {
                this.removeEvents();
                this.click_ref = null;
                this.elements.length = 0;
            };
            return MultipleOptions;
        })(HtmlElement);
        Html.MultipleOptions = MultipleOptions;
        var Range = (function (_super) {
            __extends(Range, _super);
            function Range(args) {
                var _this = this;
                if (typeof args.step === 'undefined') {
                    args.step = 1;
                }
                this.change_ref = function (event) {
                    _this.setValue(parseInt(event.srcElement.value, 10));
                    if (args.onChange) {
                        args.onChange(_this);
                    }
                };
                this.input_ref = function (event) {
                    _this.value.innerHTML = event.srcElement.value;
                };
                // set properties before this
                _super.call(this, args);
                // .container only available after super()
                this.input = document.createElement('input');
                this.input.type = 'range';
                this.input.min = args.min.toString();
                this.input.max = args.max.toString();
                this.input.value = args.value.toString();
                this.input.step = args.step.toString();
                this.value = document.createElement('span');
                this.container.classList.add('Game-Range');
                this.container.appendChild(this.input);
                this.container.appendChild(this.value);
                this.setValue(args.value);
                this.addEvents();
            }
            Range.prototype.setValue = function (value) {
                if (value === this.current_value) {
                    return;
                }
                this.current_value = value;
                this.input.value = value;
                this.value.innerHTML = value;
            };
            Range.prototype.getValue = function () {
                return this.current_value;
            };
            Range.prototype.addEvents = function () {
                this.input.addEventListener('input', this.input_ref);
                this.input.addEventListener('change', this.change_ref);
            };
            Range.prototype.removeEvents = function () {
                this.input.removeEventListener('input', this.input_ref);
                this.input.removeEventListener('change', this.change_ref);
            };
            Range.prototype.clear = function () {
                this.removeEvents();
                this.change_ref = null;
                this.input_ref = null;
            };
            return Range;
        })(HtmlElement);
        Html.Range = Range;
    })(Html = Game.Html || (Game.Html = {}));
})(Game || (Game = {}));
/// <reference path="utilities/utilities.1.7.0.d.ts" />
var Game;
(function (Game) {
    var HighScore;
    (function (HighScore) {
        var SCORES = {};
        var MAX_SCORES_SAVED;
        var STORAGE_NAME;
        var SORT_F;
        /**
            @param maxScoresSaved - Total number of scores saved (only the top scores)
            @param storageName - Name to be used when loading/saving to localStorage
            @param ascending - Sort the values in ascending or descending order
         */
        function init(maxScoresSaved, storageName, ascending) {
            MAX_SCORES_SAVED = maxScoresSaved;
            STORAGE_NAME = storageName;
            // lower values first
            if (ascending === true) {
                SORT_F = function (a, b) {
                    return a - b;
                };
            }
            else {
                SORT_F = function (a, b) {
                    return b - a;
                };
            }
            load();
        }
        HighScore.init = init;
        function add(key, value) {
            if (typeof SCORES[key] === 'undefined') {
                SCORES[key] = [];
            }
            // don't add repeated scores
            if (SCORES[key].indexOf(value) >= 0) {
                return;
            }
            SCORES[key].push(value);
            // have the better scores first (better means a lesser value)
            SCORES[key].sort(SORT_F);
            // if we pass the limit, remove one of the lesser scores
            if (SCORES[key].length > MAX_SCORES_SAVED) {
                SCORES[key].pop();
            }
            save();
        }
        HighScore.add = add;
        function get(key) {
            return SCORES[key];
        }
        HighScore.get = get;
        /*
            Remove all the scores.
         */
        function clear() {
            SCORES = {};
            localStorage.removeItem(STORAGE_NAME);
        }
        HighScore.clear = clear;
        function save() {
            Utilities.saveObject(STORAGE_NAME, SCORES);
        }
        function load() {
            var scores = Utilities.getObject(STORAGE_NAME);
            if (scores) {
                SCORES = scores;
            }
        }
    })(HighScore = Game.HighScore || (Game.HighScore = {}));
})(Game || (Game = {}));
/// <reference path="html.ts" />
var Game;
(function (Game) {
    var Message = (function (_super) {
        __extends(Message, _super);
        function Message(args) {
            _super.call(this, args);
            this.text = document.createElement('div');
            this.text.className = 'Game-Message-text';
            this.setText(args.text);
            this.container.appendChild(this.text);
            this.container.classList.add('Game-Message-container');
            this.timeout = null;
            this.background = null;
            if (typeof args.buttons !== 'undefined') {
                var buttons;
                if (args.buttons instanceof Array) {
                    buttons = args.buttons;
                }
                else {
                    buttons = [args.buttons];
                }
                var length = buttons.length;
                var buttonsContainer = new Game.Html.HtmlContainer({
                    cssClass: 'Game-Message-Components'
                });
                for (var a = 0; a < length; a++) {
                    buttonsContainer.addChild(buttons[a]);
                }
                this.addChild(buttonsContainer);
            }
            if (Utilities.isNumber(args.timeout)) {
                this.timeout = new Utilities.Timeout();
                var _this = this;
                this.timeout.start(function () {
                    _this.clear();
                }, args.timeout * 1000);
            }
            if (args.background === true) {
                this.background = document.createElement('div');
                this.background.className = 'Game-Message-background';
                args.container.appendChild(this.background);
            }
            args.container.appendChild(this.container);
        }
        Message.prototype.clear = function () {
            if (this.timeout) {
                this.timeout.clear();
                this.timeout = null;
            }
            if (this.background) {
                this.container.parentNode.removeChild(this.background);
            }
            _super.prototype.clear.call(this);
        };
        Message.prototype.getText = function () {
            return this.text.innerHTML;
        };
        Message.prototype.setText = function (text) {
            if (text instanceof HTMLElement) {
                this.text.innerHTML = '';
                this.text.appendChild(text);
            }
            else {
                this.text.innerHTML = text;
            }
        };
        return Message;
    })(Game.Html.HtmlContainer);
    Game.Message = Message;
})(Game || (Game = {}));
var Game;
(function (Game) {
    (function (TweenAction) {
        TweenAction[TweenAction["properties"] = 0] = "properties";
        TweenAction[TweenAction["wait"] = 1] = "wait";
        TweenAction[TweenAction["call"] = 2] = "call";
    })(Game.TweenAction || (Game.TweenAction = {}));
    var TweenAction = Game.TweenAction;
    var Tween = (function () {
        function Tween(element) {
            this._element = element;
            this._steps = [];
            this._current_step = null;
            this._start_properties = null;
            this._count = 0;
            this._update = null;
        }
        Tween.prototype.start = function () {
            this.nextStep();
            Tween._tweens.push(this);
        };
        Tween.prototype.to = function (properties, duration, ease) {
            if (typeof ease === 'undefined') {
                ease = Game.Tween.Ease.linear;
            }
            this._steps.push({
                action: 0 /* properties */,
                end_properties: properties,
                duration: duration,
                ease: ease
            });
            return this;
        };
        Tween.prototype.wait = function (duration) {
            this._steps.push({
                action: 1 /* wait */,
                duration: duration
            });
            return this;
        };
        Tween.prototype.call = function (callback) {
            this._steps.push({
                action: 2 /* call */,
                callback: callback
            });
            return this;
        };
        Tween.prototype.remove = function () {
            var index = Tween._tweens.indexOf(this);
            Tween._tweens.splice(index, 1);
        };
        Tween.prototype.nextStep = function () {
            var step = this._steps.shift();
            if (!step) {
                this.remove();
                return;
            }
            this._current_step = step;
            if (step.action === 2 /* call */) {
                step.callback();
                this.nextStep();
            }
            else if (step.action === 1 /* wait */) {
                this._count = 0;
                this._update = this.waitUpdate;
            }
            else if (step.action === 0 /* properties */) {
                var startProperties = {};
                for (var property in step.end_properties) {
                    startProperties[property] = this._element[property];
                }
                this._start_properties = startProperties;
                this._count = 0;
                this._update = this.propertiesUpdate;
            }
        };
        Tween.prototype.waitUpdate = function (deltaTime) {
            var step = this._current_step;
            this._count += deltaTime;
            if (this._count >= step.duration) {
                this.nextStep();
            }
        };
        Tween.prototype.propertiesUpdate = function (deltaTime) {
            var step = this._current_step;
            this._count += deltaTime;
            // how far into the complete movement we're in
            var percentage = this._count / step.duration;
            var value = step.ease(percentage);
            for (var property in step.end_properties) {
                var start = this._start_properties[property];
                var end = step.end_properties[property];
                this._element[property] = start + (end - start) * value;
            }
            if (this._count >= step.duration) {
                for (var property in step.end_properties) {
                    this._element[property] = step.end_properties[property];
                }
                this.nextStep();
            }
        };
        /*
            Returns an existing tween of an element, or null if there's no active tween working on the element.
         */
        Tween.getTween = function (element) {
            for (var a = Tween._tweens.length - 1; a >= 0; a--) {
                var tween = Tween._tweens[a];
                if (tween._element === element) {
                    return tween;
                }
            }
            return null;
        };
        Tween.removeTweens = function (element) {
            for (var a = Tween._tweens.length - 1; a >= 0; a--) {
                var tween = Tween._tweens[a];
                if (tween._element === element) {
                    Tween._tweens.splice(a, 1);
                }
            }
        };
        Tween.removeAll = function () {
            Tween._tweens.length = 0;
        };
        Tween.update = function (deltaTime) {
            for (var a = Tween._tweens.length - 1; a >= 0; a--) {
                Tween._tweens[a]._update(deltaTime);
            }
        };
        Tween._tweens = [];
        return Tween;
    })();
    Game.Tween = Tween;
    var Tween;
    (function (Tween) {
        var Ease;
        (function (Ease) {
            function linear(value) {
                return value;
            }
            Ease.linear = linear;
            function quadraticIn(value) {
                return value * value;
            }
            Ease.quadraticIn = quadraticIn;
        })(Ease = Tween.Ease || (Tween.Ease = {}));
    })(Tween = Game.Tween || (Game.Tween = {}));
})(Game || (Game = {}));
/// <reference path="event_dispatcher.ts" />
var Game;
(function (Game) {
    var Grid = (function (_super) {
        __extends(Grid, _super);
        function Grid(args) {
            _super.call(this, args);
            this._grid = [];
            for (var column = 0; column < args.columns; column++) {
                this._grid[column] = [];
                for (var line = 0; line < args.lines; line++) {
                    this._grid[column][line] = null;
                }
            }
            if (typeof args.refX === 'undefined') {
                args.refX = args.squareSize / 2;
            }
            if (typeof args.refY === 'undefined') {
                args.refY = args.squareSize / 2;
            }
            if (typeof args.background !== 'undefined') {
                var width = args.squareSize * args.columns;
                var height = args.squareSize * args.lines;
                this._background = new Game.Rectangle({
                    x: args.refX + width / 2 - args.squareSize / 2,
                    y: args.refY + height / 2 - args.squareSize / 2,
                    width: width,
                    height: height,
                    color: args.background.color,
                    fill: args.background.fill
                });
                if (typeof args.background.canvasId === 'undefined') {
                    args.background.canvasId = 0;
                }
                Game.getCanvas(args.background.canvasId).addElement(this._background);
            }
            else {
                this._background = null;
            }
            this.square_size = args.squareSize;
            this.columns = args.columns;
            this.lines = args.lines;
            this.ref_x = args.refX;
            this.ref_y = args.refY;
        }
        Grid.prototype.toCanvas = function (column, line) {
            return {
                x: this.ref_x + column * this.square_size,
                y: this.ref_y + line * this.square_size
            };
        };
        Grid.prototype.toGrid = function (x, y) {
            return {
                column: Math.round((x - this.ref_x) / this.square_size),
                line: Math.round((y - this.ref_y) / this.square_size)
            };
        };
        Grid.prototype.addElement = function (element, column, line) {
            if (column < 0) {
                column = 0;
            }
            else if (column >= this.columns) {
                column = this.columns - 1;
            }
            if (line < 0) {
                line = 0;
            }
            else if (line >= this.lines) {
                line = this.lines - 1;
            }
            var previous = this._grid[column][line];
            this._grid[column][line] = element;
            var canvasPosition = this.toCanvas(column, line);
            element.x = canvasPosition.x;
            element.y = canvasPosition.y;
            element.column = column;
            element.line = line;
            if (previous !== null) {
                this.dispatchEvent('collision', {
                    element: element,
                    collidedWith: previous
                });
            }
            return previous;
        };
        Grid.prototype.moveElement = function (element, destColumn, destLine, duration) {
            return this.movePosition(element.column, element.line, destColumn, destLine, duration);
        };
        /*
            move an element to a different position in the grid
         */
        Grid.prototype.movePosition = function (sourceColumn, sourceLine, destColumn, destLine, duration) {
            var element = this._grid[sourceColumn][sourceLine];
            var previous = this._grid[destColumn][destLine];
            if (element === null || element === previous) {
                return null;
            }
            this._grid[destColumn][destLine] = element;
            this._grid[sourceColumn][sourceLine] = null;
            var canvasPosition = this.toCanvas(destColumn, destLine);
            element.column = destColumn;
            element.line = destLine;
            // move immediately
            if (typeof duration === 'undefined' || duration <= 0) {
                element.x = canvasPosition.x;
                element.y = canvasPosition.y;
            }
            else {
                var tween = new Game.Tween(element);
                tween.to({
                    x: canvasPosition.x,
                    y: canvasPosition.y
                }, duration);
                tween.start();
            }
            if (previous !== null) {
                previous.column = -1;
                previous.line = -1;
                this.dispatchEvent('collision', {
                    element: element,
                    collidedWith: previous
                });
            }
            return previous;
        };
        Grid.prototype.removeElement = function (element) {
            return this.removePosition(element.column, element.line);
        };
        Grid.prototype.removePosition = function (column, line) {
            if (!this.isInGrid(column, line)) {
                return null;
            }
            var previous = this._grid[column][line];
            this._grid[column][line] = null;
            if (previous !== null) {
                previous.column = -1;
                previous.line = -1;
            }
            return previous;
        };
        Grid.prototype.getElement = function (column, line) {
            if (!this.isInGrid(column, line)) {
                return null;
            }
            var element = this._grid[column][line];
            if (!element) {
                return null;
            }
            return element;
        };
        Grid.prototype.getElement2 = function (x, y) {
            var position = this.toGrid(x, y);
            return this.getElement(position.column, position.line);
        };
        Grid.prototype.isEmpty = function (column, line) {
            if (this._grid[column][line]) {
                return false;
            }
            return true;
        };
        Grid.prototype.normalizePosition = function (column, line) {
            if (column < 0) {
                column = 0;
            }
            else if (column >= this.columns) {
                column = this.columns - 1;
            }
            if (line < 0) {
                line = 0;
            }
            else if (line >= this.lines) {
                line = this.lines - 1;
            }
            return {
                column: column,
                line: line
            };
        };
        /*
            If this position is valid for this grid (is within it)
         */
        Grid.prototype.isInGrid = function (column, line) {
            if (column < 0 || column >= this.columns || line < 0 || line >= this.lines) {
                return false;
            }
            return true;
        };
        Grid.prototype.getRandomPosition = function () {
            return {
                column: Utilities.getRandomInt(0, this.columns - 1),
                line: Utilities.getRandomInt(0, this.lines - 1)
            };
        };
        Grid.prototype.getRandomEmptyPosition = function () {
            var empty = this.getEmptyPositions();
            if (empty.length > 0) {
                var index = Utilities.getRandomInt(0, empty.length - 1);
                return empty[index];
            }
            return null;
        };
        Grid.prototype.getEmptyPositions = function () {
            var emptyPositions = [];
            for (var column = 0; column < this.columns; column++) {
                for (var line = 0; line < this.lines; line++) {
                    if (this._grid[column][line] === null) {
                        emptyPositions.push({
                            column: column,
                            line: line
                        });
                    }
                }
            }
            return emptyPositions;
        };
        Grid.prototype.getDimensions = function () {
            return {
                x: this.ref_x,
                y: this.ref_y,
                width: this.square_size * this.columns,
                height: this.square_size * this.lines
            };
        };
        /*
            Clear grid related elements etc
    
            Called when we don't need the grid anymore
         */
        Grid.prototype.clear = function () {
            if (this._background !== null) {
                this._background.remove();
            }
        };
        /*
            Get the neighbor elements around the position given
         */
        Grid.prototype.getNeighbors = function (refColumn, refLine, range) {
            if (typeof range === 'undefined') {
                range = 1;
            }
            var neighbors = [];
            var start = this.normalizePosition(refColumn - range, refLine - range);
            var end = this.normalizePosition(refColumn + range, refLine + range);
            var element;
            for (var column = start.column; column <= end.column; column++) {
                for (var line = start.line; line <= end.line; line++) {
                    // don't include the reference position
                    if (!(column === refColumn && line === refLine)) {
                        element = this.getElement(column, line);
                        if (element !== null) {
                            neighbors.push(element);
                        }
                    }
                }
            }
            return neighbors;
        };
        return Grid;
    })(Game.EventDispatcher);
    Game.Grid = Grid;
})(Game || (Game = {}));
/// <reference path="bitmap.ts" />
var Game;
(function (Game) {
    /**
     * Basic usage:
     *
     *     var sprite = new Game.Sprite({
     *             x: 10,
     *             y: 20,
     *             image: Game.Preload.get( 'id' ),
     *             frameWidth: 30,
     *             frameHeight: 40,
     *             interval: 1,
     *             animations: {
     *                 animationName: [ 0, 1 ]
     *             }
     *         });
     *     Game.addElement( sprite );
     *
     *         // set a static frame
     *     sprite.setFrame( 1 );
     *
     *         // or play a specific animation
     *     sprite.play( 'animationName' );
     *
     * Examples:
     *
     *     - sprite
     */
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite(args) {
            _super.call(this, args);
            this.width = args.frameWidth;
            this.height = args.frameHeight;
            this._half_width = args.frameWidth / 2;
            this._half_height = args.frameHeight / 2;
            this._frames_per_line = Math.floor(args.image.width / args.frameWidth);
            this._current_animation_position = 0;
            this._count_interval = 0;
            this.setFrame(0);
            if (typeof args.animations === 'undefined') {
                this._animations = {};
                this.interval = 1;
            }
            else {
                this._animations = args.animations;
                this.interval = args.interval;
            }
        }
        Sprite.prototype.setFrame = function (frame) {
            var line = Math.floor(frame / this._frames_per_line);
            var column = frame - line * this._frames_per_line;
            this._source_x = column * this.width;
            this._source_y = line * this.height;
        };
        Sprite.prototype.play = function (animationId) {
            this._current_animation = this._animations[animationId];
            if (!this._current_animation) {
                return false;
            }
            this._has_logic = true;
            this._current_animation_position = 0;
            this.setFrame(this._current_animation[this._current_animation_position]);
            return true;
        };
        Sprite.prototype.nextFrame = function () {
            this._current_animation_position++;
            if (this._current_animation_position >= this._current_animation.length) {
                this._current_animation_position = 0;
            }
            this.setFrame(this._current_animation[this._current_animation_position]);
        };
        Sprite.prototype.logic = function (deltaTime) {
            this._count_interval += deltaTime;
            if (this._count_interval >= this.interval) {
                this._count_interval = 0;
                this.nextFrame();
            }
        };
        Sprite.prototype.clone = function () {
            return new Game.Sprite({
                x: this.x,
                y: this.y,
                image: this.image,
                frameWidth: this.width,
                frameHeight: this.height,
                animations: this._animations,
                interval: this.interval
            });
        };
        return Sprite;
    })(Game.Bitmap);
    Game.Sprite = Sprite;
})(Game || (Game = {}));
/// <reference path="element.ts" />
var Game;
(function (Game) {
    /**
     * Basic Usage:
     *
     *     var text = new Game.Text({
     *             x: 10,
     *             y: 20,
     *             text: 'Hi'
     *         });
     *     Game.addElement( text );
     */
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(args) {
            var _this = this;
            if (typeof args.text === 'undefined') {
                args.text = '';
            }
            if (typeof args.fontFamily === 'undefined') {
                args.fontFamily = 'monospace';
            }
            if (typeof args.fontSize === 'undefined') {
                args.fontSize = 20;
            }
            if (typeof args.textAlign === 'undefined') {
                args.textAlign = 'start';
            }
            if (typeof args.textBaseline === 'undefined') {
                args.textBaseline = 'top';
            }
            if (typeof args.fill === 'undefined') {
                args.fill = true;
            }
            _super.call(this, args);
            this._font_size = args.fontSize;
            this.text = args.text;
            this.font_family = args.fontFamily; // this calls the set method that updates ._font as well
            this.textAlign = args.textAlign;
            this.textBaseline = args.textBaseline;
            this.fill = args.fill;
            this._timeout = args.timeout;
            if (Utilities.isNumber(args.timeout) && args.timeout > 0) {
                var timeout = new Utilities.Timeout();
                timeout.start(function () {
                    _this.remove();
                }, args.timeout * 1000);
            }
        }
        Text.prototype.drawElement = function (ctx) {
            ctx.save();
            ctx.globalAlpha *= this.opacity;
            ctx.font = this._font;
            ctx.textAlign = this.textAlign;
            ctx.textBaseline = this.textBaseline;
            var length = this._lines.length;
            for (var a = 0; a < length; a++) {
                var y = this.y + a * this.font_size;
                if (this.fill) {
                    ctx.fillText(this._lines[a], this.x, y);
                }
                else {
                    ctx.strokeText(this._lines[a], this.x, y);
                }
            }
            ctx.restore();
        };
        Object.defineProperty(Text.prototype, "text", {
            get: function () {
                return this._text;
            },
            set: function (value) {
                this._text = value;
                this._lines = this._text.split('\n');
                var ctx = Game.getCanvas().getCanvasContext();
                var line = this._lines[0];
                var highestWidth = ctx.measureText(line).width;
                var width;
                var length = this._lines.length;
                for (var a = 1; a < length; a++) {
                    line = this._lines[a];
                    width = ctx.measureText(line).width;
                    if (width > highestWidth) {
                        highestWidth = width;
                    }
                }
                this.width = highestWidth;
                this.height = this.font_size * length; // 'font_size' not quite the same thing as height, but there's no way to determine the height right now so..
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text.prototype, "font_family", {
            get: function () {
                return this._font_family;
            },
            set: function (font) {
                this._font_family = font;
                this._font = this._font_size + 'px ' + font;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text.prototype, "font_size", {
            get: function () {
                return this._font_size;
            },
            set: function (size) {
                this._font_size = size;
                this._font = size + 'px ' + this._font_family;
            },
            enumerable: true,
            configurable: true
        });
        Text.prototype.clone = function () {
            return new Game.Text({
                x: this.x,
                y: this.y,
                text: this._text,
                fontFamily: this._font_family,
                fontSize: this._font_size,
                timeout: this._timeout,
                textAlign: this.textAlign,
                textBaseline: this.textBaseline,
                fill: this.fill
            });
        };
        return Text;
    })(Game.Element);
    Game.Text = Text;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Sound;
    (function (Sound) {
        var CTX;
        function init() {
            CTX = new AudioContext();
        }
        Sound.init = init;
        function decodeAudio(data, callback) {
            CTX.decodeAudioData(data, callback);
        }
        Sound.decodeAudio = decodeAudio;
        function play(audioBuffer) {
            var source = CTX.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(CTX.destination);
            source.start();
        }
        Sound.play = play;
    })(Sound = Game.Sound || (Game.Sound = {}));
})(Game || (Game = {}));
/// <reference path="event_dispatcher.ts" />
/// <reference path="sound.ts" />
var Game;
(function (Game) {
    /**
     * Basic Usage:
     *
     *     var preload = new Game.Preload({ save_global: true });
     *
     *     preload.addEventListener( 'complete', completeListener );
     *     preload.load( 'id', 'path_to_file.png' );
     *
     *         // or with a manifest
     *     var manifest = [
     *             { id: 'the_id', path: 'path_to_file.png' }
     *         ];
     *     preload.loadManifest( manifest, '' );
     *
     *
     * Examples:
     *     - preload
     *
     *
     * Events:
     *     - complete -- all files loaded
     *     - error -- an error occurred
     *     - abort -- canceled by the user
     *     - progress -- progress of the queue
     *     - fileload -- a file loaded
     *
     * Listeners:
     *     - complete_listeners()
     *     - error_listeners( data: { id: string; event; } )
     *     - abort_listeners( data: { id: string; event; } )
     *     - progress_listeners( progress: number )
     *     - fileload_listeners( data: { id: string; data: Object; } )
     */
    var Preload = (function (_super) {
        __extends(Preload, _super);
        function Preload(args) {
            _super.call(this, args);
            var saveGlobal = false;
            if (typeof args !== 'undefined') {
                if (Utilities.isBoolean(args.save_global)) {
                    saveGlobal = args.save_global;
                }
            }
            this._total_items = 0;
            this._loaded_items = 0;
            this.save_global = saveGlobal;
            this._data = {};
        }
        Preload.prototype._loaded = function (id, data) {
            if (this.save_global) {
                Game.Preload.DATA[id] = data;
            }
            else {
                this._data[id] = data;
            }
            this.dispatchEvent('fileload', { id: id, data: data });
            this._loaded_items++;
            if (this._loaded_items >= this._total_items) {
                this.dispatchEvent('complete');
            }
        };
        Preload.prototype._on_error = function (event, id) {
            this.dispatchEvent('error', { event: event, id: id });
        };
        Preload.prototype._on_abort = function (event, id) {
            this.dispatchEvent('abort', { event: event, id: id });
        };
        Preload.prototype._on_progress = function (event) {
            var fileProgress = 0;
            if (event.lengthComputable) {
                fileProgress = event.loaded / event.total;
            }
            var progress = Math.round((fileProgress + this._loaded_items) / this._total_items * 100);
            this.dispatchEvent('progress', progress);
        };
        /**
            Load a file.
    
            @param id - the id to be used later on to get the element
            @param path - path to the file
            @param typeId - type of the file to load. If not provided then it will try to determine the type from the file extension.
         */
        Preload.prototype.load = function (id, path, typeId) {
            var type;
            if (typeof type === 'undefined') {
                type = Game.Preload.getType(path);
            }
            else {
                type = Game.Preload.TYPES[typeId];
            }
            if (!type) {
                throw new Error('Invalid file type.');
            }
            var _this = this;
            this._total_items++;
            var request = new XMLHttpRequest();
            request.responseType = Game.Preload.RESPONSE_TYPE[type];
            // add the request events
            request.addEventListener('error', function (event) {
                _this._on_error(event, id);
            });
            request.addEventListener('abort', function (event) {
                _this._on_abort(event, id);
            });
            request.addEventListener('progress', function (event) {
                _this._on_progress(event);
            });
            request.addEventListener('load', function (event) {
                var response = this.response;
                if (type === 'image') {
                    var image = new Image();
                    image.src = window.URL.createObjectURL(response);
                    image.onload = function () {
                        _this._loaded(id, image);
                    };
                }
                else if (type === 'json') {
                    _this._loaded(id, response);
                }
                else if (type === 'audio') {
                    Game.Sound.decodeAudio(response, function (audioBuffer) {
                        if (!audioBuffer) {
                            console.log('Error decoding audio file:', id, path);
                            return;
                        }
                        _this._loaded(id, audioBuffer);
                    });
                }
                else {
                    _this._loaded(id, response);
                }
            }, false);
            request.open('get', path, true);
            request.send();
        };
        /**
            Load several files.
    
            @param manifest - Has the information about the files.
            @param basePath - Base path for all the files in the manifest.
         */
        Preload.prototype.loadManifest = function (manifest, basePath) {
            var length = manifest.length;
            if (typeof basePath === 'undefined') {
                basePath = '';
            }
            for (var a = 0; a < length; a++) {
                var file = manifest[a];
                this.load(file.id, basePath + file.path);
            }
        };
        /**
            Get a previously loaded file.
    
            @param id - The id of the file.
         */
        Preload.prototype.get = function (id) {
            return this._data[id];
        };
        return Preload;
    })(Game.EventDispatcher);
    Game.Preload = Preload;
    var Preload;
    (function (Preload) {
        // supported file types
        (function (TYPES) {
            TYPES[TYPES["image"] = 0] = "image";
            TYPES[TYPES["json"] = 1] = "json";
            TYPES[TYPES["text"] = 2] = "text";
            TYPES[TYPES["audio"] = 3] = "audio";
        })(Preload.TYPES || (Preload.TYPES = {}));
        var TYPES = Preload.TYPES;
        // file extensions of each type
        Preload.EXTENSIONS = {
            image: ['png', 'jpg', 'jpeg'],
            json: ['json'],
            text: ['txt'],
            audio: ['ogg', 'mp3']
        };
        // XMLHttpRequest response type of each file type
        Preload.RESPONSE_TYPE = {
            image: 'blob',
            json: 'json',
            text: 'text',
            audio: 'arraybuffer'
        };
        // key is the 'id'
        // value is the 'data'
        Preload.DATA = {};
        function get(id) {
            return Preload.DATA[id];
        }
        Preload.get = get;
        function getType(file) {
            var extension = file.split('.').pop();
            for (var type in Preload.EXTENSIONS) {
                if (Preload.EXTENSIONS.hasOwnProperty(type)) {
                    if (Preload.EXTENSIONS[type].indexOf(extension) >= 0) {
                        return type;
                    }
                }
            }
            return null;
        }
        Preload.getType = getType;
    })(Preload = Game.Preload || (Game.Preload = {}));
})(Game || (Game = {}));
/// <reference path="element.ts" />
var Game;
(function (Game) {
    var Rectangle = (function (_super) {
        __extends(Rectangle, _super);
        function Rectangle(args) {
            _super.call(this, args);
            if (typeof args.fill === 'undefined') {
                args.fill = true;
            }
            this.fill = args.fill;
            this.width = args.width;
            this.height = args.height;
            this.half_width = args.width / 2;
            this.half_height = args.height / 2;
            this.color = args.color;
        }
        Rectangle.prototype.drawElement = function (ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.globalAlpha *= this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            if (this.fill) {
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.half_width, -this.half_height, this.width, this.height);
            }
            else {
                ctx.strokeStyle = this.color;
                ctx.strokeRect(-this.half_width, -this.half_height, this.width, this.height);
            }
            ctx.restore();
        };
        Rectangle.prototype.intersect = function (x, y, event) {
            var refX = 0;
            var refY = 0;
            if (this._container !== null) {
                refX = this._container.x;
                refY = this._container.y;
            }
            if (Utilities.pointBoxCollision(x, y, refX + this.x - this.half_width, refY + this.y - this.half_height, this.width, this.height)) {
                this.dispatchEvent(event.type, { event: event });
                return true;
            }
            return false;
        };
        Rectangle.prototype.clone = function () {
            return new Game.Rectangle({
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                color: this.color,
                fill: this.fill
            });
        };
        return Rectangle;
    })(Game.Element);
    Game.Rectangle = Rectangle;
})(Game || (Game = {}));
/// <reference path="canvas.ts" />
/// <reference path="html.ts" />
/// <reference path="highscore.ts" />
/// <reference path="message.ts" />
/// <reference path="tween.ts" />
/// <reference path="grid.ts" />
/// <reference path="bullet.ts" />
/// <reference path="sprite.ts" />
/// <reference path="text.ts" />
/// <reference path="sound.ts" />
/// <reference path="container.ts" />
/// <reference path="event_dispatcher.ts" />
/// <reference path="preload.ts" />
/// <reference path="element.ts" />
/// <reference path="rectangle.ts" />
/// <reference path="circle.ts" />
/// <reference path="utilities/utilities.1.7.0.d.ts" />
/// <reference path="typings/tsd.d.ts" />
var Game;
(function (Game) {
    var ALL_CANVAS = [];
    var CANVAS_CONTAINER;
    var TIME;
    var ANIMATION_ID;
    var CALLBACKS = [];
    function init(htmlContainer, canvasWidth, canvasHeight) {
        CANVAS_CONTAINER = document.createElement('div');
        CANVAS_CONTAINER.id = 'Game-canvasContainer';
        htmlContainer.appendChild(CANVAS_CONTAINER);
        var canvas = new Game.Canvas({
            width: canvasWidth,
            height: canvasHeight
        });
        Game.addCanvas(canvas);
        Game.Sound.init();
        Game.Bullet.init();
        CANVAS_CONTAINER.addEventListener('click', mouseEvents);
        var timeHidden = new Date().getTime();
        document.addEventListener('visibilitychange', function (event) {
            if (document.hidden) {
                stopGameLoop();
            }
            else {
                startGameLoop();
            }
        });
        startGameLoop();
    }
    Game.init = init;
    function startGameLoop() {
        TIME = new Date().getTime();
        loop();
    }
    Game.startGameLoop = startGameLoop;
    function stopGameLoop() {
        window.cancelAnimationFrame(ANIMATION_ID);
    }
    Game.stopGameLoop = stopGameLoop;
    /**
        @param id - Id of the canvas, returns the first one (id 0) by default.
     */
    function getCanvas(id) {
        if (typeof id === 'undefined') {
            id = 0;
        }
        return ALL_CANVAS[id];
    }
    Game.getCanvas = getCanvas;
    /**
        @param canvas - the canvas to be added
        @param position - the desired position of the canvas. The canvas are stacked on the same space. The 0 position, is the one in the back, and the higher the value, the most on top. Keep in mind that the position may not be the same as the returned id. If not provided, then the canvas is added on top (last position).
        @return - The id of the canvas. Can be used to retrieve the canvas later on with Game.getCanvas(). The id can be invalidated if there's new canvas added in a specific position.
     */
    function addCanvas(canvas, position) {
        if (Utilities.isNumber(position)) {
            if (position < 0) {
                position = 0;
            }
            else if (position > ALL_CANVAS.length) {
                position = ALL_CANVAS.length;
            }
        }
        else {
            // add at the end
            position = ALL_CANVAS.length;
        }
        var previous = ALL_CANVAS[position];
        ALL_CANVAS.splice(position, 0, canvas);
        if (previous) {
            CANVAS_CONTAINER.insertBefore(canvas._canvas, previous._canvas);
        }
        else {
            CANVAS_CONTAINER.appendChild(canvas._canvas);
        }
        return position;
    }
    Game.addCanvas = addCanvas;
    /**
        Adds an element to a canvas. If 'id' is not given, then its added to the first canvas (the one most to the back).
    
        @param element - Element or Element[]
        @param id - The canvas id
     */
    function addElement(element, id) {
        if (typeof id === 'undefined') {
            id = 0;
        }
        return ALL_CANVAS[id].addElement(element);
    }
    Game.addElement = addElement;
    /*
        For when you don't know in what canvas the element is in. It will try in all the canvas.
     */
    function removeElement(element) {
        for (var a = ALL_CANVAS.length - 1; a >= 0; a--) {
            var canvas = ALL_CANVAS[a];
            var removed = canvas.removeElement(element);
            if (removed) {
                return true;
            }
        }
        return false;
    }
    Game.removeElement = removeElement;
    /**
        Adds a callback function to be called at a certain interval (or every tick) in the game loop (before the draw phase)
    
        @param callback - the callback
        @param interval - interval between function calls. If not given then it is called every tick. In seconds.
        @return - If it was added successful
     */
    function addToGameLoop(callback, interval) {
        if (!Utilities.isFunction(callback)) {
            return false;
        }
        if (!Utilities.isNumber(interval) || interval <= 0) {
            interval = -1;
        }
        CALLBACKS.push({
            callback: callback,
            interval: interval,
            count: 0
        });
        return true;
    }
    Game.addToGameLoop = addToGameLoop;
    /*
        Remove a callback from the game loop
     */
    function removeFromGameLoop(callback) {
        for (var a = CALLBACKS.length - 1; a >= 0; a--) {
            var callInfo = CALLBACKS[a];
            if (callInfo.callback === callback) {
                CALLBACKS.splice(a, 1);
                return true;
            }
        }
        return false;
    }
    Game.removeFromGameLoop = removeFromGameLoop;
    function removeAllCallbacks() {
        CALLBACKS.length = 0;
    }
    Game.removeAllCallbacks = removeAllCallbacks;
    function mouseEvents(event) {
        for (var a = ALL_CANVAS.length - 1; a >= 0; a--) {
            var canvas = ALL_CANVAS[a];
            if (canvas.events_enabled) {
                canvas.mouseEvents(event);
            }
        }
    }
    function loop() {
        // find the delta time
        var now = new Date().getTime();
        // time since the last update (in seconds)
        var delta = (now - TIME) / 1000;
        TIME = now;
        // call any function added to the game loop
        callbacks(delta);
        // update all the tweens
        Game.Tween.update(delta);
        for (var a = ALL_CANVAS.length - 1; a >= 0; a--) {
            var canvas = ALL_CANVAS[a];
            if (canvas.update_on_loop) {
                // call any game logic (from units/etc)
                canvas.logic(delta);
                // draw all the elements to the canvas
                canvas.draw();
            }
        }
        ANIMATION_ID = window.requestAnimationFrame(loop);
    }
    function callbacks(deltaTime) {
        for (var a = CALLBACKS.length - 1; a >= 0; a--) {
            var call = CALLBACKS[a];
            if (call.interval <= 0) {
                call.callback();
            }
            else {
                call.count += deltaTime;
                if (call.count >= call.interval) {
                    call.count = 0;
                    call.callback();
                }
            }
        }
    }
    function getCanvasContainer() {
        return CANVAS_CONTAINER;
    }
    Game.getCanvasContainer = getCanvasContainer;
})(Game || (Game = {}));
/// <reference path="container.ts" />
var Game;
(function (Game) {
    (function (UnitMovement) {
        UnitMovement[UnitMovement["stop"] = 0] = "stop";
        UnitMovement[UnitMovement["angle"] = 1] = "angle";
        UnitMovement[UnitMovement["destination"] = 2] = "destination";
        UnitMovement[UnitMovement["loop"] = 3] = "loop"; // move between some x/y positions
    })(Game.UnitMovement || (Game.UnitMovement = {}));
    var UnitMovement = Game.UnitMovement;
    var Unit = (function (_super) {
        __extends(Unit, _super);
        function Unit(args) {
            _super.call(this, args);
            if (typeof args.movement_speed === 'undefined') {
                args.movement_speed = 50;
            }
            if (typeof args.health === 'undefined') {
                args.health = 1;
            }
            if (typeof args.bullet_movement_speed === 'undefined') {
                args.bullet_movement_speed = 100;
            }
            if (typeof args.bullet_shape === 'undefined') {
                args.bullet_shape = null;
            }
            this._has_logic = true;
            this.movement_speed = args.movement_speed;
            this.bullet_movement_speed = args.bullet_movement_speed;
            this.health = args.health;
            this._movement_type = 0 /* stop */;
            this._is_moving = false;
            this._move_x = 0;
            this._move_y = 0;
            this._move_callback = null;
            this._destination_x = 0;
            this._destination_y = 0;
            this._path = [];
            this._loop_path_position = 0;
            this._is_destination_x_diff_positive = false;
            this._is_destination_y_diff_positive = false;
            this._bullet_interval = -1;
            this._bullet_interval_count = 0;
            this._angle_or_target = null;
            this._bullets = [];
            this._bullet_shape = args.bullet_shape;
            // init the static variables of the class (if its not yet)
            var constructor = this.constructor;
            if (typeof constructor._all === 'undefined') {
                constructor._all = [];
            }
            if (typeof constructor.collidesWith === 'undefined') {
                constructor.collidesWith = [];
            }
            constructor._all.push(this);
        }
        /**
            @param animationDuration - If this is passed, then the unit's opacity will be animated until it reaches 0, and only then will the unit be removed
         */
        Unit.prototype.remove = function (animationDuration) {
            if (typeof animationDuration === 'undefined') {
                this._removeNow();
            }
            else {
                var tween = new Game.Tween(this);
                var _this = this;
                tween.to({
                    opacity: 0
                }, animationDuration).call(function () {
                    _this._removeNow();
                });
                tween.start();
            }
        };
        Unit.prototype._removeNow = function () {
            _super.prototype.remove.call(this);
            var constructor = this.constructor;
            var all = constructor._all;
            var index = all.indexOf(this);
            all.splice(index, 1);
        };
        /**
            Clears any previous path, and forces the unit to move to the specified position.
         */
        Unit.prototype.moveTo = function (x, y, callback) {
            if (!Utilities.isFunction(callback)) {
                callback = null;
            }
            this._movement_type = 2 /* destination */;
            this._path.length = 0;
            this._path.push({
                x: x,
                y: y,
                callback: callback
            });
            this.movementLogic = this.movementPathLogic;
            this.moveToNext();
        };
        /**
            Move the next position in the path
         */
        Unit.prototype.moveToNext = function () {
            var next;
            if (this._movement_type === 3 /* loop */) {
                this._loop_path_position++;
                if (this._loop_path_position >= this._path.length) {
                    this._loop_path_position = 0;
                }
                next = this._path[this._loop_path_position];
            }
            else {
                next = this._path.shift();
            }
            if (next) {
                var x = next.x;
                var y = next.y;
                this._is_moving = true;
                this._destination_x = x;
                this._destination_y = y;
                this._move_callback = next.callback;
                this._is_destination_x_diff_positive = x - this.x > 0;
                this._is_destination_y_diff_positive = y - this.y > 0;
                var angleRads = Utilities.calculateAngle(this.x, this.y * -1, x, y * -1);
                this._move_x = Math.cos(angleRads) * this.movement_speed;
                this._move_y = Math.sin(angleRads) * this.movement_speed;
                return true;
            }
            else {
                this._is_moving = false;
            }
            return false;
        };
        Unit.prototype.stop = function () {
            this._movement_type = 0 /* stop */;
            this._path.length = 0;
            this._is_moving = false;
        };
        Unit.prototype.queueMoveTo = function (x, y, callback) {
            if (!Utilities.isFunction(callback)) {
                callback = null;
            }
            this._path.push({
                x: x,
                y: y,
                callback: callback
            });
        };
        Unit.prototype.moveLoop = function (path) {
            this._movement_type = 3 /* loop */;
            this._path = path;
            this._loop_path_position = -1; // will be added in .moveToNext() and so will start at the 0 position
            this.movementLogic = this.movementPathLogic;
            this.moveToNext();
        };
        /**
            Move continuously in a specific angle
    
            @angle - the angle of the direction. Positive clockwise.
            @degrees - If the 'angle' value is in degrees or radians
            @callback - To be called when it reaches the end of the canvas
         */
        Unit.prototype.moveAngle = function (angle, degrees, callback) {
            if (degrees === true) {
                angle = Math.PI / 180 * angle;
            }
            this._movement_type = 1 /* angle */;
            this._is_moving = true;
            this._move_x = Math.cos(angle) * this.movement_speed;
            this._move_y = Math.sin(angle) * this.movement_speed;
            this.rotation = angle;
            this._move_callback = callback;
            this.movementLogic = this.movementAngleLogic;
        };
        /**
            @param angleOrTarget {Number|Element} - The angle of the bullet movement. If not given, then the bullet will have the unit's current rotation angle. Can be passed an Element which will work as the target of the bullet (it will follow the target until it hits it).
            @param interval - If you want to keep firing bullets at the same angle (or same target). Pass a positive number for that.
         */
        Unit.prototype.fireBullet = function (angleOrTarget, interval) {
            if (typeof angleOrTarget === 'undefined') {
                angleOrTarget = this.rotation;
            }
            if (Utilities.isNumber(interval) && interval > 0) {
                this._bullet_interval = interval;
                this._bullet_interval_count = 0;
                this._angle_or_target = angleOrTarget; // only save the target reference if we're going to continue firing at it
            }
            this._fire(angleOrTarget);
        };
        Unit.prototype.stopFiring = function () {
            this._bullet_interval = -1;
            this._bullet_interval_count = 0;
            this._angle_or_target = null;
        };
        Unit.prototype._fire = function (angleOrTarget) {
            var _this = this;
            if (typeof angleOrTarget === 'undefined') {
                angleOrTarget = this._angle_or_target;
            }
            // if it happens to be a target, need to make sure it hasn't been removed yet
            if (typeof angleOrTarget !== 'number') {
                if (angleOrTarget._removed === true) {
                    this.stopFiring();
                    return;
                }
            }
            var shape;
            if (this._bullet_shape !== null) {
                shape = new this._bullet_shape.classRef(this._bullet_shape.args);
            }
            else {
                shape = new Game.Rectangle({
                    width: 10,
                    height: 2,
                    color: 'blue'
                });
            }
            var bullet = new Game.Bullet({
                x: this.x,
                y: this.y,
                angleOrTarget: angleOrTarget,
                movement_speed: this.bullet_movement_speed,
                remove: function () {
                    var index = _this._bullets.indexOf(bullet);
                    _this._bullets.splice(index, 1);
                    bullet.remove();
                }
            });
            bullet.addChild(shape);
            this._bullets.push(bullet);
        };
        Unit.prototype.movementLogic = function (delta) {
            // this is going to be assigned to a different movement logic method, depending on the current movement type
        };
        /*
            Deals with movement in a certain direction/angle.
    
            Calls the function callback when it reaches the end of the canvas.
         */
        Unit.prototype.movementAngleLogic = function (delta) {
            if (this._is_moving) {
                this.x += this._move_x * delta;
                this.y += this._move_y * delta;
                if (!Game.getCanvas().isInCanvas(this.x, this.y)) {
                    if (this._move_callback) {
                        this._move_callback();
                    }
                }
            }
        };
        /*
            Deals with movement to a x/y position.
    
            Calls the function callback when it reaches the destination.
         */
        Unit.prototype.movementPathLogic = function (delta) {
            if (this._is_moving) {
                this.x += this._move_x * delta;
                this.y += this._move_y * delta;
                var diffX = this._destination_x - this.x;
                var diffY = this._destination_y - this.y;
                // going from a positive difference to a negative
                // we switch the signal so that we only need to check >= 0 below
                if (this._is_destination_x_diff_positive) {
                    diffX *= -1;
                }
                if (this._is_destination_y_diff_positive) {
                    diffY *= -1;
                }
                // means we reached the destination
                if (diffX >= 0 && diffY >= 0) {
                    this.x = this._destination_x;
                    this.y = this._destination_y;
                    if (this._move_callback) {
                        this._move_callback();
                    }
                    this.moveToNext();
                }
            }
        };
        Unit.prototype.firingLogic = function (delta) {
            if (this._bullet_interval > 0) {
                this._bullet_interval_count += delta;
                if (this._bullet_interval_count >= this._bullet_interval) {
                    this._fire();
                    this._bullet_interval_count = 0;
                }
            }
        };
        Unit.prototype.collisionLogic = function (delta) {
            var constructor = this.constructor;
            var length = constructor.collidesWith.length;
            if (length > 0 && this.hasListeners('collision')) {
                var x = this.x - this.width / 2;
                var y = this.y - this.height / 2;
                var width = this.width;
                var height = this.height;
                for (var a = 0; a < length; a++) {
                    var all = constructor.collidesWith[a]._all;
                    for (var b = all.length - 1; b >= 0; b--) {
                        var unit = all[b];
                        // can't collide with itself
                        if (unit === this) {
                            continue;
                        }
                        var unitWidth = unit.width;
                        var unitHeight = unit.height;
                        var unitX = unit.x - unitWidth / 2;
                        var unitY = unit.y - unitHeight / 2;
                        if (Utilities.boxBoxCollision(x, y, width, height, unitX, unitY, unitWidth, unitHeight)) {
                            this.dispatchEvent('collision', {
                                element: this,
                                collidedWith: unit
                            });
                            return;
                        }
                        for (var c = this._bullets.length - 1; c >= 0; c--) {
                            var bullet = this._bullets[c];
                            if (Utilities.boxBoxCollision(bullet.x - bullet.width / 2, bullet.y - bullet.height / 2, bullet.width, bullet.height, unitX, unitY, unitWidth, unitHeight)) {
                                this.dispatchEvent('collision', {
                                    element: this,
                                    collidedWith: unit
                                });
                                return;
                            }
                        }
                    }
                }
            }
        };
        Unit.prototype.logic = function (delta) {
            this.movementLogic(delta);
            this.firingLogic(delta);
            this.collisionLogic(delta);
        };
        Unit.prototype.clone = function () {
            var children = [];
            var length = this._children.length;
            for (var a = 0; a < length; a++) {
                children.push(this._children[a].clone());
            }
            return new Game.Unit({
                x: this.x,
                y: this.y,
                children: children,
                movement_speed: this.movement_speed,
                bullet_movement_speed: this.bullet_movement_speed,
                health: this.health,
                bullet_shape: this._bullet_shape
            });
        };
        return Unit;
    })(Game.Container);
    Game.Unit = Unit;
})(Game || (Game = {}));
