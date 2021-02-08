function Slider(el, min, max, value) {
    this.min = min || 0;
    this.max = max || 10;
    this.value = value || 0;
    this.disabled = false;
    this.targetElement = el;
    this.rail = undefined;
    this.wheel = undefined;
    this.observable = undefined;
    this.dragNDrop = undefined;

    this.build = function () {
        this.rail = document.createElement("div");
        this.wheel = document.createElement("div");
        this.rail.className += "rail";
        this.wheel.className += "wheel";
        this.rail.appendChild(this.wheel);
        this.targetElement.appendChild(this.rail);
        this.dragNDrop = new DragNDrop(
            this.wheel,
            this.valueChanged.bind(this),
            this.valToPercents(this.value)
        );
        this.dragNDrop.build();
        return this;
    };

    this.getValueChanges = function () {
        if (!this.observable) this.observable = new Observable();
        return this.observable;
    };

    this.percentsToVal = function (percents) {
        return this.min + Math.round(((this.max - this.min) * percents) / 100);
    };

    this.valToPercents = function (val) {
        return Math.round(((val - this.min) / this.max) * 100);
    };

    this.valueChanged = function (percents) {
        const newVal = this.percentsToVal(percents);
        if (newVal !== this.value) {
            this.value = newVal;
            if (this.observable) this.observable.onEvent(this.value);
        }
    };

    return this;
}

function Observable() {
    this.subs = [];
    this.subscribe = function (callback) {
        this.subs.push(callback);
        return {
            unsubscribe: this.unsubscribe.bind(this, this.subs.length - 1),
        };
    };
    this.unsubscribe = function (index) {
        this.subs = this.subs.filter((_, i) => i !== index);
    };
    this.onEvent = function (data) {
        this.subs.forEach((callback) => {
            callback.call(null, data);
        });
    };
}

function DragNDrop(el, callback, initPos) {
    this.fieldRects = undefined;
    this.draggable = el;
    this.startDrag = undefined;
    this.initPos = initPos;

    this.mouseUp = function (moveHandler) {
        this.draggable.classList.remove("active", "wheel-animation");
        document.removeEventListener("mousemove", moveHandler);
    };
    this.mouseDown = function (e, moveHandler) {
        this.start = e.clientX;
        this.initPos = this.draggable.offsetLeft;
        this.draggable.classList.add("active", "wheel-animation");
        document.addEventListener("mousemove", moveHandler);
    };

    this.mouseMove = function (e) {
        const newPos =
            ((this.initPos + e.clientX - this.start) / this.fieldRects.width) *
            100;
        if (newPos >= 0 && newPos <= 100) {
            this.setPosition(newPos + "%");
            callback(Math.round(newPos));
        }
    };

    this.setPosition = function (newPos) {
        this.draggable.style.left = newPos;
    };

    this.build = function () {
        this.fieldRects = this.draggable.parentElement.getClientRects()[0];
        const moveHandler = this.mouseMove.bind(this);
        this.setPosition(this.initPos + "%");
        this.draggable.addEventListener("mousedown", (e) => {
            this.mouseDown(e, moveHandler);
            document.addEventListener(
                "mouseup",
                this.mouseUp.bind(this, moveHandler),
                {
                    useCapture: false,
                    once: true,
                }
            );
        });
    };
}
