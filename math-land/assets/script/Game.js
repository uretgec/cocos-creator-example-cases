// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // Local Variables
        currentGameLevel: 1,
        currentGameStep: 1,
        currentGameState: "home",
        correctAnswerBoxId: 0,

        // Boolean Variables
        musicToggle: true,
        soundToggle: true,

        // Dependency Injection
        MainScreen: cc.Node,
        PlayScreen: cc.Node,
        MapScreen: cc.Node,
        firstItem: {
            default: null,
            type: cc.Label
        },
        operatorItem: {
            default: null,
            type: cc.Label
        },
        secondItem: {
            default: null,
            type: cc.Label
        },
        answerItemOne: {
            default: null,
            type: cc.Label
        },
        answerItemTwo: {
            default: null,
            type: cc.Label
        },
        answerItemThree: {
            default: null,
            type: cc.Label
        },
        answerItemFour: {
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.refreshGame();
    },

    _operatorList() {
        return {
            1: "+",
            2: "-",
            3: "*",
            4: "/",
        }
    },

    _getMathGameData(level = 1, min = null, max = null) {
        
        // Result Obj
        let result = {
            "operator" : this._getRandomNumber(level, 0, 3),
            "operatorLabel" : null,
            "first" : this._getRandomNumber(level, min, max),
            "second" : null,
            "answer" : null,
            "selections" : null,
        };

        // Find Answer
        if(result["operator"] === 0) {
            // +
            result["operatorLabel"] = "+";
            result["second"] = this._getRandomNumber(level, min, max);
            result["answer"] = result["first"] + result["second"];
        } else if(result["operator"] === 1) {
            // -
            result["operatorLabel"] = "-";
            result["second"] = this._getRandomNumber(level, min, result["first"]);
            result["answer"] = result["first"] - result["second"];
        } else if(result["operator"] === 2) {
            // /
            // TODO: Bölme işlemlerini geliştirmek gerekiyor. Hep tek haneli çıkacak yoksa
            result["operatorLabel"] = "/";

            result["second"] = this._getRandomNumber(1, null, null); // Range 0-9
            if(result["first"] === 0) {
                result["first"] = this._getRandomNumber(level, 1, max);
            }
            result["first"] = result["first"] * result["second"]

            //let zeroNumbers = [];
            //let chanceNumber = this._getRandomNumber(1, null, null); // Range 0-9
            /*for (var i = chanceNumber; i <= result["first"]; i++) {
                let resp = i % 2; // TODO: Burada bir sayı olması lazım
                if(resp === 0) {
                    zeroNumbers.push(i)
                }
            }*/

            /*if(zeroNumbers.length > 0) {
                zeroNumbers = zeroNumbers.sort(() => Math.random() - 0.5);
                result["second"] = zeroNumbers[0];
            } else {
                result["second"] = result["first"];
            }*/

            // TODO: bölme işlemi çıkarsa tam bölünen sayılar arasında bir işlem yaparak tam bölünen sayıya ulaşmamız gerekecek
            result["answer"] = result["first"] / result["second"];
        } else if(result["operator"] === 3) {
            // *
            result["operatorLabel"] = "x";
            result["second"] = this._getRandomNumber(level, min, max);
            result["answer"] = result["first"] * result["second"];
        }

        // Answers List and Suffle
        // TODO: Çıkan sayıların diğer sayılar ile aynı olmaması gerekiyor.
        if(result["answer"] > result["first"] && result["answer"] > result["second"]) {
            max = result["answer"] * 2
        }

        let answers = [result["answer"]];
        let z = 1;
        for (; z < 4; ) {
            let answerNumber = this._getRandomNumber(level, min, max);
            if(answers.indexOf(answerNumber) === -1) {
                answers.push(answerNumber);
                z++;
            }
        }
        
        result["selections"] = answers.sort(() => Math.random() - 0.5);
        this.correctAnswerBoxId = 1 + result["selections"].indexOf(result["answer"]);

        return result;
    },

    _getRandomNumber(level = 1, min = null, max = null) {

        if(min === null) {
            min = 0;
        }

        if(max === null) {
            min = 9;
            if(level > 5) {
                min = 99;
            }
        }

        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1) + min);

    },

    refreshGame() {
        let gameData = this._getMathGameData();
        this.firstItem.string = gameData["first"];
        this.operatorItem.string = gameData["operatorLabel"];
        this.secondItem.string = gameData["second"];

        this.answerItemOne.string = gameData["selections"][0];
        this.answerItemTwo.string = gameData["selections"][1];
        this.answerItemThree.string = gameData["selections"][2];
        this.answerItemFour.string = gameData["selections"][3];

        this.answerItemOne.enableUnderline = false;
        this.answerItemTwo.enableUnderline = false;
        this.answerItemThree.enableUnderline = false;
        this.answerItemFour.enableUnderline = false;
        if(gameData["answer"] === gameData["selections"][0]) {
            this.answerItemOne.enableUnderline = true;
        }
        
        if(gameData["answer"] === gameData["selections"][1]) {
            this.answerItemTwo.enableUnderline = true;
        }
        
        if(gameData["answer"] === gameData["selections"][2]) {
            this.answerItemThree.enableUnderline = true;
        }
        
        if(gameData["answer"] === gameData["selections"][3]) {
            this.answerItemFour.enableUnderline = true;
        }

        console.log("Scene", gameData, "CorectAnswerBoxId", this.correctAnswerBoxId);
    },

    checkAnswer(e, customEventData) {
        console.log("Bastı", this.correctAnswerBoxId, "BoxId", customEventData);

        if(parseInt(customEventData) === this.correctAnswerBoxId) {
            this.refreshGame();
            this.currentGameStep++;
            console.log("Yeni Oyun Başladı", this.currentGameLevel, this.currentGameStep);
            // TODO: step bölümü bitince map ekranı gelecek
            if(this.currentGameStep === 4) {
                this.checkGameAction(null, "start");
                this.currentGameLevel++;
                this.currentGameStep = 1;
            }
        }
    },

    // GameActionButtons
    checkGameAction(e, actionData) {
        console.log("CurrentGameAction", this.currentGameState, "EventGameAction", actionData);

        if(this.currentGameState !== actionData || actionData === "togglemap") {
            switch(actionData) {
                case "start":
                    // Oyun başlangıç ekranı
                    this.MainScreen.active = false;
                    this.PlayScreen.active = false;
                    this.MapScreen.active = true;
                    break;
                case "continue":
                    // Map ekranındaki devam butonu
                    this.MainScreen.active = false;
                    this.PlayScreen.active = true;
                    this.MapScreen.active = false;
                    break;
                case "togglemap":
                    // Her koşulda map butonuna tıklanınca açılan bölüm
                    this.MainScreen.active = (this.MainScreen.active) ? true : false;
                    this.PlayScreen.active = (this.PlayScreen.active) ? true : false;
                    this.MapScreen.active = (this.MapScreen.active) ? false : true;
                    break;
                default:
                    // Ana ekrana gidiyok
                    this.MainScreen.active = true;
                    this.PlayScreen.active = false;
                    this.MapScreen.active = false;
                    break;
            }

            this.currentGameState = actionData;
        }
    },

    checkOptionAction(e, actionData) {
        console.log("CurrentOptionAction", actionData);

        switch(actionData) {
            case "music":
                // Müzik aç kapa
                this.musicToggle = (this.musicToggle) ? false : true;
                console.log("Music aç kapa", this.musicToggle);
                break;
            case "sound":
                // Ses aç kapa
                this.soundToggle = (this.soundToggle) ? false : true;
                console.log("Ses aç kapa", this.soundToggle);
                break;
        }

    },

    onDestroy () {
        if(!cc.sys.isNative) {
            // Keyboard Listenner Stop
            // cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            //cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        }
        
        // Touch Listener Start
        //cc.systemEvent.setAccelerometerEnabled(false);
        //cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
    }, 

    start () {

    },

    // update (dt) {},
});
