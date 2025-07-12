import React, { useState } from 'react';
import './index.scss';
import { CodeEditorPreview } from 'aichat-core';

const initialCode = `
<!DOCTYPE html>
<html>
<head>
  <title>My HTML Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is a simple HTML page.</p>
</body>
</html>
`;

function App() {
    const [code, setCode] = useState(initialCode);
    const onCodeChange = (value: any) => {
    }
    return (
        <>
            <CodeEditorPreview code={code} onChange={onCodeChange} />
        </>
    );
}

export default App;