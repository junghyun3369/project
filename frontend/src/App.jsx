import { useState } from 'react'
import './App.css'

function App() {
  // 데이터베이스 이용하여 데이터 가져오기 필요

  const temp = {"url" : "https://picsum.photos/seed/1/400/400", "prompt" : "a majestic lion with a crown of stars, photorealistic"};
  const arr = [];
  for(var i = 0; i < 10; i++) {
    arr[i] = temp
  }
  const [images, setImages] = useState(arr)

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
                <a href="login.html" className="btn btn-secondary">Login</a>
                <a href="login.html" className="btn btn-primary">Sign Up</a>
                <button id="themeToggle" className="theme-toggle">🌙 다크/라이트</button>
            </div>
        </aside>

        <main className="main-content">
            <header className="prompt-section">
                <div className="prompt-input-wrapper">
                    <input type="text" placeholder="Imagine something... a futuristic city in the style of Van Gogh" />
                    <button className="btn-generate">Generate</button>
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
    </>
  )
}

export default App
