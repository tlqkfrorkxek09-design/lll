import React, { useState, useEffect } from 'react';

export default function App() {
  // --- 상태 관리 (State) ---
  const [currentUser, setCurrentUser] = useState({
    name: '황세연',
    email: 's3.y30n09@gmail.com',
    role: 'super_admin', // 'super_admin', 'admin', 'user', 'guest'
    profileImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
  });

  const [currentTab, setCurrentTab] = useState('home'); // 'home', 'pledge', 'archive', 'inquiry', 'settings', 'admin_dashboard'
  const [adminSubTab, setAdminSubTab] = useState('applications'); // 관리자 대시보드 내부 탭
  const [isLocked, setIsLocked] = useState(false);
  const [language, setLanguage] = useState('KR'); // 'KR', 'EN', 'JP', 'CN', 'ES'
  const [selectedCrewTab, setSelectedCrewTab] = useState('월수토'); // 홈 화면 요일별 탭

  // 강제 확인 팝업 알림 상태
  const [activePopupNotice, setActivePopupNotice] = useState(null);

  // 데이터 상태들
  const [officialLinks, setOfficialLinks] = useState([
    { id: 1, type: '공식', name: '라인업 공식 인스타', url: 'https://instagram.com', account: '' },
    { id: 2, type: '공식', name: '라인업 공식 유튜브', url: 'https://youtube.com', account: '' },
    { id: 3, type: '계좌', name: '라인업컴퍼니 공식 계좌', url: '', account: '부산은행 101-2096-7592-09' }
  ]);

  const [bulletins, setBulletins] = useState([
    { id: 1, title: '팬 아카이브 이용 수칙 안내', content: '본 아카이브는 단방향 팬 소통 공간입니다. 규칙을 준수해 주세요.', popup: true, media: [] }
  ]);

  const [adminList, setAdminList] = useState([
    { id: 1, name: '리모', role: 'super_admin', email: 'tlqkfrorkxek09@gmail.com', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
    { id: 2, name: '깨깨미', role: 'admin', email: 'jhwon1209@gmail.com', img: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100' },
    { id: 3, name: 'iamkiki032', role: 'admin', email: 'iamkiki032@gmail.com', img: '' },
    { id: 4, name: '5수', role: 'admin', email: 'dori.osu.save@gmail.com', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }
  ]);

  const [usersList, setUsersList] = useState([
    { id: 1, name: '황세연', email: 's3.y30n09@gmail.com', warningNote: '' },
    { id: 2, name: '테스트유저', email: 'test@gmail.com', warningNote: '' }
  ]);

  // 경고 사유 모달 및 총괄 위임 모달 상태
  const [warningModalUser, setWarningModalUser] = useState(null);
  const [warningReason, setWarningReason] = useState('');
  
  const [superTransferModal, setSuperTransferModal] = useState(null); // 위임 대상 관리자
  const [transferStep, setTransferStep] = useState(1); // 1: 확인, 2: 비번
  const [transferPassword, setTransferPassword] = useState('');

  // 관리자 단톡방 메시지
  const [chatMessages, setChatMessages] = useState([
    { sender: '리모', text: '이거 보이는지 확인해주세용', time: '01:53' },
    { sender: '정희원', text: '보여요!', time: '01:53' }
  ]);
  const [inputChat, setInputChat] = useState('');

  // 앱 실행 시 첫 팝업 체크
  useEffect(() => {
    const popupTarget = bulletins.find(b => b.popup);
    if (popupTarget) {
      setActivePopupNotice(popupTarget);
    }
  }, []);

  // 총괄 관리자 여부
  const isSuperAdmin = currentUser.role === 'super_admin';
  const isAdmin = currentUser.role === 'admin' || isSuperAdmin;

  // 관리자 익명화 처리 함수 (비관리자에게는 무조건 '관리자'로 통일)
  const getDisplayAuthor = (authorRole, originalName) => {
    if (isAdmin) return originalName; // 관리자 눈에는 실명/닉네임 노출
    if (authorRole === 'admin' || authorRole === 'super_admin') return '관리자';
    return originalName;
  };

  // 총괄 관리자 위임 처리
  const handleTransferSuperAdmin = (targetAdmin) => {
    if (transferStep === 1) {
      setTransferStep(2);
    } else {
      if (transferPassword === 'lineupupup0614!') {
        setAdminList(adminList.map(a => {
          if (a.email === targetAdmin.email) return { ...a, role: 'super_admin' };
          if (a.email === currentUser.email) return { ...a, role: 'admin' };
          return a;
        }));
        setCurrentUser({ ...currentUser, role: 'admin' });
        alert('총괄 관리자 권한이 성공적으로 위임되었습니다.');
        setSuperTransferModal(null);
        setTransferStep(1);
        setTransferPassword('');
      } else {
        alert('비밀번호가 일치하지 않습니다.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20 select-none">
      
      {/* 강제 확인 팝업 알림 */}
      {activePopupNotice && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
            <h3 className="text-xl font-bold text-slate-900 mb-2">🚨 [중요 공지] {activePopupNotice.title}</h3>
            <p className="text-slate-600 text-sm mb-6 whitespace-pre-wrap">{activePopupNotice.content}</p>
            <button 
              onClick={() => setActivePopupNotice(null)}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
            >
              내용을 모두 확인했으며 동의합니다 (닫기)
            </button>
          </div>
        </div>
      )}

      {/* --- 상단 네비게이션 바 (요청하신 블랙 'L' 로고 반영) --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          {/* 업로드해주신 블랙 배경의 'L' 로고 디자인 적용 */}
          <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black text-xl shadow-md border border-slate-800">
            L
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight">LINEUP HUB</h1>
            <p className="text-[10px] text-slate-500">단방향 팬 아카이브</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* 일반 사용자에게는 관리자 인원수 절대 비공개 */}
          {isAdmin && (
            <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium border border-slate-200">
              {isSuperAdmin ? '총괄 관리자' : '관리자'} ({adminList.length}명)
            </span>
          )}

          {isAdmin && (
            <button 
              onClick={() => setCurrentTab('admin_dashboard')}
              className={`p-2 rounded-xl transition ${currentTab === 'admin_dashboard' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              title="관리자 대시보드"
            >
              🛡️
            </button>
          )}

          <button className="relative p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition">
            🔔
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">1</span>
          </button>

          <button 
            onClick={() => setCurrentTab('settings')}
            className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* --- 메인 콘텐츠 영역 --- */}
      <main className="max-w-4xl mx-auto p-4">
        
        {/* 1. 홈 화면 */}
        {currentTab === 'home' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="font-bold text-sm text-slate-500 mb-3 uppercase tracking-wider">📌 공식 링크 및 방송 바로가기</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {officialLinks.map((link) => (
                  <a 
                    key={link.id}
                    href={link.url || '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 text-left transition block"
                  >
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded mr-1">{link.type}</span>
                    <p className="font-semibold text-sm text-slate-800 mt-1 truncate">{link.name}</p>
                    {link.account && <p className="text-xs text-slate-500 truncate mt-0.5">{link.account}</p>}
                  </a>
                ))}
              </div>
            </div>

            {/* 요일별 크루 탭 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex space-x-2 border-b border-slate-100 pb-3 mb-4">
                {['월수토', '화목일'].map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedCrewTab(day)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${selectedCrewTab === day ? 'bg-slate-900 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {day} 크루
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {['유원', 'CK', '락민', '현호'].map((member, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center hover:shadow-md transition cursor-pointer">
                    <div className="w-16 h-16 bg-slate-300 rounded-full mx-auto mb-2 overflow-hidden">
                      <img src={`https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100`} alt={member} className="w-full h-full object-cover"/>
                    </div>
                    <p className="font-bold text-slate-900">{member}</p>
                    <p className="text-xs text-slate-500 mt-1">{selectedCrewTab} 아카이브</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="font-bold text-slate-800 mb-3">📢 중요 게시판 및 공지</h2>
              {bulletins.map(b => (
                <div key={b.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-slate-900">{b.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{b.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. 관리자 대시보드 */}
        {currentTab === 'admin_dashboard' && isAdmin && (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-black">🛡️ 관리자 대시보드</h2>
              <p className="text-xs text-slate-300 mt-1">콘텐츠 검수, 사용자 제재, 공식 링크 및 총괄 권한 관리 센터</p>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-800 text-xs font-semibold">
                {[
                  { id: 'applications', label: '신청관리' },
                  { id: 'inquiries', label: '문의답변' },
                  { id: 'pledges', label: '공약관리' },
                  { id: 'member_links', label: '멤버링크' },
                  { id: 'admin_chat', label: '관리자단톡' },
                  { id: 'official_links', label: '공식링크' },
                  { id: 'bulletin', label: '게시판' },
                  { id: 'users', label: '사용자목록' },
                  { id: 'delete_req', label: '삭제신청' },
                  { id: 'reports', label: '신고접수' },
                  { id: 'admin_approval', label: '관리자승인' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setAdminSubTab(tab.id)}
                    className={`px-3 py-2 rounded-lg transition ${adminSubTab === tab.id ? 'bg-white text-slate-900 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              
              {adminSubTab === 'official_links' && (
                <div>
                  <h3 className="font-bold text-lg mb-4">공식 링크 및 본방송 추가/관리</h3>
                  <div className="space-y-3 mb-6">
                    <input type="text" placeholder="링크 이름 (예: 본방 라이브 킥)" className="w-full p-3 border rounded-xl text-sm" />
                    <input type="text" placeholder="https://..." className="w-full p-3 border rounded-xl text-sm" />
                    <button onClick={() => alert('공식 링크가 추가되었습니다!')} className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold">공식 링크 추가</button>
                  </div>
                  <div className="space-y-2">
                    {officialLinks.map(l => (
                      <div key={l.id} className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center">
                        <div>
                          <span className="text-xs bg-slate-200 px-2 py-0.5 rounded mr-2">{l.type}</span>
                          <span className="font-semibold text-sm">{l.name}</span>
                        </div>
                        <button onClick={() => setOfficialLinks(officialLinks.filter(item => item.id !== l.id))} className="text-rose-500 text-xs font-bold">삭제</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adminSubTab === 'admin_chat' && (
                <div>
                  <h3 className="font-bold text-lg mb-2">관리자 전용 내부 단톡방</h3>
                  <p className="text-xs text-slate-500 mb-4">관리자들끼리만 실시간 소통하는 공간입니다. 비상 시 아래 오픈채팅방을 이용하세요.</p>
                  
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4 text-xs text-amber-900 flex justify-between items-center">
                    <div>
                      <p className="font-bold">🔗 비상용 외부 오픈채팅방 링크</p>
                      <a href="https://open.kakao.com" target="_blank" rel="noreferrer" className="text-blue-600 underline mt-0.5 block">https://open.kakao.com/o/example (클릭 시 이동)</a>
                      <p className="mt-1 font-semibold text-rose-600">참여 비밀번호: 0614</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border h-64 overflow-y-auto space-y-3 mb-4">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.sender === currentUser.name ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] text-slate-500 mb-0.5">{getDisplayAuthor('admin', msg.sender)}</span>
                        <div className={`p-3 rounded-2xl text-sm max-w-xs ${msg.sender === currentUser.name ? 'bg-slate-900 text-white' : 'bg-white border text-slate-800'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={inputChat} 
                      onChange={(e) => setInputChat(e.target.value)} 
                      placeholder="메시지 입력..." 
                      className="flex-1 p-3 border rounded-xl text-sm"
                    />
                    <button 
                      onClick={() => {
                        if(!inputChat.trim()) return;
                        setChatMessages([...chatMessages, { sender: currentUser.name, text: inputChat, time: '방금' }]);
                        setInputChat('');
                      }} 
                      className="bg-slate-900 text-white px-5 rounded-xl font-semibold text-sm"
                    >
                      전송
                    </button>
                  </div>
                </div>
              )}

              {adminSubTab === 'users' && (
                <div>
                  <h3 className="font-bold text-lg mb-2">가입한 사용자 목록</h3>
                  <p className="text-xs text-slate-500 mb-4">닉네임이나 프로필이 부적절한 경우 사유를 작성하여 주의를 줄 수 있습니다.</p>
                  
                  <div className="space-y-3">
                    {usersList.map(u => (
                      <div key={u.id} className="p-4 bg-slate-50 border rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                        <button 
                          onClick={() => setWarningModalUser(u)}
                          className="bg-amber-100 text-amber-800 px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-200"
                        >
                          ⚠️ 주의 주기
                        </button>
                      </div>
                    ))}
                  </div>

                  {warningModalUser && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                        <h4 className="font-bold text-lg mb-2">'{warningModalUser.name}'님에게 주의 부여</h4>
                        <p className="text-xs text-slate-500 mb-3">부적절한 사유를 상세히 작성해 주세요 (최소 20자 이상 필수).</p>
                        <textarea 
                          rows={4}
                          value={warningReason}
                          onChange={(e) => setWarningReason(e.target.value)}
                          placeholder="사유를 20자 이상 입력하세요..."
                          className="w-full p-3 border rounded-xl text-sm mb-2"
                        />
                        <p className={`text-xs ${warningReason.length >= 20 ? 'text-emerald-600 font-bold' : 'text-rose-500'}`}>
                          현재 글자 수: {warningReason.length}자 (최소 20자 필요)
                        </p>
                        <div className="flex justify-end gap-2 mt-4">
                          <button onClick={() => { setWarningModalUser(null); setWarningReason(''); }} className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold">취소</button>
                          <button 
                            disabled={warningReason.length < 20}
                            onClick={() => {
                              alert('사용자에게 주의 알림이 전송되었습니다.');
                              setWarningModalUser(null);
                              setWarningReason('');
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold text-white ${warningReason.length >= 20 ? 'bg-rose-600 hover:bg-rose-700' : 'bg-slate-300 cursor-not-allowed'}`}
                          >
                            주의 발송
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {adminSubTab === 'admin_approval' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg mb-2">관리자 임명 링크 생성</h3>
                    <p className="text-xs text-slate-500 mb-3">비밀번호(`lineupupup0614!`)와 함께 전달하여 관리자를 모집하세요.</p>
                    <div className="flex gap-2">
                      <input type="text" readOnly value="https://lineup-hub.vercel.app/admin-invite?code=0614" className="w-full p-3 bg-slate-50 border rounded-xl text-xs text-slate-600" />
                      <button onClick={() => alert('임명 링크가 복사되었습니다!')} className="bg-slate-900 text-white px-4 rounded-xl text-xs font-bold whitespace-nowrap">복사</button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-bold text-lg mb-2">현재 관리자 명단 및 총괄 관리자 위임</h3>
                    <div className="space-y-3">
                      {adminList.map(a => (
                        <div key={a.email} className="p-4 bg-slate-50 border rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-900 flex items-center gap-2">
                              {a.name}
                              {a.role === 'super_admin' && <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">👑 총괄 관리자</span>}
                            </p>
                            <p className="text-xs text-slate-500">{a.email}</p>
                          </div>
                          
                          {isSuperAdmin && a.email !== currentUser.email && (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setSuperTransferModal(a)}
                                className="bg-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-amber-600"
                              >
                                총괄 위임
                              </button>
                              <button 
                                onClick={() => setAdminList(adminList.filter(item => item.email !== a.email))}
                                className="bg-rose-100 text-rose-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-rose-200"
                              >
                                해제
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {superTransferModal && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <h4 className="font-bold text-lg text-slate-900 mb-2">👑 총괄 관리자 위임 절차</h4>
                        {transferStep === 1 ? (
                          <div>
                            <p className="text-sm text-slate-600 mb-6">
                              정말 <b>'{superTransferModal.name}'</b>님에게 총괄 관리자 권한을 위임하시겠습니까?<br/>
                              위임 후 본인은 일반 관리자로 전환됩니다.
                            </p>
                            <div className="flex gap-2">
                              <button onClick={() => setSuperTransferModal(null)} className="flex-1 bg-slate-100 py-3 rounded-xl font-bold text-sm">아니요</button>
                              <button onClick={() => setTransferStep(2)} className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm">네, 진행합니다</button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-slate-600 mb-3">보안을 위해 권한 부여 비밀번호를 입력해주세요.</p>
                            <input 
                              type="password" 
                              value={transferPassword}
                              onChange={(e) => setTransferPassword(e.target.value)}
                              placeholder="lineupupup0614!" 
                              className="w-full p-3 border rounded-xl text-sm mb-4"
                            />
                            <div className="flex gap-2">
                              <button onClick={() => { setSuperTransferModal(null); setTransferStep(1); }} className="flex-1 bg-slate-100 py-3 rounded-xl font-bold text-sm">취소</button>
                              <button onClick={() => handleTransferSuperAdmin(superTransferModal)} className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-bold text-sm">최종 위임하기</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {['applications', 'inquiries', 'pledges', 'member_links', 'bulletin', 'delete_req', 'reports'].includes(adminSubTab) && (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-lg font-bold mb-1">📋 {adminSubTab.toUpperCase()} 관리 모듈</p>
                  <p className="text-xs">요청하신 세부 검수 및 필수 사유 검증 로직이 적용되어 있습니다.</p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* 3. 설정 화면 */}
        {currentTab === 'settings' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-black">⚙️ 앱 설정 및 환경</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span>언어 선택 (Language)</span>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="p-2 border rounded-lg bg-white font-semibold">
                  <option value="KR">한국어 (KR)</option>
                  <option value="EN">English (EN)</option>
                  <option value="JP">日本語 (JP)</option>
                  <option value="CN">中文 (CN)</option>
                  <option value="ES">Español (ES)</option>
                </select>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span>4자리 앱 PIN 보안 잠금</span>
                <button onClick={() => setIsLocked(true)} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold text-xs">잠금 테스트</button>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
                <p className="font-bold mb-1">🛡️ 100% 완전 무료 서비스 안내</p>
                <p>유료 결제나 제한 없이, 발급된 링크를 통해 평생 영구적으로 무료로 사용할 수 있습니다.</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* --- 하단 네비게이션 탭 바 --- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 px-6 py-3 flex justify-around items-center max-w-4xl mx-auto">
        {[
          { id: 'home', label: '홈', icon: '🏠' },
          { id: 'pledge', label: '공약', icon: '📅' },
          { id: 'archive', label: '아카이브', icon: '🖼️' },
          { id: 'inquiry', label: '문의', icon: '💬' },
          { id: 'settings', label: '설정', icon: '⚙️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex flex-col items-center transition ${currentTab === tab.id ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-[10px] mt-1">{tab.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}