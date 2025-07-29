import React from "react";

interface KeyInputProps {
    keyValue: string;
    waitingForKey: boolean;
    keyError: string;
    setKey: (key: string) => void;
    setWaitingForKey: (waiting: boolean) => void;
    setKeyError: (err: string) => void;
}

// Map browser KeyboardEvent.key to CS notation
function csKeyNotation(e: KeyboardEvent): string | null {
    if (e.code.startsWith("Numpad")) {
        const np = e.code.replace("Numpad", "kp_").toLowerCase();
        return np;
    }
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
        ...Object.fromEntries(Array.from({ length: 12 }, (_, i) => ["F" + (i + 1), "f" + (i + 1)]))
    };
    if (e.key in map) return map[e.key as keyof typeof map];
    if (/^[a-zA-Z0-9]$/.test(e.key)) return e.key.toLowerCase();
    return null;
}

const KeyInput: React.FC<KeyInputProps> = ({ keyValue, waitingForKey, setKey, setWaitingForKey, setKeyError }) => {
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

    return (
        <label className="ttg-inline-label">
            Key:
            <input
                type="text"
                value={keyValue}
                onChange={e => setKey(e.target.value)}
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
    );
};

export default KeyInput;
