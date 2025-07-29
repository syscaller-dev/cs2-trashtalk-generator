import React from "react";

interface ScriptPreviewProps {
    script: string;
    show: boolean;
}

const ScriptPreview: React.FC<ScriptPreviewProps> = ({ script, show }) => (
    show ? <pre className="script-preview">{script}</pre> : null
);

export default ScriptPreview;
