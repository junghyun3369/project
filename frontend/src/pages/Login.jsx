import { useState, useEffect, useRef } from 'react'
import { useRoot } from '@hooks/RootProvider.jsx'
import axios from 'axios'

const Login = () => {
  const { modalEvent, closeEvent, isValidEmail } = useRoot()
  const emailRef = useRef(null)
  const submitEvent = () => {
    if(isValidEmail(emailRef.current.value)) {
      axios.post("http://localhost:8000/user", {email : emailRef.current.value})
      .then(res => {
        if(res.data.status) {
          console.log(res.data.code)
          modalEvent("Email")
        } else {
          alert("코드를 받지 않았습니다.")
        }
      })
      .catch(err => console.error(err));
    } else {
      alert("이메일 형식으로 넣어 주실까요?")
    }    
  }
  return (
    <>
      <div className="overlay" onClick={closeEvent}></div>
      <section className="card modal">
        <div className="brand" style={{marginBottom: '6px'}}>
          <div className="brand__logo">HI</div>
          <div>
            <h2 id="loginTitle" className="brand__name">로그인</h2>
            <p id="loginDesc" className="subtitle">계정으로 PIXEL에 접속하세요.</p>
          </div>
        </div>

        <form>
          <div className="field">
            <label htmlFor="email">이메일</label>
            <input type="email" id="email" name="email" className="input" ref={emailRef} placeholder="id@example.com" required />
          </div>
          <button className="btn" type="button" onClick={submitEvent}>이메일 인증</button>
          <p className="footer">계정이 없으신가요? <span style={{color: 'red', cursor: 'pointer'}} onClick={()=>modalEvent("SignUp")}>회원가입</span></p>
        </form>
      </section>
    </>
  )
}

export default Login