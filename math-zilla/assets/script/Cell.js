// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        id: null,
        value: null,
        cellLabel: {
            default: null,
            type: cc.Label
        },
    },

    updateCellData(id, value) {
        this.id = id;
        this.value = value;
        this.cellLabel.string = value;
    },

    getCellData() {
        return {
            "id": this.id,
            "value": this.value,
        }
    },

    selectCellData() {
        console.log("Cell Click", this.id, this.value, this.node);
        this.cellLabel.enableUnderline = (this.cellLabel.enableUnderline) ? false : true;

        var cellSelectEvent = new cc.Event.EventCustom('foobar', true);
        cellSelectEvent.setUserData(this.getCellData());
        this.node.dispatchEvent(cellSelectEvent);
    },

    disableCellData() {
        this.node.interactable = false;
    },

    activeCellData() {
        this.node.interactable = true;
    },

    removeCellData() {
        this.node.destroy();
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {

    },

    // update (dt) {},
});
