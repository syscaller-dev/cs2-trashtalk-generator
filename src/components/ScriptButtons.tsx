import React from "react";

interface ScriptButtonsProps {
    input: string;
    copied: boolean;
    onCopy: () => void;
    onDownload: () => void;
    showPreview: boolean;
    setShowPreview: (v: boolean) => void;
}

const ScriptButtons: React.FC<ScriptButtonsProps> = ({ input, copied, onCopy, onDownload, showPreview, setShowPreview }) => (
    <div className="ttg-buttons-row">
        <button className="copy-btn" onClick={onCopy} disabled={!input.trim()}>
            {copied ? "Copied!" : "Copy Script"}
        </button>
        <button
            className="download-btn"
            type="button"
            disabled={!input.trim()}
            onClick={onDownload}
            style={{ marginLeft: 8 }}
        >
            Download .cfg
        </button>
        <button
            className="preview-toggle"
            onClick={() => setShowPreview(!showPreview)}
        >
            {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
    </div>
);

export default ScriptButtons;
