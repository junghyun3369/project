import { useState, useEffect } from 'react'
import { useRoot } from '@hooks/RootProvider.jsx'

const FreeView = () => {
  const { setIsFreeView } = useRoot()
  return (
    <div id="image-modal" className="modal-overlay">
      <div className="overlay" onClick={()=>setIsFreeView(false)}></div>
      <div className="modal-content">
        <header className="modal-header">
          <div className="user-info">
            <img src="https://picsum.photos/seed/user1/50/50" alt="User avatar" className="avatar" />
            <span className="username">ArtisticAI</span>
          </div>
          <div className="header-buttons">
            <button className="follow-btn">구독</button>
            <button className="close-button" >&times;</button>
          </div>
        </header>

        <section className="prompt-section">
          <p className="prompt-text">a majestic lion with a crown of stars, photorealistic, cinematic lighting, 8k</p>
          <button className="copy-btn">
            <i className="fa-regular fa-copy"></i> 프롬프트 복사
          </button>
        </section>

        <div className="modal-main-body">
          <div className="image-wrapper">
              <img src="http://192.168.0.253:7000/oauth/file/u/3" alt="Enlarged AI art" className="modal-image" />
              <button className="view-original-btn">
                  <i className="fa-solid fa-expand"></i> 원본 사이즈
              </button>
          </div>

          <aside className="comments-panel">
              <div className="comments-header">
                <h3>코멘트</h3>
                <button className="panel-close-btn">&times;</button>
              </div>

              <ul className="comment-list">
                <li className="comment-item">
                  <img className="comment-avatar" src="https://picsum.photos/seed/a/40/40" alt="" />
                  <div className="comment-content">
                    <strong>PixelPush</strong>
                    <p>정말 멋진 작품이네요! 별의 표현이 인상적이에요.</p>
                    <span className="comment-timestamp">24시간 전</span>
                  </div>
                </li>

                <li className="comment-item">
                  <img className="comment-avatar" src="https://picsum.photos/seed/b/40/40" alt="" />
                  <div className="comment-content">
                    <strong>ArtisticAI (나)</strong>
                    <p>감사합니다! 영감을 받아서 작업해봤어요.</p>
                    <span className="comment-timestamp">14시간 전</span>
                  </div>
                </li>

                <li className="comment-item">
                  <img className="comment-avatar" src="https://picsum.photos/seed/c/40/40" alt="" />
                  <div className="comment-content">
                    <strong>FutureScapes</strong>
                    <p>프롬프트 참고해서 저도 만들어봐야겠어요!</p>
                    <span className="comment-timestamp">30분 전</span>
                  </div>
                </li>
              </ul>
            </aside>
        </div>

        <footer className="modal-footer">
          <div className="actions-bar">
            <button className="like-btn">
              <i className="fa-regular fa-heart"></i>
            </button>
            <button className="comment-btn">
              <i className="fa-regular fa-comment"></i>
            </button>
          </div>

          <div className="comment-section">
            <div className="comment-box">
              <input type="text" className="comment-input" placeholder="코멘트 남기기..." />
              <button className="send-btn">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default FreeView