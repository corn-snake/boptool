import { reactive, ref } from 'vue';
import { Parser } from 'bulletin-board-code';
import { handlers } from '../lib/customBBHandler.js'
const bbcparser = new Parser({
    removeEmptyTags: false,
    handlers: handlers
});
bbcparser.setHandler("caret", {
    isInline: true,
    allowsEmpty: true,
    bbcode: '[caret][/caret]',
    html: '<div class="caret"></div>'
});
const finalParser = new Parser();

const compBop = reactive({
    title: "",
    history: [],
});

const bopData = reactive({
    lastIsProcessing: true,
    player: -1,
    bop: -1,
    turn: -1,
    claim: 0,
    country: ""
});

const players = ref([]),
    nonplayables = ref([]),
    cohosters = ref([]);

export {compBop, bbcparser, players, nonplayables, finalParser, bopData, cohosters};