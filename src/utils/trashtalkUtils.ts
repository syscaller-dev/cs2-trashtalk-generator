// Utility functions for trashtalk generator

export function parseAliasScript(input: string): string[] | null {
    // Try to parse alias script and extract the 'say' or 'say_team' lines as plain text
    const aliasRegex = /alias\s+"[^"]+"\s+"say(_team)? ([^;]+);/g;
    const lines: string[] = [];
    let match;
    while ((match = aliasRegex.exec(input))) {
        lines.push(match[2].trim());
    }
    return lines.length > 0 ? lines : null;
}

export function generateAliasScript({
    lines,
    scriptName,
    key,
    loop,
    useSayTeam,
}: {
    lines: string[];
    scriptName: string;
    key: string;
    loop: boolean;
    useSayTeam: boolean;
}): string {
    let script = "";
    const sayCmd = useSayTeam ? "say_team" : "say";
    lines.forEach((line, i) => {
        const next = i + 1 < lines.length ? i + 1 : (loop ? 0 : null);
        let aliasLine = `alias \"${scriptName}${i}\" \"${sayCmd} ${line};`;
        if (next !== null) {
            aliasLine += ` alias ${scriptName} ${scriptName}${next};`;
        } else {
            aliasLine += ` alias ${scriptName};`;
        }
        aliasLine += `\";`;
        script += aliasLine + "\n";
    });
    script += `alias \"${scriptName}\" \"${scriptName}0\";\n`;
    script += `bind ${key} ${scriptName};`;
    return script;
}
