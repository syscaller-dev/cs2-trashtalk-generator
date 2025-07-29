import React from "react";

interface ScriptOptionsProps {
    loop: boolean;
    setLoop: (v: boolean) => void;
    useSayTeam: boolean;
    setUseSayTeam: (v: boolean) => void;
}

const ScriptOptions: React.FC<ScriptOptionsProps> = ({ loop, setLoop, useSayTeam, setUseSayTeam }) => (
    <>
        <label className="ttg-inline-label">
            <input
                type="checkbox"
                checked={loop}
                onChange={() => setLoop(!loop)}
            />
            Loop script
        </label>
        <label className="ttg-inline-label">
            <input
                type="checkbox"
                checked={useSayTeam}
                onChange={() => setUseSayTeam(!useSayTeam)}
            />
            Use say_team
        </label>
    </>
);

export default ScriptOptions;
