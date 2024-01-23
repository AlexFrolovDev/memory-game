import Board from "./features/board/Board";
import Sidebar from "./features/sidebar/Sidebar";

function App() {
  return (
    <div className="app">
      <div className="content">
        <Board />
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
