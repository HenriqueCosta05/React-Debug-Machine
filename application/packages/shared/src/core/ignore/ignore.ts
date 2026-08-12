export const DEBUG_MACHINE_IGNORE_ATTRIBUTE = 'data-debug-machine-ignore';

// DOM capture usa isso pra não gravar os próprios cliques do painel de devtools
// (ele roda dentro do mesmo root React que o app, então rootRegistry sozinho não filtra).
export function isDebugMachineIgnored(element: Element): boolean {
    return element.closest(`[${DEBUG_MACHINE_IGNORE_ATTRIBUTE}]`) !== null;
}
