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
