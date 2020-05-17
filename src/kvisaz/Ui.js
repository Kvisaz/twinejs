const Cursor = require('./Cursor');

let isMouseScrolling = false;
let isMouseScrollReady = false;
let isPassageEditing = false;

module.exports = {
    isMouseScrollReady() {
        return isMouseScrollReady;
    },

    startReadyMouseScrolling() {
        //body.classList.add('mouseScrollReady');
        isMouseScrollReady = true;
        Cursor.setGrab();
    },

    startMouseScrolling() {
        //body.classList.add('mouseScrolling');
        isMouseScrolling = true;
        Cursor.setGrabbing();
    },

    stopMouseScrolling(){
        isMouseScrolling = false;
        isMouseScrollReady = false;
        Cursor.setNormal();
    },

    setMarqueeing(){
        Cursor.setMarqueeing();
    },

    stopMarqueeing() {
        Cursor.setNormal();
    },

    /********************************
     *  Passage Mode
     *******************************/

    isPassageEditing(){
        return isPassageEditing;
    },

    startPassageEditing(){
        isPassageEditing = true;
    },

    stopPassageEditing(){
        isPassageEditing = false;
    },


}
