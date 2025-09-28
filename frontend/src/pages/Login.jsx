import React from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, useAuth } from "../services/auth.jsx";

export default function Login(){
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = await loginApi({ username: identifier, email: identifier, password });
      const p = payload?.data ?? payload;
      login(p);
      nav("/");
    } catch (err) {
      alert(err?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4 font-semibold">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" value={identifier} onChange={e=>setIdentifier(e.target.value)} placeholder="username or email" />
        <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded">{loading ? "Signing in..." : "Login"}</button>
      </form>
    </div>
  )
}
