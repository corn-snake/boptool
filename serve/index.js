import routing from "./routing.js";

//routing.toggleDev();

Deno.serve({port:800}, routing.init());
