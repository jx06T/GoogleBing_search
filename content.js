const IMG_URL = "https://raw.githubusercontent.com/jx06T/PetPal__ChromeExtensions/main/images/"
let MouseX = 0;
let MouseY = 0;
let isMouseDown = false;
const DELAY = 50
let testD = 0
let testd = 1
function GetRandXY() {
    return [Math.random() * (window.innerWidth - 140) + 70, Math.random() * (window.innerHeight - 160) + 80]
}
function ResetAllPet() {
    for (const Pet of Pets) {
        Pet.state = 5
    }
}

// -----------------------------------------------------------------------
class aPet {
    // 建構函式
    constructor(x, y, size, color = 0) {
        this.size = size
        this.color = color
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.d = 90;
        this.speed = 6

        this.destination = [x, y]
        this.distance = 0
        this.timer = 7
        this.state = 0//0沒事,1遊走,2跟隨,4轉圈,5冷靜,6吃魚,7睡覺
        this.touchM = 0
        this.food

        const myimg = document.createElement("img");
        myimg.src = IMG_URL + "pet_rest.gif"
        myimg.setAttribute("class", "jx06pet");
        document.body.insertBefore(myimg, document.body.firstChild);
        myimg.style.position = 'fixed';
        // myimg.style.position = 'absolute';
        myimg.style.height = size + "px";
        myimg.style.left = x + "px";
        myimg.style.top = y + "px";
        myimg.style.filter = "blur(0px) hue-rotate(" + color + "deg)";
        this.img = myimg
    }
    move() {
        if (this.state == 0 || this.state == 5 || this.state == 7) {
            if (this.state == 7 && this.touchM > 0) {
                if (isMouseDown) {
                    this.x = MouseX
                    this.y = MouseY
                } else {
                    this.touchM = 0
                }
            }
            this.vx = 0
            this.vy = 0
            this.d = 0
            return
        }
        if (this.state == 6 || this.distance < 0.5 && (this.state == 1 || this.state == 2)) {
            if (this.state == 6) {
                this.speed = 5 + 5 * fishes.length
                this.food = fishes[Math.floor(Math.random() * fishes.length)]
                this.destination = [this.food.x, this.food.y]
            } else {
                this.speed = 6
                this.destination = MouseX + MouseY > 1 && this.state == 2 ? [MouseX, MouseY] : GetRandXY()
                this.x -= this.vx
                this.y -= this.vy
            }
            this.vx = this.destination[0] - this.x
            this.vy = this.destination[1] - this.y
            this.distance = Math.sqrt(this.vx * this.vx + this.vy * this.vy) / this.speed
            this.vx = this.vx / this.distance
            this.vy = this.vy / this.distance
        }
        if (this.state == 4) {
            this.d = this.d + this.speed * ((this.touchM / 1.8) + 1)
            return
        }

        this.distance -= this.state == 2 ? 1.4 : this.state == 1 ? 1.1 : 2.1

        // if (this.vy < 2.5) {
        //     this.d = this.vx * 6 / (this.speed / 8)
        // } else {
        //     this.d += this.vx * 4.5
        // }
        this.d = (180 / Math.PI) * (this.vx > 0 ? Math.atan(this.vy / this.vx) : Math.PI + Math.atan(this.vy / this.vx)) + 90 + testD

        this.x += this.vx
        this.y += this.vy

    }
    set() {
        if (fishes.length > 0) {
            if (this.state != 6) {
                this.ChangeState(6, IMG_URL + "pet_walk.gif", 10, 14)
            } else if (this.distance < 0.5) {
                this.food.eaten()
                this.ChangeState(5, IMG_URL + "pet_rest.gif", 24, 28)
                this.vx = 0
                this.vy = 0
                ResetAllPet()
            }
        }
        this.timer -= DELAY / 1000
        if (this.timer < 0) {
            if (this.state == 0) {
                this.ChangeState(1, IMG_URL + "pet_walk.gif", 4, 7)
            } else if (this.state == 4 || this.state == 1 || this.state == 2) {
                this.timer = this.state == 4 ? 18 : this.state == 1 ? 7 : 10
                this.ChangeState(this.state == 4 ? 5 : 0, IMG_URL + "pet_rest.gif", null)
            }

        }
        if (Math.sqrt((this.x - MouseX) * (this.x - MouseX) + (this.y - MouseY) * (this.y - MouseY)) < this.size * 0.35) {
            this.touchM = this.touchM + 1
            if (this.state == 0 || this.state == 1) {
                this.ChangeState(2, IMG_URL + "pet_walk.gif", 20, 24, 0)
                return
            }
            if (this.touchM > 36) {
                this.touchM = 0
                if (this.state == 4 || this.state == 5 || this.state == 7) return
                this.ChangeState(4, IMG_URL + "pet_walk.gif", 3, 7)
            } else if (this.touchM > 8) {
                this.distance = 0
            }
        } else {
            this.touchM = this.touchM > 0 ? this.touchM - 1 : 0
            if (this.state == 5) {
                this.ChangeState(0, IMG_URL + "pet_rest.gif", null)
            }
        }
    }
    draw() {
        this.img.style.left = this.x - this.img.offsetWidth / 2 + 'px';
        this.img.style.top = this.y - this.img.offsetHeight / 2.5 + 'px';
        this.img.style.transform = 'rotate(' + (this.d % 360) + 'deg)'
    }
    ChangeState(state, img = null, timer1 = 8, timer2 = 11, distance = null) {
        this.state = state
        if (img) this.img.src = img
        this.timer = timer1 ? Math.random() * (timer2 - timer1) + timer1 : this.timer
        this.distance = distance ? distance : this.distance
    }
}

