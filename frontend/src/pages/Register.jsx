import React from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../services/auth.jsx";

export default function Register(){
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [avatar, setAvatar] = React.useState(null);
  const [cover, setCover] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!avatar) return alert("Avatar is required");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("fullname", fullName);
      fd.append("username", username);
      fd.append("email", email);
      fd.append("password", password);
      fd.append("avatar", avatar);
      if (cover) fd.append("coverImage", cover);

      await registerApi(fd);
      alert("Registered. Please login.");
      nav("/login");
    } catch (err) {
      alert(err?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4 font-semibold">Register</h2>
      <form onSubmit={submit} className="space-y-3" encType="multipart/form-data">
        <input className="w-full border rounded px-3 py-2" value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Full name" />
        <input className="w-full border rounded px-3 py-2" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" />
        <input className="w-full border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
        <div>
          <label className="block text-sm">Avatar (required)</label>
          <input type="file" accept="image/*" onChange={e=>setAvatar(e.target.files[0])} />
        </div>
        <div>
          <label className="block text-sm">Cover (optional)</label>
          <input type="file" accept="image/*" onChange={e=>setCover(e.target.files[0])} />
        </div>
        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded">{loading ? "Creating..." : "Register"}</button>
      </form>
    </div>
  );
}
