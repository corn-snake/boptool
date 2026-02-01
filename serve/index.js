import routing from "./routing.js";

//routing.toggleDev();

Deno.serve({hostname: "0.0.0.0", port:800}, routing.init());
