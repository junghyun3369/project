import { useState, useEffect, useRef } from 'react'
import '@styles/App.css'
import '@styles/Style.css'
import Info from '@pages/Info.jsx'
import Login from '@pages/Login.jsx'
import SignUp from '@pages/SignUp.jsx'
import Email from '@pages/Email.jsx'
import { useRoot } from '@hooks/RootProvider.jsx'

const App = () => {
  const { isUser, isLogin, isSignUp, isEmail, modalEvent, removeStorage, isStorage } = useRoot()
  const [images, setImages] = useState([])
  const [access, setAccess] = useState(false)
  const promptRef = useRef()

  useEffect(() => {
    // 더미 데이터 생성 
    const temp = {"url" : "https://picsum.photos/seed/1/400/400", "prompt" : "a majestic lion with a crown of stars, photorealistic"};
    const arr = [];
    for(var i = 0; i < 10; i++) {
      arr[i] = temp
    }
    // 데이터베이스 이용하여 데이터 가져오기 필요
    setImages(arr)
    setAccess(isStorage("access"))
  }, []);

  const isChecck = () => {
    if(!access) modalEvent("Login")
  }

  const applyEvent = () => {
    // comfyui 이미지 생성 호출
    console.log("applyEvent", promptRef.current.value)
  }

  return (
    <>
      <div className="container">
        <aside className="sidebar">
            <div className="sidebar-header">
                <i className="fas fa-rocket logo-icon"></i>
                <h1>AI Gen</h1>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li className="active"><a href="#"><i className="fas fa-compass"></i> Explore</a></li>
                    <li><a href="#"><i className="fas fa-user"></i> 나의 창작물</a></li>
                </ul>
            </nav>
            <div className="sidebar-footer">
                {access && <>
                  <button type='button' className="theme-toggle" onClick={()=> modalEvent("User")}>Info</button>
                  <button type='button' className="theme-toggle" onClick={()=> removeStorage("access")}>Logout</button>
                </>}
                {!access && <>
                  <button type='button' className="theme-toggle" onClick={()=> modalEvent("Login")}>Login</button>
                  <button type='button' className="theme-toggle" onClick={()=> modalEvent("SignUp")}>Sign Up</button>
                </>}
                {/* <a href="login.html" className="btn btn-secondary">Login</a>
                <a href="login.html" className="btn btn-primary">Sign Up</a> */}
                {/* <button id="themeToggle" className="theme-toggle">🌙 다크/라이트</button> */}
            </div>
        </aside>

        <main className="main-content">
            <header className="prompt-section">
                <div className="prompt-input-wrapper" onClick={isChecck}>
                    <input type="text" ref={promptRef} placeholder="Imagine something... a futuristic city in the style of Van Gogh" />
                    <button type='button' className="btn-generate" disabled={!access} onClick={applyEvent}>Generate</button>
                </div>
            </header>

            <section className="gallery">
                { /* 이미지 반복 */ }
                {
                  images?.map((row, index) => {
                    return (
                      <div className="gallery-item" key={index}>
                        <img src={row.url} alt="AI generated image" />
                        <div className="overlay">
                          <p className="prompt-text">{row.prompt}</p>
                        </div>
                    </div>
                    )
                  })
                }
            </section>
        </main>
      </div>
      {isUser && <Info />}
      {isLogin && <Login />}
      {isSignUp && <SignUp />}
      {isEmail && <Email />}
    </>
  )
}

export default App
