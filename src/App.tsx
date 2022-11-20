import React, { ChangeEvent, MutableRefObject, RefObject, useEffect, useRef, useState } from 'react';
import Sketch from './Sketch';

function App () {
    const canvasParentRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const renderer: MutableRefObject<Sketch | null> = useRef<Sketch | null>(null);

    const [text, setText] = useState<string>('Hello world!');
    const [color, setColor] = useState<string>('#27995F');

    useEffect(() => {
        renderer.current = Sketch.create(canvasParentRef);
        renderer.current?.resize(1280, 720);

        return () => {
            renderer.current?.teardown();
        };
    }, []);

    useEffect(() => {
        renderer.current?.updateInput({
            text,
            color
        });
    }, [text, color]);

    return (
        <div className="app">
            <h1>addressable-led-strip-3d-mapper</h1>
            <div ref={canvasParentRef}/>
            <input onChange={(event: ChangeEvent<HTMLInputElement>) => setText(event.target.value)} value={text}/>
            <input
                type="color"
                onChange={(event: ChangeEvent<HTMLInputElement>) => setColor(event.target.value)}
                value={color}
            />
        </div>
    );
}

export default App;
