import React, { useState } from "react";
import "./TrashtalkGenerator.css";

function parseAliasScript(input: string): string[] | null {
    // Try to parse alias script and extract the 'say' or 'say_team' lines as plain text
    const aliasRegex = /alias\s+"[^"]+"\s+"say(_team)? ([^;]+);/g;
    const lines: string[] = [];
    let match;
    while ((match = aliasRegex.exec(input))) {
        lines.push(match[2].trim());
    }
    return lines.length > 0 ? lines : null;
}

function generateAliasScript({
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

const defaultScriptName = "trashtalk";
const defaultKey = "ins";

export default function TrashtalkGenerator() {
    const [input, setInput] = useState("");
    const [scriptName, setScriptName] = useState(defaultScriptName);
    const [key, setKey] = useState(defaultKey);
    const [loop, setLoop] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const [copied, setCopied] = useState(false);
    const [waitingForKey, setWaitingForKey] = useState(false);
    const [keyError, setKeyError] = useState("");
    const [useSayTeam, setUseSayTeam] = useState(false);

    // Map browser KeyboardEvent.key to CS notation
    function csKeyNotation(e: KeyboardEvent): string | null {
        // Numpad keys
        if (e.code.startsWith("Numpad")) {
            const np = e.code.replace("Numpad", "kp_").toLowerCase();
            return np;
        }

        // Common CS key names
        const map = {
            " ": "space",
            "Escape": "esc",
            "Insert": "ins",
            "Delete": "del",
            "PageUp": "pgup",
            "PageDown": "pgdn",
            "Home": "home",
            "End": "end",
            "ArrowUp": "uparrow",
            "ArrowDown": "downarrow",
            "ArrowLeft": "leftarrow",
            "ArrowRight": "rightarrow",
            "Shift": "shift",
            "Control": "ctrl",
            "Alt": "alt",
            "Tab": "tab",
            "CapsLock": "capslock",
            "Enter": "enter",
            "Backspace": "backspace",
            "Meta": "win",
            // F1-F12
            ...Object.fromEntries(Array.from({ length: 12 }, (_, i) => ["F" + (i + 1), "f" + (i + 1)]))
        };
        
        if (e.key in map) return map[e.key as keyof typeof map];
        
        // Single char keys (letters, numbers)
        if (/^[a-zA-Z0-9]$/.test(e.key)) return e.key.toLowerCase();
        // Mouse buttons (not supported in KeyboardEvent)
        return null;
    }

    React.useEffect(() => {
        if (!waitingForKey) return;
        function onKeyDown(e: KeyboardEvent) {
            e.preventDefault();
            const csKey = csKeyNotation(e);
            if (csKey) {
                setKey(csKey);
                setWaitingForKey(false);
                setKeyError("");
            } else {
                setKeyError("Key not supported, please type manually.");
                setWaitingForKey(false);
            }
        }
        window.addEventListener("keydown", onKeyDown, true);
        return () => window.removeEventListener("keydown", onKeyDown, true);
    }, [waitingForKey]);


        // Handle input change (typing)
        function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
            setInput(e.target.value);
        }

        // Handle paste event: if alias script, insert at cursor
        function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
            const paste = e.clipboardData.getData("text");
            const parsed = parseAliasScript(paste);
            if (parsed) {
                e.preventDefault();
                const textarea = e.target as HTMLTextAreaElement;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const before = input.slice(0, start);
                const after = input.slice(end);
                const toInsert = parsed.join("\n");
                setInput(before + toInsert + after);
                // Move cursor after inserted text (optional, not strictly needed for controlled input)
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = before.length + toInsert.length;
                }, 0);
                // If any line was say_team, enable say_team checkbox
                if (/alias\s+"[^"]+"\s+"say_team /.test(paste)) {
                    setUseSayTeam(true);
                }
            }
            // else allow default paste
        }

    // Generate script from input
    function getScript() {
        const lines = input
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 0);
        if (lines.length === 0) return "";
        return generateAliasScript({ lines, scriptName, key, loop, useSayTeam });
    }

    function handleCopy() {
        const script = getScript();
        if (script) {
            navigator.clipboard.writeText(script);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        }
    }

    return (
        <div className="trashtalk-generator">
            <div className="ttg-title-row">
                <input
                    className="ttg-title-input"
                    type="text"
                    value={scriptName}
                    onChange={(e) => setScriptName(e.target.value)}
                    aria-label="Script name"
                />
            </div>
            <label className="ttg-label" htmlFor="ttg-textarea">
                Paste text or alias script:
            </label>
                    <textarea
                        id="ttg-textarea"
                        value={input}
                        onChange={handleInputChange}
                        onPaste={handlePaste}
                        rows={10}
                        placeholder="Enter trashtalk lines or paste an alias script here..."
                        className="ttg-textarea"
                    />
            <div className="ttg-options-row">
                <label className="ttg-inline-label">
                    Key:
                    <input
                        type="text"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        style={{ width: 80 }}
                        disabled={waitingForKey}
                    />
                    <button
                        type="button"
                        className="ttg-key-btn"
                        onClick={() => { setWaitingForKey(true); setKeyError(""); }}
                        disabled={waitingForKey}
                        style={{ marginLeft: 8 }}
                    >
                        {waitingForKey ? "Press a key..." : "Set key"}
                    </button>
                </label>
                <label className="ttg-inline-label">
                    <input
                        type="checkbox"
                        checked={loop}
                        onChange={() => setLoop((v) => !v)}
                    />
                    Loop script
                </label>
                <label className="ttg-inline-label">
                    <input
                        type="checkbox"
                        checked={useSayTeam}
                        onChange={() => setUseSayTeam((v) => !v)}
                    />
                    Use say_team
                </label>
            </div>
            <div className="ttg-buttons-row">
                <button className="copy-btn" onClick={handleCopy} disabled={!input.trim()}>
                    {copied ? "Copied!" : "Copy Script"}
                </button>
                <button
                    className="download-btn"
                    type="button"
                    disabled={!input.trim()}
                    onClick={() => {
                        const script = getScript();
                        const blob = new Blob([script], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = (scriptName || 'script') + '.cfg';
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => {
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }, 0);
                    }}
                    style={{ marginLeft: 8 }}
                >
                    Download .cfg
                </button>
                <button
                    className="preview-toggle"
                    onClick={() => setShowPreview((v) => !v)}
                >
                    {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
            </div>
            {keyError && <div style={{ color: '#f66', marginBottom: '1rem', width: '60vw', minWidth: 400, maxWidth: '90vw', textAlign: 'left' }}>{keyError}</div>}
            {showPreview && (
                <pre className="script-preview">{getScript()}</pre>
            )}
        </div>
    );
}
