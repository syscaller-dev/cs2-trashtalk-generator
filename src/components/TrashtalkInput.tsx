import React from "react";

interface TrashtalkInputProps {
    input: string;
    setInput: (v: string) => void;
    handlePaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
}

const TrashtalkInput: React.FC<TrashtalkInputProps> = ({ input, setInput, handlePaste }) => (
    <>
        <label className="ttg-label" htmlFor="ttg-textarea">
            Paste text or alias script:
        </label>
        <textarea
            id="ttg-textarea"
            value={input}
            onChange={e => setInput(e.target.value)}
            onPaste={handlePaste}
            rows={10}
            placeholder="Enter trashtalk lines or paste an alias script here..."
            className="ttg-textarea"
        />
    </>
);

export default TrashtalkInput;
