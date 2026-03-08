import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Xin chào! Tôi có thể tư vấn gì cho bạn hôm nay?' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage = inputText;
        setInputText('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('https://messenger-rag-bot-2.messenger-rag-bot.workers.dev/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'CHATBOT_SECRET_2026'
                },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            let botReply = '';
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                botReply = data.reply || data.response || data.message || data.answer || JSON.stringify(data);
            } else {
                botReply = await response.text();
            }

            setMessages(prev => [...prev, { role: 'bot', content: botReply }]);
        } catch (error) {
            console.error('Error calling chatbot API:', error);
            setMessages(prev => [...prev, { role: 'bot', content: 'Xin lỗi, có lỗi xảy ra khi kết nối đến máy chủ.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="font-sans text-slate-900 bg-white selection:bg-primary selection:text-white overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-green-200/30 rounded-full blur-[100px] opacity-60"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[80px] opacity-60"></div>
                <div className="absolute top-20 right-[5%] w-24 h-24 bg-gradient-to-br from-green-300 to-green-600 rounded-full opacity-20 animate-float-delayed blur-sm shadow-xl flex items-center justify-center transform rotate-12">
                    <span className="text-4xl font-bold text-green-100">$</span>
                </div>
                <div className="absolute bottom-40 -left-10 w-32 h-40 bg-gradient-to-br from-emerald-400 to-primary rounded-[2rem] opacity-10 animate-float blur-sm transform -rotate-12"></div>
                <div className="absolute top-1/3 left-[10%] w-16 h-16 bg-gradient-to-br from-green-200 to-emerald-500 rounded-full opacity-10 animate-float-slow blur-[2px]"></div>
            </div>

            <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-green-100/50">
                <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 cursor-pointer group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-custom flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300">
                            <span className="material-symbols-outlined text-white text-2xl">account_balance_wallet</span>
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-primary transition-colors">Smart<span className="text-primary">Pay</span></span>
                    </div>

                    <div className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-600">
                        <a className="hover:text-primary transition-colors" href="#">Trang chủ</a>
                        <a className="hover:text-primary transition-colors" href="#features">Tính năng</a>
                        <a className="hover:text-primary transition-colors" href="#savings">Tích lũy</a>
                        <a className="hover:text-primary transition-colors" href="#bill-payment">Thanh toán</a>
                        <a className="hover:text-primary transition-colors" href="#security">Bảo mật</a>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link to="/login" className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-primary hover:bg-green-50 transition-all rounded-custom">Đăng nhập</Link>
                        <Link to="/register" className="px-6 py-2 text-sm font-semibold text-white bg-primary hover:bg-accent transition-all rounded-custom shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center space-x-1">
                            <span>Đăng ký</span>
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="pt-24 relative z-10">
                <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-br from-white via-green-50/30 to-white" data-purpose="hero-container">
                    <div className="absolute inset-0 bg-grid-green opacity-[0.4] pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-emerald-100/50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-green-100/40 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

                    <div className="absolute top-20 right-10 md:right-32 w-20 h-20 border-4 border-green-200/40 rounded-full animate-float-slow"></div>
                    <div className="absolute bottom-32 left-10 w-12 h-12 bg-green-300/20 rounded-full animate-float-delayed"></div>

                    <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="animate-fade-in-up">
                            <div className="inline-flex items-center space-x-2 py-1.5 px-4 bg-white border border-green-200 shadow-sm text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-8">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span>Thế hệ ví điện tử 4.0</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                                Thanh Toán <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Thông Minh</span>, <br />Sống Động Từng Giây
                            </h1>

                            <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed font-medium">
                                Trải nghiệm hệ sinh thái tài chính toàn diện. Chuyển tiền miễn phí, thanh toán hóa đơn tự động và tích lũy lãi suất cao ngay trên điện thoại của bạn.
                            </p>

                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <button className="px-8 py-4 bg-primary text-white font-bold rounded-custom hover:-translate-y-1 transition-transform hover:bg-accent shadow-xl shadow-primary/30 flex items-center justify-center space-x-2 group">
                                    <span>Bắt đầu ngay</span>
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">rocket_launch</span>
                                </button>
                                <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold rounded-custom hover:bg-green-50 hover:border-green-200 hover:text-primary transition-all flex items-center justify-center space-x-2 shadow-sm">
                                    <span className="material-symbols-outlined text-green-500">play_circle</span>
                                    <span>Xem Demo</span>
                                </button>
                            </div>

                            <div className="mt-12 flex items-center space-x-6 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 w-fit shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex -space-x-3">
                                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1fU9ysuWx-pQ6C0J8E44_sFfwKd9t6ciZLRpTAvEFGPCaazpm5XOoEdh0Nrn6SEMSLby2xZb49IX1mM73QcCXKUwIDyyXa99lv-SGINGoEKIfwO2oKYkur8DOXqa1p06z6eI8itVdpFO8wS_PQMqZ6HYY1UQvXluhrVu6H0m9KieXonXmkSJloGTQHYV8kTB9Zf60dQp0y4Ofe8RwubfjX0ffJP09iS4qV3DuYZDH7ujW4ubVECBdfrgGzmpvZPQc387ctqMJOycI" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPxBPKWmLxIy5hS8rE9uBUTNLgYp3W9Kk0qSxhPIq8CwVoVuI_7X46Pbt-7ABVie86NNUvJUs8QNPMUqfC3mdVETNMSmWBjC8byu_LY46A70Or66V_0iUPJm-UyMsvfmxUKqpJVLx070mm2zSEiSkHAoArW4vdNE69saO6hzh8DoLq8pwEGC7e3szYXPcO0z2sLOMO3Wg2TPOaQEhOJIBg18GpsNxg-DprS89xYyPv3BRNsUHq4QgjrkLK5ij8h_po0BVspxB901vE" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKaCxEQKBjnNvqAcuAPuGFCYqLug2KSJHGD9XvPZcd_o4K8vSkj8Utuq6-U8hRoIfZ7Ys7qG9a08bZJuH1yp1w0BChQoZA53c5Z3XMbNGgk0TBBYheZAS3OFzRElc4THymudc7RHoJnVpOTs8GpjUDVikxRyKB-3mHR2ReTcNugGQDZQ5PC2Y0S9CMwiWUTS07Agvx8zyPrMhGWWVKMtoDQ6eeZ4HMYjyg3o76tOxEZWhFtFIAIei6C4onq0XRiesCo1bkC0IxZ4yi" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-green-50 flex items-center justify-center text-xs font-bold text-green-600">+2M</div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center text-yellow-500 space-x-1">
                                        <span className="material-symbols-outlined text-sm fill-current">star</span>
                                        <span className="material-symbols-outlined text-sm fill-current">star</span>
                                        <span className="material-symbols-outlined text-sm fill-current">star</span>
                                        <span className="material-symbols-outlined text-sm fill-current">star</span>
                                        <span className="material-symbols-outlined text-sm fill-current">star</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold mt-1">Được tin dùng bởi 2 triệu+ người Việt</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative hidden lg:block perspective-1000">
                            <div className="relative z-20 animate-float">
                                <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-20 blur-xl animate-pulse"></div>

                                <div className="card-shine bg-gradient-to-br from-[#059669] to-[#064e3b] p-8 rounded-[2rem] w-[380px] h-[240px] shadow-2xl shadow-green-900/40 relative overflow-hidden transform -rotate-6 z-20 mx-auto border border-white/10 backdrop-blur-xl">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

                                    <div className="flex flex-col h-full justify-between relative z-10">
                                        <div className="flex justify-between items-start">
                                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdm3sWaDrASYoF7dihVBhfr9gyOyIK9EOFlOddl0wx6uLVPd_NLLtPMXtkwpfnhztL99wsxZsWSaNbWJ28djs-fYy8h6wsIkYzS4Wxnd8MoiotbjwbGk40ROuJOom9MeDUzRvONuxp7XmaEwkpxfHh4iN9PkcEuvTu3C0Dk_ZAZh0QUjMGRwhDL2RHVrTNW6YrpAXtV3_AgpqGzZVHusaT59ZKojtWyxO8zSzthiPeZN7qkN53CeRJfgvVHVsYfNSzUDdIfMXE6Abq" alt="Mastercard" className="h-10 object-contain brightness-0 invert opacity-80" />
                                            <span className="material-symbols-outlined text-white/80 text-3xl">contactless</span>
                                        </div>
                                        <div className="text-white space-y-4">
                                            <div className="flex space-x-3 items-center opacity-80 font-mono tracking-widest text-lg">
                                                <span>••••</span><span>••••</span><span>••••</span><span>8892</span>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] uppercase opacity-60 font-bold mb-1">Chủ thẻ</p>
                                                    <p className="text-sm font-semibold tracking-wide">NGUYEN VAN A</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase opacity-60 font-bold mb-1 text-right">Hết hạn</p>
                                                    <p className="text-sm font-semibold">12/28</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -top-10 right-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl animate-float-delayed z-30 flex items-center space-x-3 border border-white/50">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <span className="material-symbols-outlined">arrow_upward</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Thu nhập</p>
                                        <p className="text-sm font-bold text-slate-800">+$2,450.00</p>
                                    </div>
                                </div>

                                <div className="absolute -bottom-5 -left-5 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl animate-float-slow z-30 flex items-center space-x-3 border border-white/50">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <span className="material-symbols-outlined">savings</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Tiết kiệm</p>
                                        <p className="text-sm font-bold text-slate-800">8.5% /năm</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-8 left-20 bg-gradient-to-br from-slate-100 to-slate-200 p-6 rounded-[2rem] w-[360px] h-[220px] shadow-lg transform rotate-6 z-10 border border-white opacity-80"></div>
                            <div className="absolute top-1/2 -right-12 w-16 h-16 bg-gradient-to-br from-green-300 to-emerald-600 rounded-full blur-[1px] opacity-80 animate-float-delayed z-0" style={{ boxShadow: 'inset -4px -4px 10px rgba(0,0,0,0.2), inset 4px 4px 10px rgba(255,255,255,0.4)' }}></div>
                        </div>
                    </div>
                </section>

                <section className="py-10 border-y border-green-100/50 bg-green-50/30 overflow-hidden">
                    <div className="container mx-auto px-6 mb-6 text-center">
                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Đối tác chiến lược</p>
                    </div>
                    <div className="relative w-full overflow-hidden">
                        <div className="flex animate-scroll w-[200%]">
                            <div className="flex space-x-16 items-center px-8 w-1/2 justify-around opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                <span className="text-2xl font-bold text-slate-800 hover:text-primary transition-colors">SHOPEE</span>
                                <span className="text-2xl font-bold text-slate-800 hover:text-primary transition-colors">LAZADA</span>
                                <span className="text-2xl font-bold text-slate-800 hover:text-primary transition-colors">TIKI</span>
                                <span className="text-2xl font-bold text-slate-800 hover:text-primary transition-colors">GRAB</span>
                                <span className="text-2xl font-bold text-slate-800 hover:text-primary transition-colors">BE</span>
                                <span className="text-2xl font-bold text-slate-800 hover:text-primary transition-colors">NETFLIX</span>
                                <span className="text-2xl font-bold text-slate-800 hover:text-primary transition-colors">SPOTIFY</span>
                            </div>
                            <div className="flex space-x-16 items-center px-8 w-1/2 justify-around opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                <span className="text-2xl font-bold text-slate-800 hover:text-primary transition-colors">SHOPEE</span>
                                <span className="text-2xl font-bold text-slate-800 hover:text-primary transition-colors">LAZADA</span>
                                <span className="text-2xl font-bold text-slate-800 hover:text-primary transition-colors">TIKI</span>
                                <span className="text-2xl font-bold text-slate-800 hover:text-primary transition-colors">GRAB</span>
                                <span className="text-2xl font-bold text-slate-800 hover:text-primary transition-colors">BE</span>
                                <span className="text-2xl font-bold text-slate-800 hover:text-primary transition-colors">NETFLIX</span>
                                <span className="text-2xl font-bold text-slate-800 hover:text-primary transition-colors">SPOTIFY</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-white relative watermark-pattern" data-purpose="features-section" id="features">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-transparent to-white pointer-events-none"></div>
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center max-w-2xl mx-auto mb-20">
                            <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 text-slate-900">Tính năng nổi bật</h2>
                            <p className="text-slate-500 text-lg">Mọi thứ bạn cần để làm chủ tài chính cá nhân trong một ứng dụng duy nhất.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="feature-card p-8 bg-white border border-green-100 rounded-3xl transition-all duration-300 group hover:border-primary/40 shadow-sm" data-purpose="feature-card">
                                <div className="w-16 h-16 bg-green-50 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-green-100">
                                    <span className="material-symbols-outlined text-3xl">bolt</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-primary transition-colors">Chuyển tiền thần tốc</h3>
                                <p className="text-slate-500 leading-relaxed">Gửi và nhận tiền tức thì 24/7, hoàn toàn miễn phí. Chỉ cần số điện thoại hoặc mã QR.</p>
                            </div>

                            <div className="feature-card p-8 bg-white border border-green-100 rounded-3xl transition-all duration-300 group hover:border-primary/40 shadow-sm" data-purpose="feature-card">
                                <div className="w-16 h-16 bg-green-50 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-green-100">
                                    <span className="material-symbols-outlined text-3xl">shield_lock</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-primary transition-colors">Bảo mật đa lớp</h3>
                                <p className="text-slate-500 leading-relaxed">Công nghệ mã hoá AES-256 kết hợp cùng xác thực sinh trắc học (FaceID/Vân tay) hàng đầu.</p>
                            </div>

                            <div className="feature-card p-8 bg-white border border-green-100 rounded-3xl transition-all duration-300 group hover:border-primary/40 shadow-sm" data-purpose="feature-card">
                                <div className="w-16 h-16 bg-green-50 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-green-100">
                                    <span className="material-symbols-outlined text-3xl">qr_code_scanner</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-primary transition-colors">Thanh toán QR</h3>
                                <p className="text-slate-500 leading-relaxed">Quét mã thanh toán tại hơn 100,000 điểm chấp nhận thẻ trên toàn quốc. Tiện lợi và không tiền mặt.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-gradient-to-br from-green-50/50 to-white relative overflow-hidden" id="savings">
                    <div className="absolute -right-20 top-20 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute left-10 bottom-10 w-64 h-64 bg-primary/5 rounded-full blur-2xl"></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1">
                                <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Tích lũy thông minh</span>
                                <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">Biến Tiền Nhàn Rỗi Thành <br /> <span className="text-emerald-500">Lợi Nhuận Hấp Dẫn</span></h2>
                                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                    Không cần số vốn lớn, bạn có thể bắt đầu tích lũy chỉ từ 10.000đ. Rút tiền linh hoạt bất cứ lúc nào mà không mất lãi suất đã tích lũy.
                                </p>

                                <div className="space-y-6 mb-10">
                                    <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow hover:border-primary/30">
                                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mr-5 shrink-0">
                                            <span className="material-symbols-outlined">trending_up</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">Lãi suất lên đến 7.5%/năm</h4>
                                            <p className="text-slate-500 text-sm">Cao hơn gửi tiết kiệm ngân hàng truyền thống.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow hover:border-primary/30">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-5 shrink-0">
                                            <span className="material-symbols-outlined">payments</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">Bắt đầu chỉ từ 10.000đ</h4>
                                            <p className="text-slate-500 text-sm">Dễ dàng tiếp cận, tích tiểu thành đại mỗi ngày.</p>
                                        </div>
                                    </div>
                                </div>

                                <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-custom hover:bg-primary transition-colors shadow-lg shadow-slate-900/20 hover:shadow-primary/30">
                                    Mở Túi Thần Tài Ngay
                                </button>
                            </div>

                            <div className="order-1 lg:order-2 relative flex justify-center">
                                <div className="relative w-full max-w-md aspect-square">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50 to-white rounded-full shadow-inner border border-emerald-100"></div>
                                    <div className="absolute inset-0 border border-green-100 rounded-full scale-110 opacity-50"></div>
                                    <div className="absolute inset-0 border border-green-50 rounded-full scale-125 opacity-30"></div>

                                    <div className="absolute top-1/4 left-1/4 animate-float">
                                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLCY9U7ed7jk7nk2tDRY4FnsxpOmozYa29BmsabHVcRT3musDJebEmkct4mjE2B_tPCyILQ9vR_mIe75EkwzHjhcvUkx-YDO0mDuKOBSapTzDOZRK-t-ls37-bcsYiPcNlES42mcfyaxhOQR4Irg9Km4s8ZrRB7B4gFWgKVG5-7Yh_yFCETgC45aMoN1WOzbkh4frL57yn_7-eW8SJqqFdXDbO1raFrw3M37T7q-AR-dufO37wvrqtfM3M1nB2tR3GuIHfWFoHyOU-" alt="Coin" className="w-20 h-20 drop-shadow-xl" style={{ transform: "rotate(-15deg)" }} />
                                    </div>
                                    <div className="absolute bottom-1/3 right-1/4 animate-float-delayed">
                                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXF81N1oyu0uceA0TWTafu7C-G4Qdp8nrZpGEKM0eGQIn0i0MFWNxyaP6kIFONhnsjap-CG4aaP8s7cyeresALCWaX0v-b2JtsAh3n7AWBRTg3YXVTcj4Zacm9qBfXAs8hRX5cEgRsXOSelbgfqAgeQV5V-lA0CROBaxLgkZQdeq1_UboEcHlzczM5q1UVzQZzQ85hcU3YnvEdantoMfLnGfOQ-My9IntlI4zvjLJU5WD3iIYKqZTKb_DsO9tRkuOIwFmxHYqCH28k" alt="Coin Stack" className="w-24 h-24 drop-shadow-xl" style={{ transform: "rotate(15deg)" }} />
                                    </div>

                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-emerald-100 min-w-[200px]">
                                        <p className="text-slate-500 text-sm mb-1">Tổng tài sản tích lũy</p>
                                        <p className="text-3xl font-bold text-slate-900">54,230,000đ</p>
                                        <div className="text-primary text-xs font-bold mt-2 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm mr-1">arrow_upward</span>
                                            +1,204,000đ (lãi tháng này)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-white relative watermark-pattern" id="bill-payment">
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl font-extrabold mb-4 text-slate-900">Thanh Toán Hóa Đơn Một Chạm</h2>
                            <p className="text-slate-500 text-lg">Quên đi nỗi lo trễ hạn đóng phí. SmartPay nhắc lịch và tự động thanh toán mọi hóa đơn sinh hoạt của gia đình bạn.</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            <div className="group cursor-pointer">
                                <div className="h-28 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center shadow-sm group-hover:border-primary group-hover:shadow-md transition-all">
                                    <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-100 transition-colors">
                                        <span className="material-symbols-outlined">lightbulb</span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">Điện</span>
                                </div>
                            </div>

                            <div className="group cursor-pointer">
                                <div className="h-28 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center shadow-sm group-hover:border-primary group-hover:shadow-md transition-all">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                                        <span className="material-symbols-outlined">water_drop</span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">Nước</span>
                                </div>
                            </div>

                            <div className="group cursor-pointer">
                                <div className="h-28 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center shadow-sm group-hover:border-primary group-hover:shadow-md transition-all">
                                    <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
                                        <span className="material-symbols-outlined">wifi</span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">Internet</span>
                                </div>
                            </div>

                            <div className="group cursor-pointer">
                                <div className="h-28 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center shadow-sm group-hover:border-primary group-hover:shadow-md transition-all">
                                    <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-pink-100 transition-colors">
                                        <span className="material-symbols-outlined">tv</span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">Truyền hình</span>
                                </div>
                            </div>

                            <div className="group cursor-pointer">
                                <div className="h-28 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center shadow-sm group-hover:border-primary group-hover:shadow-md transition-all">
                                    <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-100 transition-colors">
                                        <span className="material-symbols-outlined">smartphone</span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">Nạp ĐT</span>
                                </div>
                            </div>

                            <div className="group cursor-pointer">
                                <div className="h-28 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center shadow-sm group-hover:border-primary group-hover:shadow-md transition-all">
                                    <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors">
                                        <span className="material-symbols-outlined">school</span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">Học phí</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-gradient-to-b from-green-50/40 to-white relative">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl font-extrabold mb-4 text-slate-900">Bắt đầu dễ dàng chỉ với 3 bước</h2>
                            <p className="text-slate-500">Quy trình đơn giản, nhanh chóng giúp bạn tiếp cận dịch vụ ngay lập tức.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 relative">
                            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gradient-to-r from-green-100 via-emerald-200 to-green-100 z-0"></div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-green-50 flex items-center justify-center mb-6 relative hover:scale-110 transition-transform duration-300">
                                    <span className="text-4xl font-bold text-primary">1</span>
                                    <div className="absolute -right-2 -top-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md ring-4 ring-white">
                                        <span className="material-symbols-outlined text-sm">download</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900">Tải ứng dụng</h3>
                                <p className="text-slate-500 max-w-xs">Tìm kiếm "SmartPay" trên App Store hoặc Google Play và tải về máy.</p>
                            </div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-green-50 flex items-center justify-center mb-6 relative hover:scale-110 transition-transform duration-300">
                                    <span className="text-4xl font-bold text-primary">2</span>
                                    <div className="absolute -right-2 -top-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md ring-4 ring-white">
                                        <span className="material-symbols-outlined text-sm">person_add</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900">Đăng ký tài khoản</h3>
                                <p className="text-slate-500 max-w-xs">Nhập số điện thoại và xác thực danh tính (eKYC) chỉ trong 2 phút.</p>
                            </div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-green-50 flex items-center justify-center mb-6 relative hover:scale-110 transition-transform duration-300">
                                    <span className="text-4xl font-bold text-primary">3</span>
                                    <div className="absolute -right-2 -top-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md ring-4 ring-white">
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900">Liên kết &amp; Trải nghiệm</h3>
                                <p className="text-slate-500 max-w-xs">Liên kết ngân hàng và bắt đầu thanh toán tiện lợi ngay.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-[#064e3b] text-white overflow-hidden relative" id="security">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 20 20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\' fill-rule=\\'evenodd\\'%3E%3Ccircle cx=\\'3\\' cy=\\'3\\' r=\\'3\\'/%3E%3Ccircle cx=\\'13\\' cy=\\'13\\' r=\\'3\\'/%3E%3C/g%3E%3C/svg%3E')" }}></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b] to-[#042f2e] z-0"></div>
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]"></div>

                    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
                        <div>
                            <span className="text-green-300 font-bold tracking-widest uppercase text-xs mb-4 block">An toàn là trên hết</span>
                            <h2 className="text-4xl font-extrabold mb-8 leading-tight">An Tâm Tuyệt Đối Với Hệ Thống Bảo Mật Chuẩn Quốc Tế</h2>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-green-400/20 rounded-lg flex items-center justify-center shrink-0 mt-1 border border-green-400/50">
                                        <span className="material-symbols-outlined text-green-300 text-sm">verified_user</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1 text-lg">Chứng chỉ PCI DSS Level 1</h4>
                                        <p className="text-slate-300 text-sm">Tiêu chuẩn bảo mật cao nhất toàn cầu trong lĩnh vực thẻ thanh toán và lưu trữ dữ liệu.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-teal-400/20 rounded-lg flex items-center justify-center shrink-0 mt-1 border border-teal-400/50">
                                        <span className="material-symbols-outlined text-teal-300 text-sm">lock_person</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1 text-lg">Xác thực 2 yếu tố (2FA)</h4>
                                        <p className="text-slate-300 text-sm">Mọi giao dịch đều được bảo vệ bởi lớp mật khẩu động OTP gửi riêng về thiết bị của bạn.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10">
                                <button className="px-6 py-3 border border-white/30 rounded-lg text-sm hover:bg-white/10 transition-colors flex items-center space-x-2 bg-white/5 backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-lg">policy</span>
                                    <span>Xem chính sách bảo mật chi tiết</span>
                                </button>
                            </div>
                        </div>

                        <div className="relative flex justify-center">
                            <div className="w-80 h-80 bg-primary/20 rounded-full flex items-center justify-center animate-pulse-soft relative">
                                <div className="absolute inset-0 border border-primary/30 rounded-full animate-ping opacity-20" style={{ animationDuration: "3s" }}></div>
                                <div className="absolute inset-4 border border-primary/40 rounded-full"></div>

                                <div className="relative z-10 bg-gradient-to-br from-primary to-emerald-700 w-40 h-40 rounded-3xl shadow-2xl flex items-center justify-center transform rotate-6 border border-white/10">
                                    <span className="material-symbols-outlined text-white text-7xl drop-shadow-lg">lock</span>
                                </div>

                                <div className="absolute top-10 right-10 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs border border-white/20 animate-float text-green-50">Encrypted</div>
                                <div className="absolute bottom-10 left-10 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs border border-white/20 animate-float-delayed text-green-50">Secured</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200" id="support">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                        <div className="col-span-2">
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="w-8 h-8 bg-primary rounded-custom flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-lg">account_balance_wallet</span>
                                </div>
                                <span className="text-xl font-bold text-slate-900">Smart<span className="text-primary">Pay</span></span>
                            </div>
                            <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">Giải pháp thanh toán số hiện đại, an toàn và tiện lợi nhất cho người Việt. Đồng hành cùng bạn trên mọi hành trình tài chính.</p>
                            <div className="flex space-x-4">
                                <a className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors text-slate-500" href="#">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
                                </a>
                                <a className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors text-slate-500" href="#">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 5.838a6.162 6.162 0 10.001 12.324A6.162 6.162 0 0012 5.838zM12 16.3a4.138 4.138 0 110-8.276 4.138 4.138 0 010 8.276zm5.89-10.329a1.108 1.108 0 11-2.215 0 1.108 1.108 0 012.215 0z"></path></svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-slate-800">SmartPay</h4>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li><a className="hover:text-primary transition-colors" href="#">Về chúng tôi</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Tuyển dụng</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Tin tức</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-slate-800">Hỗ trợ</h4>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li><a className="hover:text-primary transition-colors" href="#">Trung tâm trợ giúp</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Biểu phí</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Liên hệ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-slate-800">Tải ứng dụng</h4>
                            <div className="space-y-3">
                                <a className="block px-4 py-2 bg-slate-900 text-white rounded-custom text-xs flex items-center space-x-2 hover:bg-primary transition-colors" href="#">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.5 13c-.01-3.21 2.62-4.75 2.74-4.83-1.49-2.18-3.81-2.48-4.63-2.52-1.96-.2-3.82 1.16-4.82 1.16-1 0-2.52-1.14-4.16-1.11-2.15.03-4.13 1.25-5.24 3.17-2.24 3.88-.57 9.61 1.61 12.75 1.06 1.54 2.32 3.26 3.99 3.2 1.6-.06 2.21-1.03 4.14-1.03s2.48 1.03 4.16 1c1.72-.03 2.82-1.54 3.87-3.07 1.22-1.78 1.72-3.51 1.74-3.6-.04-.01-3.34-1.28-3.37-5.14zM14.6 3.51c.88-1.07 1.47-2.55 1.31-4.01-1.25.05-2.77.83-3.67 1.88-.81.93-1.52 2.45-1.33 3.86 1.39.11 2.82-.66 3.69-1.73z"></path></svg>
                                    <div>
                                        <p className="text-[10px] opacity-70">Download on the</p>
                                        <p className="font-bold">App Store</p>
                                    </div>
                                </a>
                                <a className="block px-4 py-2 bg-slate-900 text-white rounded-custom text-xs flex items-center space-x-2 hover:bg-primary transition-colors" href="#">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M5.5 3.5L12 10L18.5 3.5L5.5 3.5ZM4.5 4.5V19.5L11.5 12.5L4.5 4.5ZM19.5 4.5V19.5L12.5 12.5L19.5 4.5ZM5.5 20.5L12 14L18.5 20.5L5.5 20.5Z"></path></svg>
                                    <div>
                                        <p className="text-[10px] opacity-70">Get it on</p>
                                        <p className="font-bold">Google Play</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                        <p>© 2023 SmartPay JSC. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a className="hover:text-primary" href="#">Điều khoản sử dụng</a>
                            <a className="hover:text-primary" href="#">Chính sách bảo mật</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Chatbot Button */}
            <button
                onClick={() => setIsChatOpen(true)}
                className={`fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform z-50 ${isChatOpen ? 'hidden' : 'block'}`}
            >
                <span className="material-symbols-outlined text-3xl">chat</span>
            </button>

            {/* Chatbot Window */}
            <div className={`fixed bottom-6 right-6 w-[350px] bg-white rounded-2xl shadow-2xl border border-green-100 z-50 overflow-hidden flex-col transition-all duration-300 origin-bottom-right ${isChatOpen ? 'scale-100 opacity-100 flex' : 'scale-0 opacity-0 hidden'}`}>
                {/* Header */}
                <div className="bg-primary text-white p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="material-symbols-outlined">support_agent</span>
                        <h3 className="font-bold">Chatbot Tư Vấn</h3>
                    </div>
                    <button onClick={() => setIsChatOpen(false)} className="hover:text-green-200 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Message list */}
                <div className="h-[400px] p-4 overflow-y-auto bg-slate-50 flex flex-col space-y-3">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-[80%] p-3 rounded-2xl bg-white border border-slate-200 rounded-tl-none shadow-sm flex items-center space-x-2">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputText.trim()}
                        className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-accent disabled:opacity-50 disabled:hover:bg-primary transition-colors flex-shrink-0"
                    >
                        <span className="material-symbols-outlined text-sm">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
