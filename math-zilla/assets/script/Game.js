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
        currentGamePoint: 0,

        // Dependency Injection
        CellGrid: cc.Node,
        CellPrefab: cc.Prefab,
        CurrentGamePointLabel: cc.Label,
        TotalGamePointLabel: cc.Label,
        ActionContainer: cc.Node,
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

    // LIFE-CYCLE CALLBACKS:
    _resetActionData() {
        return {"firstItem": null, "operator": null, "secondItem": null, "firstItemNode": null, "secondItemNode": null};
    },

    onLoad () {
        this.prevActionData = null;
        this.currentActionData = this._resetActionData();
        //this.cellList = {};

        // TODO: 
        /*
        Levele göre rakamlar random olarak tek tek oluşturulacak
        Her bir rakam belirlendikten sonra operator de rastgele seçilecek
        cell değiğimiz bazı kutular boş bırakılacak ve boş kutuların id bilgileri bir değişkende saklanacak
        tüm cell değerleri bir değişkende saklanacak
        rakam + operatör + rakam işlemleri yaplarak toplam ulaşılması gereken değer belirlenecek. 
        Operatör seçimi yapılırken kullanıcının kaç hakkı olduğununda bilgisine bakılarak operatör ve ikinci rakam değeri belirlenecek. 
        rakamlar bazı durumlarda negatif sayı olabilir. - operatör hakkına sahip ise - rakam toplama işlemine dönebilir.
        0 rakamıda çıkabilir ama operatör işlemlerinde ilk ve ikinci rakam kesinlikle sıfır olmamalı.
        süpriz kutularının sayısı bir değişkende saklanacak - bu sayı ile boş bırakılan cell sayısı eşit olmasına dikkat edilmeli.
        supriz butonu: video izle hak kazan, video izledikten sonra belli süre bekle ya da mevcut topladığın toplam puandan kullanarak süpriz kutu açma hakkı al şeklinde özelliklere sahip olacak
        süpriz butonunda cell, hak ve bekleme süresi yer alacak.
        süpriz butonuna basılınca bir popup açılarak kullanıcıya seçenek sunabilecek
        kullanıcı level sayısına göre toplam ulaşılması gereken değer %60 a kadar az gösterilerek daha kolay bitirmesi sağlanacak.
        kullanıcı ulaşması gereken değere ulaştığında oyun biter ama isterse devam edip extra bonus puanları kazanarak kasasına ek yapabilir.
        oyun kullanıcının haklarının bitmesiyle - kullanıcı kendi bitirmesiyle - toplam sayıya ulaşmasıyla seçeneklerinden herhangi birisinde biter
        kullanıcı marketten süpriz açma hakkı, operatör hakkı v.b. oyun içinde kazandığı puanlar ile değiş tokuş yapabilir.
        rewarded-ads özelliği aktif olacak sadece. Level geçişlerinde de belli bir sıklıkta video ads gösterimi yapılacak.

        */
        this.refreshGame();

        this.CellGrid.on('foobar', function (event) {
            console.log("AHA GELDİ:", event, event.getEventName(), event.getUserData(), this.currentActionData);

            var cellData = event.getUserData();
            if(this.currentActionData.firstItem === null) {
                this.currentActionData.firstItem = cellData.value;
                this.currentActionData.firstItemNode = event.target;
                this.ActionContainer.getComponent("ActionContainer").FirstItemLabel.string = cellData.value;
            } else if(this.currentActionData.firstItem === cellData.value) {
                this.currentActionData.firstItem = null;
                this.currentActionData.firstItemNode = null;
                this.ActionContainer.getComponent("ActionContainer").FirstItemLabel.string = "-";
            } else if(this.currentActionData.secondItem === null) {
                this.currentActionData.secondItem = cellData.value;
                this.currentActionData.secondItemNode = event.target;
                this.ActionContainer.getComponent("ActionContainer").SecondItemLabel.string = cellData.value;
            } else if(this.currentActionData.secondItem === cellData.value) {
                this.currentActionData.secondItem = null;
                this.currentActionData.secondItemNode = null;
                this.ActionContainer.getComponent("ActionContainer").SecondItemLabel.string = "-";
            }

            if(this.isFinishAction()) {
                this.finishAction();
            }

            event.stopPropagation();
        }.bind(this));
      
    },

    refreshGame() {
        
        for (let index = 1; index <= 36; index++) {
            var singleCellNode = cc.instantiate(this.CellPrefab);
            var randomNumber = this._getRandomNumber();
            singleCellNode.getComponent("Cell").updateCellData(index, randomNumber);
            singleCellNode.parent = this.CellGrid;

            //this.cellList[index] = singleCellNode
        }

    },

    setActionData(type, data) {
        // type: operator|number
        // data: value of type
    },
    delActionData(type) {
        
    },
    getActionData() {
        return this.actionData;
    },
    resetActionData() {
        this.actionData = {}
    },

    useOperator(e, operator) {
        console.log("Operator seçildi", this.currentActionData.operator);
    },

    _operatorList(operator = null) {
        var operatorList = {
            1: "+",
            2: "-",
            3: "*",
            4: "/",
        };

        if(!!operator) {
            return operatorList[operator];
        }

        return operatorList;
    },

    selectOperator(e, customEventData) {
        console.log("Operator seçildi", e, customEventData);
        this.currentActionData.operator = customEventData;
        this.ActionContainer.getComponent("ActionContainer").OperatorLabel.string = this._operatorList(customEventData);

        if(this.isFinishAction()) {
            this.finishAction();
        }
    },

    isFinishAction() {
        // TODO: Burada işlemi tamamlamak için bir check işlemine ihtiyaç var.
        // firstItem seçiliyse, oprttor seçiliyse ve second ta seçildiyse hemen işlem gerçekleşmeli.
        // aynı userdata geliyorsa ve bu 3lüden bir tanesi bile seçilmediyse iptal etme özgürlüğüne sahip olmalı.
        console.log("CurrentActionData", this.currentActionData);
        for (const property in this.currentActionData) {
            if(this.currentActionData[property] === null) {
                return false;
            }
        }

        console.log("Valla bitti");
        return true;
    },

    finishAction() {
        // kullanıcının seçtiği işlem gerçekleştiriliyor
        setTimeout(function () {
            var calculateGamePoints = 0;
            if(parseInt(this.currentActionData.operator) === 1) {
                // +
                calculateGamePoints += this.currentActionData.firstItem+this.currentActionData.secondItem;
            } else if(parseInt(this.currentActionData.operator) === 2) {
                // -
                calculateGamePoints += this.currentActionData.firstItem-this.currentActionData.secondItem;
            } else if(parseInt(this.currentActionData.operator) === 3) {
                // /
                calculateGamePoints += this.currentActionData.firstItem*this.currentActionData.secondItem;
            } else if(parseInt(this.currentActionData.operator) === 4) {
                // *
                calculateGamePoints += Math.floor(this.currentActionData.firstItem/this.currentActionData.secondItem);
            }
            
            this.currentGamePoint = this.currentGamePoint + calculateGamePoints;
            console.log("Game Point", this.currentGamePoint, calculateGamePoints, this.currentActionData.firstItem, this.currentActionData.secondItem);
            this.currentActionData.firstItemNode.getComponents(cc.Button)[0].interactable = false;
            this.currentActionData.secondItemNode.getComponents(cc.Button)[0].interactable = false;
            //this.cellList[this.currentActionData.firstItem].active = false;
            //this.cellList[this.currentActionData.secondItem].active = false;

            //console.log("Cell List", this.cellList);

            this.CurrentGamePointLabel.string = this.currentGamePoint;
            this.ActionContainer.getComponent("ActionContainer").resetActionContainer();
            this.currentActionData = this._resetActionData();
          }.bind(this), 100);

    },

    start () {

    },

    //update (dt) {},
});
