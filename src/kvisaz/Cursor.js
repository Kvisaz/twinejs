/**
 @module KvisazCursor
 **/

let cursorEl = null;

module.exports = {
    setNormal(){
        //document.body.classList.remove('mouseScrollReady', 'mouseScrolling');
        document.body.style.cursor = 'auto';
    },

    setGrab(){
        //document.body.classList.add('mouseScrollReady');
        document.body.style.cursor = 'grab';
    },

    setGrabbing(){
        //document.body.classList.add('mouseScrolling');
        document.body.style.cursor = 'grabbing';
    },

    setMarqueeing() {
        //document.body.classList.add('marqueeing');
        document.body.style.cursor = 'crosshair';
    }
}