class aFish {
    constructor(x, y, size) {
        const myimg = document.createElement("img");
        myimg.src = IMG_URL + "fish.png"
        myimg.setAttribute("class", "jx06fish");
        document.body.insertBefore(myimg, document.body.firstChild);
        myimg.style.position = 'fixed';
        myimg.style.height = size + "px";
        myimg.style.left = x + "px";
        myimg.style.top = y + "px";
        this.img = myimg
        this.x = x
        this.y = y
        this.d = 0
        this.count = 10
    }
    move() {
        if (this.d == this.count) {
            this.count = this.count * -1
        }
        this.d += this.count > this.d ? 5 : -5
        this.x += (MouseX - this.x) * 0.45
        this.y += (MouseY - this.y) * 0.45
        this.img.style.transform = 'rotate(' + (-90 + this.d) + 'deg)'
        this.img.style.left = this.x - this.img.offsetWidth + 'px';
        this.img.style.top = this.y - this.img.offsetHeight / 2 + 'px';
    }
    eaten() {
        this.img.remove()
        const index = fishes.indexOf(this);
        if (index !== -1) {
            fishes.splice(index, 1);
        }
    }
}
// -----------------------------------------------------------------------
let fishes = []
let Pets = []
for (let i = 0; i < 2; i++) {
    Pets.push(new aPet(...GetRandXY(), 120))
}
setInterval(() => {
    testD += testd
    if (testD > 14) testd = -3
    if (testD < -14) testd = 3
    for (const fish of fishes) {
        fish.move()
    }
    for (const Pet of Pets) {
        Pet.move()
        Pet.set()
        Pet.draw()
    }
}, DELAY);

// -----------------------------------------------------------------------
function newPet(data) {
    console.log(data)
    // chrome.storage.local.get(["Pets"]).then((result) => {
    // P = result.Pets[result.Pets.length - 1]
    // });
    Pets.push(new aPet(...GetRandXY(), data.size, data.color))
}
function ChangeClass(data) {
    if (data.checked) {
        for (const Pet of Pets) {
            Pet.img.classList.add(data.Myclass);
        }
    } else {
        for (const Pet of Pets) {
            Pet.img.classList.remove(data.Myclass);
        }
    }
}
function ChangeState(data) {
    for (const Pet of Pets) {
        Pet.ChangeState(data.checked ? data.NewState : 0, IMG_URL + "pet_rest.gif", null, null, 0)
        Pet.img.style.height = data.checked ? "100px" : '120px'
    }
}
document.addEventListener('mousemove', (event) => {
    MouseX = event.clientX;
    MouseY = event.clientY;
});
document.addEventListener('mousedown', function (event) {
    isMouseDown = true;
});

document.addEventListener('mouseup', function (event) {
    isMouseDown = false;
});

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        console.log(request)

        // console.log(sender.tab ? "from " + sender.tab.url : "from the extension");
        // console.log(request.greeting)
        g = request.greeting
        if (g == "NewFish") {
            fishes.push(new aFish(MouseX, MouseY, Math.random() * 40 + 50))
        } else if (g == "NewPet") {
            newPet(request.data)
        } else if (g == "ChangeClass") {
            ChangeClass(request.data)
        } else if (g == "ChangeState") {
            ChangeState(request.data)
        }
        sendResponse({ farewell: "ok" });
    }
);

// -----------------------------------------------------------------------