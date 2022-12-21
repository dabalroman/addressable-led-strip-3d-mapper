import React, { MutableRefObject, RefObject, useEffect, useRef } from 'react';
import WebcamView from './WebcamView';

function App () {
    const canvasParentRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
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
                <button type="button" onClick={() => renderer.current?.reset()}>RESET</button>
                <button type="button" onClick={() => renderer.current?.grabData()}>GRAB DATA</button>
            </div>
        </div>
    );
}

export default App;
