/*
A modal dialog for editing a single passage.
*/

const Vue = require('vue');
const locale = require('../../locale');
const {thenable} = require('../../vue/mixins/thenable');
const {changeLinksInStory, updatePassage} = require('../../data/actions/passage');
const {loadFormat} = require('../../data/actions/story-format');
const {passageDefaults} = require('../../data/store/story');

require('./index.less');

module.exports = Vue.extend({
    template: require('./index.html'),

    data: () => ({
        passageId: '',
        storyId: '',
        oldWindowTitle: '',
        userPassageName: '',
        saveError: '',
        origin: null
    }),

    computed: {
        cmOptions() {
            return {
                placeholder: locale.say(
                    'Enter the body text of your passage here. To link to another ' +
                    'passage, put two square brackets around its name, [[like ' +
                    'this]].'
                ),
                prefixTrigger: {
                    prefixes: ['[[', '->'],
                    callback: this.autocomplete.bind(this)
                },
                extraKeys: {
                    'Ctrl-Space': this.autocomplete.bind(this)
                },
                indentWithTabs: true,
                lineWrapping: true,
                lineNumbers: false,
                mode: 'text'
            };
        },

        parentStory() {
            return this.allStories.find(story => story.id === this.storyId);
        },

        passage() {
            return this.parentStory.passages.find(
                passage => passage.id === this.passageId
            );
        },

        userPassageNameValid() {
            return !(this.parentStory.passages.some(
                passage => passage.name === this.userPassageName &&
                    passage.id !== this.passage.id
            ));
        },

        autocompletions() {
            return this.parentStory.passages.map(passage => passage.name);
        }
    },

    methods: {
        autocomplete() {
            this.$refs.codemirror.$cm.showHint({
                hint: cm => {
                    const wordRange = cm.findWordAt(cm.getCursor());
                    const word = cm.getRange(
                        wordRange.anchor,
                        wordRange.head
                    ).toLowerCase();

                    const comps = {
                        list: this.autocompletions.filter(
                            name => name.toLowerCase().indexOf(word) !== -1
                        ),
                        from: wordRange.anchor,
                        to: wordRange.head
                    };

                    CodeMirror.on(comps, 'pick', () => {
                        const doc = cm.getDoc();

                        doc.replaceRange(']] ', doc.getCursor());
                    });

                    return comps;
                },

                completeSingle: false,

                extraKeys: {
                    ']'(cm, hint) {
                        const doc = cm.getDoc();

                        doc.replaceRange(']', doc.getCursor());
                        hint.close();
                    },

                    '-'(cm, hint) {
                        const doc = cm.getDoc();

                        doc.replaceRange('-', doc.getCursor());
                        hint.close();
                    },

                    '|'(cm, hint) {
                        const doc = cm.getDoc();

                        doc.replaceRange('|', doc.getCursor());
                        hint.close();
                    }
                }
            });
        },

        getEditorPassageText(){
            const textarea = document.getElementById('passageEditModalTextArea');
            const text = textarea.value;
            console.log('getEditorPassageText =', text);
            return text;
        },

        saveText(text) {
            console.log('saveText');
            this.updatePassage(
                this.parentStory.id,
                this.passage.id,
                {text: text}
            );
        },

        saveTags(tags) {
            console.log('saveTags');
            this.updatePassage(
                this.parentStory.id,
                this.passage.id,
                {tags: tags}
            );
        },

        savePassageText(text) {
            this.updatePassage(
                this.parentStory.id,
                this.passage.id,
                {
                    text: text
                }
            );
        },

        changeLinksHere() {
            if(this.userPassageName === this.passage.name) return;

            this.changeLinksInStory(
                this.parentStory.id,
                this.passage.name,
                this.userPassageName
            );

            this.updatePassage(
                this.parentStory.id,
                this.passage.id,
                {name: this.userPassageName}
            );
        },

        dialogDestroyed() {
            console.log('dialogDestroyed');
            this.$destroy();
        },

        canClose() {
            console.log('canClose');

            if (this.userPassageNameValid){
                const passageText = this.getEditorPassageText();
                this.changeLinksHere();
                this.savePassageText(passageText);
            }

            return this.userPassageNameValid;
        }
    },

    ready() {
        this.userPassageName = this.passage.name;

        /* Update the window title. */

        this.oldWindowTitle = document.title;
        document.title = locale.say('Editing \u201c%s\u201d', this.passage.name);

        /*
        Load the story's format and see if it offers a CodeMirror mode.
        */

        if (this.$options.storyFormat) {
            this.loadFormat(
                this.$options.storyFormat.name,
                this.$options.storyFormat.version
            ).then(format => {
                let modeName = format.name.toLowerCase();
                console.log('loadFormat', format.name);
            });
        }

        /*
        Set the mode to the default, 'text'. The above promise will reset it if
        it fulfils.
        */

    },

    destroyed() {
        document.title = this.oldWindowTitle;
    },

    components: {
        //'code-mirror': require('../../vue/codemirror'),
        'modal-dialog': require('../../ui/modal-dialog'),
        'tag-editor': require('./tag-editor')
    },

    vuex: {
        actions: {
            changeLinksInStory,
            updatePassage,
            loadFormat
        },

        getters: {
            allStories: state => state.story.stories
        }
    },

    mixins: [thenable]
});
