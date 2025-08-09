import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactFlowProvider } from '@xyflow/react';
import { ContentProvider } from './Context/ContentContext';
import FlowMain from './ReactFlow/FlowMain';
import FlowsDashboard from './flow dashboard/FlowsDashboard';

const App = () => {
  return (
    <Router>
      <ReactFlowProvider>
        <ContentProvider>
          <Routes>
            <Route path="/" element={<FlowsDashboard />} />
            <Route path="/flow" element={<FlowMain />} />
          </Routes>
        </ContentProvider>
      </ReactFlowProvider>
    </Router>
  );
};

export default App;
