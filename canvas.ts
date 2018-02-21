/**
 * Basisinterface für alle weiteren Tools, empfängt die Daten aus den MouseEvents wenn es aktiv ist.
 *
 * Interfaces gibt es nur in TypeScript, nicht in JavaScript, daher wird davon generierten Code nichts mehr zu sehen
 * sein.
 */
interface Tool {
    handleMouseDown(x: number, y: number, ctx: CanvasRenderingContext2D): void;

    handleMouseMove(x: number, y: number, ctx: CanvasRenderingContext2D): void;

    handleMouseUp(x: number, y: number, ctx: CanvasRenderingContext2D): void;
}

/**
 * Das standardmäßig aktive Tool, das nichts tut (null object pattern).
 */
class ToolNone implements Tool {
    // you can override functions and remove arguments you don't need
    handleMouseDown() {
    }

    handleMouseMove() {
    }

    handleMouseUp() {
    }
}

/**
 * Ein Tool, das schwarze Linien zeichnet, während eine Maustaste gedrückt und gehalten wird.
 */
class BlackPen implements Tool {
    down = false;
    lastPosition = {x: 0, y: 0};

    handleMouseDown(x: number, y: number) {
        this.down = true;
        this.lastPosition = {x, y};
    }

    handleMouseMove(x: number, y: number, ctx: CanvasRenderingContext2D) {
        if (!this.down) return;

        ctx.strokeStyle = "black";

        // Linien zeichnen ist nur ein Spezialfall vom Pfade definieren und deren Kanten zu zeichnen
        ctx.beginPath();
        ctx.moveTo(this.lastPosition.x, this.lastPosition.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();

        this.lastPosition = {x, y};
    }

    handleMouseUp() {
        this.down = false;
    }
}

/**
 * Die Hauptklasse, die das HTMLCanvasElement und die Tools übergeben bekommt und diese miteinander verknüpft.
 */
class CanvasHandler {

    tool: Tool = new ToolNone();
    context: CanvasRenderingContext2D;

    constructor(
        private canvas: HTMLCanvasElement,
        private tools: { [id: string]: Tool }) {

        // Wie reagiert TypeScript, wenn man hier etwa den "webgl" context abfragt?
        const context = canvas.getContext("2d");
        if (!context)
            throw new Error("Context missing");

        this.context = context;
        this.initEventListeners();
    }

    private initEventListeners() {
        for (const id in this.tools) {
            const tool = this.tools[id];
            const element = document.getElementById(id);

            // Was passiert wenn diese Prüfung vergessen wird?
            if (!element)
                throw new Error(`element with id ${id} not found`);

            element.addEventListener("click", () => this.tool = tool);
        }

        this.canvas.focus();

        // Wenn man einen listener für ein KeyboardEvent (etwa "keypress") registriert, auf welche Eigenschaften kann
        // man dann zugreifen?
        this.canvas.addEventListener("mousedown", ev => this.tool.handleMouseDown(ev.offsetX, ev.offsetY, this.context));
        this.canvas.addEventListener("mousemove", ev => this.tool.handleMouseMove(ev.offsetX, ev.offsetY, this.context));
        this.canvas.addEventListener("mouseup", ev => this.tool.handleMouseUp(ev.offsetX, ev.offsetY, this.context));
    }

}

document.addEventListener("error", ev => showError(ev.error));

try {
    init();
    console.log("Initialized");
} catch (e) {
    showError(e);
}

function init() {
    const canvas = document.getElementsByTagName("canvas")[0];

    new CanvasHandler(canvas, {
        toolNone: new ToolNone(),
        toolBlackPen: new BlackPen()
    });
}

function showError(e: Error) {
    console.error(e);
    document.body.innerHTML = "";
    const pre = document.createElement("pre");
    pre.innerText = e.stack || "Fehler ohne Stacktrace";
    document.body.appendChild(pre);
}
