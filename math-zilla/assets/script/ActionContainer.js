// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        FirstItemLabel: cc.Label,
        SecondItemLabel: cc.Label,
        OperatorLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    resetActionContainer() {
        this.FirstItemLabel.string = "-";
        this.SecondItemLabel.string = "-";
        this.OperatorLabel.string = "-";
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
