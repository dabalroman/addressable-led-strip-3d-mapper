import React, { ChangeEvent, MutableRefObject, RefObject, useEffect, useRef } from 'react';
import WebcamView from './WebcamView';

function App () {
    const canvasParentRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const textAreaRef: RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null);
    const renderer: MutableRefObject<WebcamView | null> = useRef<WebcamView | null>(null);

    useEffect(() => {
        renderer.current = WebcamView.create(canvasParentRef);
        renderer.current?.resize(1280, 720);

        return () => {
            renderer.current?.teardown();
        };
    }, []);

    return (
        <div className="app">
            <h1>addressable-led-strip-3d-mapper</h1>
            <div ref={canvasParentRef}/>
            <div className="controls">
                <button type="button" onClick={() => renderer.current?.resetAction()}>RESET</button>
                <button
                    type="button"
                    onClick={() => {
                        if (textAreaRef.current === null) {
                            return;
                        }

                        textAreaRef.current.value = renderer.current?.grabDataAction() ?? '';
                    }}
                >GRAB DATA
                </button>
                <input
                    type="number"
                    min={0}
                    max={255}
                    step={1}
                    onChange={
                        (e: ChangeEvent<HTMLInputElement>) => renderer
                            .current?.setFilterThresholdAction(e.target.valueAsNumber)
                    }
                    defaultValue={230}
                />
            </div>
            <div className="output">
                <textarea ref={textAreaRef} rows={20}/>
            </div>
        </div>
    );
}

export default App;
