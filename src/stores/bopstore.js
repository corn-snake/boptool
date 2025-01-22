import {reactive,ref} from 'vue';
import { Parser } from 'bulletin-board-code';
import { handlers } from '../assets/customBBHandler';
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
    turn: 0,
    history: {},
});

const bopData = reactive({
    number: -1,
    turn: -1,
    latestTurn: -1
});

const lt = ref(true);

const players = ref([]);

const particularSelection = ref("");

export {compBop,bopData,lt,bbcparser, players, particularSelection, finalParser};