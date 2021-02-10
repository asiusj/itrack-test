function Consumer() {
    this.qq = "s1";
    this.eat = function () {
        console.log(this.name + " can eat and want it");
    };
    this.go = function (target) {
        console.log(this.name + target);
    };
}

function King(name) {
    Person.call(this, name);
    this.go = this.go.bind(this, " can go to hell");
}

function Pleb(name) {
    Person.call(this, name);
    this.go = this.go.bind(this, " can go to work, can not go to work");
}

function Person(name, age, gender) {
    Consumer.call(this);
    this.name = name || "Somebody";
    this.age = age || 33;
    this.gender = gender || "male";
}

function NewClass() {
    Consumer.call(this);
}

const obj = new NewClass();
obj.qq = "lala";
const obj2 = new Pleb();

console.log(obj.qq);
console.log(obj2.qq);

const pleb = new Pleb("Vanya");
const king = new King("Cesar");
pleb.go();
pleb.eat();
king.go();

function ProtoExtentds() {
    this.count = 0;
    this.finish = 5;
    Consumer.call(this);
    this.go = function () {
        if (this.count < this.finish) {
            console.log("step: " + this.count);
            this.count++;
            this.go();
        }
    };

    Object.setPrototypeOf(this, Consumer);
}

const counter = new ProtoExtentds();
counter.go();

class Entity2D {
    mass = 1;
    constructor(x = 0, y = 0, m = Entity2D.mass) {
        this.x = x;
        this.y = y;
        this.mass = m;
    }

    pos = function () {
        console.log("X: ", this.x, "\nY: ", this.y);
    };

    mass() {
        return this.mass;
    }
}

class Entity3D extends Entity2D {
    mass = 3;
    constructor(x = 0, y = 0, z = 0, m = Entity3D.mass) {
        super(x, y, m);
        this.z = z;
    }

    pos = function () {
        console.log("X: ", this.x, "\nY: ", this.y, "\nZ: ", this.z);
    };
}

const cat2d = new Entity2D(10, 10, 3);
const dog3d = new Entity3D(0, 0, 100);
