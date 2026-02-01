import { computed, reactive, ref } from 'vue';
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
    history: {},
}),
lastTurn = computed(()=>Object.keys(compBop.history).at(-1));

const bopData = reactive({
    lastIsProcessing: true,
    player: -1,
    bop: -1,
    turn: -1,
    claim: 0
});

const lt = ref(matchMedia('(prefers-color-scheme: light)').matches ?? false); // jic *something* happens

const players = ref([]);

export {compBop,lt,bbcparser, players, finalParser, bopData, lastTurn};