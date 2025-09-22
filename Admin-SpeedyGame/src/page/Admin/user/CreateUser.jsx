import { useState } from 'react'
import { createUser } from '../../../services/userService'

const initialState = {
  username: '',
  email: '',
  password: '',
  roles: '',
  level: '',
  avatar: '',
  bio: ''
}

export default function CreateUser({ onSuccess }) {
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await createUser(form)
      setSuccess('Tạo user thành công!')
      setForm(initialState)
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err.message || 'Tạo user thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-content" style={{display:'flex',justifyContent:'center',alignItems:'flex-start',minHeight:'70vh'}}>
      <div style={{background:'#fff',padding:32,borderRadius:12,boxShadow:'0 2px 16px #0001',minWidth:350,maxWidth:420,width:'100%'}}>
  <h2 style={{marginBottom:24,textAlign:'center',color:'#111'}}>Create User</h2>
        <form onSubmit={handleSubmit} className="create-user-form" autoComplete="off">
          <div className="form-group" style={{marginBottom:16}}>
            <label style={{fontWeight:500,marginBottom:4,display:'block',color:'#111'}}>Username</label>
            <input name="username" value={form.username} onChange={handleChange} required className="input" style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc'}} placeholder="Nhập tên đăng nhập (bắt buộc)" />
          </div>
          <div className="form-group" style={{marginBottom:16}}>
            <label style={{fontWeight:500,marginBottom:4,display:'block',color:'#111'}}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="input" style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc'}} placeholder="Nhập email hợp lệ (bắt buộc)" />
          </div>
          <div className="form-group" style={{marginBottom:16}}>
            <label style={{fontWeight:500,marginBottom:4,display:'block',color:'#111'}}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required className="input" style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc'}} placeholder="Nhập mật khẩu (bắt buộc)" />
          </div>
          <div className="form-group" style={{marginBottom:16}}>
            <label style={{fontWeight:500,marginBottom:4,display:'block',color:'#111'}}>Roles</label>
            <select
              name="roles"
              value={form.roles}
              onChange={handleChange}
              className="input"
              style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc'}}
              required
            >
              <option value="">-- Chọn Role --</option>
              <option value="user">👤 User</option>
              <option value="staff">🧑‍💼 Staff</option>
            </select>
          </div>
          <div className="form-group" style={{marginBottom:16}}>
            <label style={{fontWeight:500,marginBottom:4,display:'block',color:'#111'}}>Level</label>
            <select name="level" value={form.level} onChange={handleChange} className="input" style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc'}}>
              <option value="">Chọn cấp độ...</option>
              <option value="Nhập Môn">Nhập Môn (1-10)</option>
            </select>
          </div>
          <div className="form-group" style={{marginBottom:16}}>
            <label style={{fontWeight:500,marginBottom:4,display:'block',color:'#111'}}>Avatar URL</label>
            <input name="avatar" value={form.avatar} onChange={handleChange} className="input" style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc'}} placeholder="Link ảnh đại diện (tùy chọn)" />
          </div>
          <div className="form-group" style={{marginBottom:24}}>
            <label style={{fontWeight:500,marginBottom:4,display:'block',color:'#111'}}>Bio</label>
            <input name="bio" value={form.bio} onChange={handleChange} className="input" style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc'}} placeholder="Giới thiệu bản thân (tùy chọn)" />
          </div>
          <button type="submit" disabled={loading} style={{width:'100%',padding:10,borderRadius:6,background:'#3b82f6',color:'#fff',fontWeight:600,fontSize:16,border:'none',boxShadow:'0 1px 4px #0001',cursor:loading?'not-allowed':'pointer',transition:'background 0.2s'}}>
            {loading ? 'Đang tạo...' : 'Tạo user'}
          </button>
          {error && <div style={{color:'red',marginTop:12,textAlign:'center'}}>{error}</div>}
          {success && <div style={{color:'green',marginTop:12,textAlign:'center'}}>{success}</div>}
        </form>
      </div>
    </div>
  )
}