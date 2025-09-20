

import { useEffect, useState } from 'react';



const EditUser = ({ userId }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa user này?')) return;
    setDeleting(true);
    setError(null);
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Xóa user thất bại');
      window.dispatchEvent(new CustomEvent("changeAdminTab", { detail: "Users" }));
    } catch (err) {
      setError(err.message || "Xóa user thất bại");
    } finally {
      setDeleting(false);
    }
  };
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("access_token");
    fetch(`/api/admin/users/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => { setUser(data); setForm(data); })
      .catch(() => setError('Không thể tải thông tin user'))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleBack = () => {
    window.dispatchEvent(new CustomEvent("changeAdminTab", { detail: "Users" }));
  };

  const validate = () => {
    if (!form.username || form.username.trim().length < 3) return "Username phải có ít nhất 3 ký tự";
    if (!form.email || !/^\S+@(gmail|yahoo|outlook|hotmail|icloud|protonmail|zoho|yandex|aol)\.com$/.test(form.email)) {
      return "Chỉ cho phép email thuộc các tên miền phổ biến: gmail.com, yahoo.com, outlook.com, ...";
    }
    if (!form.level || form.level.trim().length === 0) return "Level không được để trống";
    if (!form.status || form.status.trim().length === 0) return "Status không được để trống";
    if (!form.roles || (Array.isArray(form.roles) ? form.roles.length === 0 : form.roles.trim().length === 0)) return "Role không được để trống";
    return null;
  };

  const handleSave = async () => {
    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      setSuccess(false);
      return;
    }
    setSaving(true);
    setSuccess(false);
    setError(null);
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        let msg = "Cập nhật thất bại";
        try {
          const errJson = await res.json();
          msg = errJson.message || msg;
          console.error("API error:", errJson);
        } catch {}
        throw new Error(msg);
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{padding:32, maxWidth:800, margin:'0 auto'}}>
      <div style={{display:'flex', alignItems:'center', marginBottom:24}}>
        <button onClick={handleBack} style={{marginRight:16, padding:'6px 18px', fontSize:16, borderRadius:6, border:'1px solid #2196f3', background:'#fff', color:'#2196f3', cursor:'pointer'}}>← Back</button>
        <h2 style={{textAlign:'center', fontSize:32, fontWeight:'bold', marginBottom:0, borderBottom:'3px solid #2196f3', display:'inline-block', paddingBottom:8}}>Edit User</h2>
      </div>
      {loading ? <p>Đang tải...</p> : user ? (
        <form style={{background:'#fff', borderRadius:16, boxShadow:'0 2px 8px rgba(0,0,0,0.08)', padding:32, display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}} onSubmit={e => {e.preventDefault(); handleSave();}}>
          <div>
            <label style={{fontWeight:'bold'}}>Username:</label>
            <input name="username" value={form.username || ""} onChange={handleChange} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc'}} />
            {error && error.toLowerCase().includes('username') && (
              <div style={{color:'red',marginTop:4,fontSize:13}}>{error}</div>
            )}
          </div>
          <div>
            <label style={{fontWeight:'bold'}}>Email:</label>
            <input name="email" value={form.email || ""} onChange={handleChange} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc'}} />
              {error && error.toLowerCase().includes('email') && (
                <div style={{color:'red',marginTop:4,fontSize:13}}>
                  {error}
                </div>
              )}
          </div>
          <div>
            <label style={{fontWeight:'bold'}}>Level:</label>
            <select
              id="level"
              name="level"
              value={form.level}
              onChange={handleChange}
              style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc'}}
              required
            >
              <option value="">-- Chọn Level --</option>
              <option value="Nhập Môn">🟢 Nhập Môn</option>
              <option value="Trung Cấp">🟡 Trung Cấp</option>
              <option value="Cao Cấp">🔴 Cao Cấp</option>
            </select>
            {error && error.toLowerCase().includes('level') && (
              <div style={{color:'red',marginTop:4,fontSize:13}}>Giá trị level không hợp lệ, vui lòng chọn lại!</div>
            )}
          </div>
          <div>
            <label style={{fontWeight:'bold'}}>Status:</label>
            <select
              name="status"
              value={form.status || ""}
              onChange={handleChange}
              style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc'}}
              required
            >
              <option value="active">Đang hoạt động</option>
              <option value="banned">Bị cấm</option>
              <option value="deleted">Đã xóa</option>
            </select>
          </div>
          <div>
            <label style={{fontWeight:'bold'}}>Role:</label>
            <select
              name="roles"
              value={Array.isArray(form.roles) ? form.roles[0] : form.roles || ""}
              onChange={e => setForm(f => ({...f, roles: [e.target.value]}))}
              style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc'}}
              required
            >
              <option value="">-- Chọn Role --</option>
              <option value="user">👤 User</option>
              <option value="staff">🧑‍💼 Staff</option>
            </select>
            {error && error.toLowerCase().includes('role') && (
              <div style={{color:'red',marginTop:4,fontSize:13}}>{error}</div>
            )}
          </div>
          <div>
            <label style={{fontWeight:'bold'}}>Total Score:</label>
            <input name="totalScore" value={form.totalScore || ""} onChange={handleChange} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc'}} />
          </div>
          <div>
            <label style={{fontWeight:'bold'}}>Bio:</label>
            <input name="bio" value={form.bio || ""} onChange={handleChange} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc'}} />
          </div>
          <div>
            <label style={{fontWeight:'bold'}}>Email Verified:</label>
            <select name="isEmailVerified" value={form.isEmailVerified ? "true" : "false"} onChange={e => setForm(f => ({...f, isEmailVerified: e.target.value === "true"}))} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc'}}>
              <option value="true">✔️ Đã xác thực</option>
              <option value="false">❌ Chưa xác thực</option>
            </select>
          </div>
          <div>
            <label style={{fontWeight:'bold'}}>Login Fail:</label>
            <input name="loginFailCount" value={form.loginFailCount || ""} onChange={handleChange} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc'}} />
          </div>
          <div>
            <label style={{fontWeight:'bold'}}>Avatar:</label>
            <input name="avatar" value={form.avatar || ""} onChange={handleChange} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc'}} />
          </div>
          <div style={{gridColumn:'1/3',textAlign:'center',marginTop:24}}>
            <button
              type="submit"
              disabled={saving || (!!form.email && !/^\S+@\S+\.\S+$/.test(form.email))}
              style={{padding:'10px 32px',fontSize:18,borderRadius:8,border:'none',background:'#2196f3',color:'#fff',cursor:'pointer',marginRight:16, opacity: (!!form.email && !/^\S+@\S+\.\S+$/.test(form.email)) ? 0.5 : 1}}
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button type="button" onClick={handleDelete} disabled={deleting} style={{padding:'10px 32px',fontSize:18,borderRadius:8,border:'none',background:'#f44336',color:'#fff',cursor:'pointer'}}>
              {deleting ? "Đang xóa..." : "Xóa user"}
            </button>
            {success && <span style={{color:'green',marginLeft:16}}>✔️ Đã lưu!</span>}
            {/* Chỉ giữ báo lỗi email ngay dưới ô nhập email, không hiện dưới nút nữa */}
          </div>
        </form>
      ) : <p>Không tìm thấy user.</p>}
    </div>
  );
}

export default EditUser;
