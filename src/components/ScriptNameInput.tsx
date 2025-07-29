import React from "react";

interface ScriptNameInputProps {
    scriptName: string;
    setScriptName: (v: string) => void;
}

const ScriptNameInput: React.FC<ScriptNameInputProps> = ({ scriptName, setScriptName }) => (
    <div className="ttg-title-row">
        <input
            className="ttg-title-input"
            type="text"
            value={scriptName}
            onChange={e => setScriptName(e.target.value)}
            aria-label="Script name"
        />
    </div>
);

export default ScriptNameInput;
