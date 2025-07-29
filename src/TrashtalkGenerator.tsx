
import React, { useState } from "react";
import "./TrashtalkGenerator.css";
import ScriptNameInput from "./components/ScriptNameInput";
import TrashtalkInput from "./components/TrashtalkInput";
import KeyInput from "./components/KeyInput";
import ScriptOptions from "./components/ScriptOptions";
import ScriptButtons from "./components/ScriptButtons";
import ScriptPreview from "./components/ScriptPreview";
import { parseAliasScript, generateAliasScript } from "./utils/trashtalkUtils";

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
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = before.length + toInsert.length;
            }, 0);
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

    function handleDownload() {
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
    }

    return (
        <div className="trashtalk-generator">
            <ScriptNameInput scriptName={scriptName} setScriptName={setScriptName} />
            <TrashtalkInput input={input} setInput={setInput} handlePaste={handlePaste} />
            <div className="ttg-options-row">
                <KeyInput
                    keyValue={key}
                    waitingForKey={waitingForKey}
                    keyError={keyError}
                    setKey={setKey}
                    setWaitingForKey={setWaitingForKey}
                    setKeyError={setKeyError}
                />
                <ScriptOptions
                    loop={loop}
                    setLoop={setLoop}
                    useSayTeam={useSayTeam}
                    setUseSayTeam={setUseSayTeam}
                />
            </div>
            <ScriptButtons
                input={input}
                copied={copied}
                onCopy={handleCopy}
                onDownload={handleDownload}
                showPreview={showPreview}
                setShowPreview={setShowPreview}
            />
            {keyError && <div style={{ color: '#f66', marginBottom: '1rem', width: '60vw', minWidth: 400, maxWidth: '90vw', textAlign: 'left' }}>{keyError}</div>}
            <ScriptPreview script={getScript()} show={showPreview} />
        </div>
    );
}
