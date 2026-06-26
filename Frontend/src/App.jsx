import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import LiveQueue from "./pages/LiveQueue";
import AdminDashboard from "./pages/AdminDashboard";
import CreateDepartment from "./pages/CreateDepartment";
import ManageDepartments from "./pages/ManageDepartments";
import ManageQueue from "./pages/ManageQueue";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/live-queue" element={<LiveQueue />} />

        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute> <AdminDashboard /> </ProtectedRoute>} />
        <Route path="/admin/create-department" element={<ProtectedRoute> <CreateDepartment /> </ProtectedRoute>} />
        <Route path="/admin/departments" element={ <ProtectedRoute> <ManageDepartments /> </ProtectedRoute> } />
        <Route path="/admin/queue" element={ <ProtectedRoute> <ManageQueue /> </ProtectedRoute> } />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;