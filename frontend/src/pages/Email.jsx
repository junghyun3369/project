import { useState, useEffect, useRef } from 'react'
import { useRoot } from '@hooks/RootProvider.jsx'
import axios from 'axios'

const Email = () => {
  const { closeEvent } = useRoot()
  const codeEvent = () => {
    // 백엔드 처리 부분
  }
  const submitEvent = (e) => {
    e.preventDefault();
    // 백엔드 처리 부분
    console.log(e.target.code.value)
    axios.post("http://localhost:8000/code", {code : e.target.code.value})
      .then(res => {
        if(res.data.status) {
          location.reload()
        }else {
          alert("입력하신 코드는 만료가 되었거나 잘못된 코드 입니다.")
        }
      })
      .catch(err => console.error(err));
  }
  return (
    <>
      <div className="overlay" onClick={closeEvent}></div>
    
      <section className="card modal">

        <div className="brand">
          <div className="brand__logo">AI</div>
          <div>
            <h1 id="title" className="brand__name">이메일 인증</h1>
            <p id="subtitle" className="subtitle">이메일 주소로 전송된 인증 코드를 입력해주세요.</p>
          </div>
        </div>

        <form onSubmit={submitEvent}>
          <div className="field">
            <label htmlFor="code">인증 코드</label>
            <input type="text" id="code" name="code" className="input" placeholder="6자리 숫자" maxLength="6" required />
            <p className="hint">인증 코드는 3분간 유효합니다.</p>
          </div>

          <button className="btn" type="submit">인증하기</button>

          <p className="footer">메일을 받지 못하셨나요? <span style={{color: 'red', cursor: 'pointer'}} onClick={codeEvent}>코드 재전송</span></p>
        </form>
      </section>
    </>
  )
}

export default Email