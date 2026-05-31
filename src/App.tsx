import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Camera, 
  Shirt, 
  ChevronRight, 
  Sparkles, 
  User, 
  Palette, 
  RefreshCcw, 
  CheckCircle2, 
  Play,
  ArrowRight,
  ArrowLeft,
  Info,
  Zap,
  Film,
  Download,
  Share2,
  X
} from 'lucide-react';

// --- Types ---
type Step = 'UPLOAD' | 'ANALYSIS' | 'EXPERTS' | 'SHOOTING' | 'LOOKBOOK' | 'POST_PROCESSING' | 'FINAL';

interface MockData {
  id: number;
  stylistPlan: string;
  stylistPlanCn: string;
  makeupPlan: string;
  makeupPlanCn: string;
  makeupImg: string;
  lookbookImg: string;
  finalBlockbusters: string[];
  finalVideo: string;
}

const MOCK_DATA: MockData = {
  id: 1,
  stylistPlan: "Corduroy‑toned denim bomber jacket, vintage‑washed graphic hoodie, two‑toned waistband underwear, ripped split‑hem wide‑leg jeans, fuchsia backpack, slim‑fit sunglasses, polished chunky‑sole leather loafers.",
  stylistPlanCn: "身穿做旧牛仔短款夹克，做旧印花连帽卫衣，撞色腰边内裤，破洞开衩阔腿牛仔裤，玫红色双肩背包，修身款墨镜，亮面乐福皮鞋。",
  makeupPlan: "Street trendsetters, trendy makeup, a clean parted eyebrow effect at the end of the left eyebrow, clear and deep eyes. Perfect matte foundation, the signature dark contouring perfectly sculpts the three-dimensional jawline and cheekbone contours, clear lip lines, and moist and plump lips.",
  makeupPlanCn: "街头弄潮儿，潮流妆容，左侧眉尾有一道干净的断眉效果，清澈深邃的眼神。完美的哑光底妆，标志性的深色修容完美雕刻出立体的下颌线和颧骨轮廓，清晰的毛流感，嘴唇滋润饱满。",
  makeupImg: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800",
  lookbookImg: "https://i.postimg.cc/8c8Hvpsj/Gemini-Generated-Image-615a79615a79615a.png",
  finalBlockbusters: [
    "https://i.postimg.cc/QdjfSdm9/tu-ceng-2.png",
    "https://i.postimg.cc/QdjfSdmV/tu-ceng-3.png",
    "https://i.postimg.cc/NjQdbjDF/tu-ceng-4.png",
    "https://i.postimg.cc/htK2Mtsf/tu-ceng-5.png"
  ],
  finalVideo: "https://litter.catbox.moe/6r7ozzbzdr3h4pp0.mp4"
};

const MOCK_DATA_2: MockData = {
  id: 2,
  stylistPlan: "Pink and white watercolor floral print halter fluttering ribbon top, distressed ripped blue denim skirt, white platform sandals, colorful shell layered necklace, pink mini crossbody bag, white large hoop earrings, light blue sunglasses, colorful beaded ring.",
  stylistPlanCn: "身穿粉白水彩花卉印花挂脖飘带上衣，做旧破洞蓝色牛仔短裙，白色厚底防水台凉鞋，彩色贝壳叠戴项链，粉色迷你斜挎包，白色大圈耳环，头顶佩戴浅蓝色墨镜，彩色串珠戒指",
  makeupPlan: "Sweet pink atmospheric sun-kissed blush look with natural freckles, large area of pink-toned blush across mid-face and cheekbones. Pink-purple pearl sequins spread over eyelids, wild natural fluffy eyebrows, watery mirror glass lip glaze. Transparent and delicate skin with natural glow, no excessive skin-smoothing. Deep brown natural big waves, fluffy and airy hair.",
  makeupPlanCn: "甜粉氛围感晒伤腮红妆，脸上带有自然原生雀斑，大面积粉调腮红横扫面中与颧骨。眼睑铺满细腻的粉紫调珠光闪片，野生自然毛流感眉形，嘴唇涂抹水润镜面玻璃唇釉。皮肤通透细腻，带有自然原生光泽感，无过度磨皮修图。头发为深棕自然大波浪卷发，发丝蓬松有空气感。",
  makeupImg: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800",
  lookbookImg: "https://i.postimg.cc/hjcyJZG5/op1.png",
  finalBlockbusters: [
    "https://i.postimg.cc/76wsCtLK/Gemini-Generated-Image-a62tga62tga62tga.png",
    "https://i.postimg.cc/Qxq0wZjF/jie-ping2026-05-16-13-37-43.png",
    "https://i.postimg.cc/d1wH7N02/jie-ping2026-05-16-11-35-14.png",
    "https://i.postimg.cc/HkVX2qxK/jie-ping2026-05-16-13-39-59.png"
  ],
  finalVideo: "https://litter.catbox.moe/p5262id6kdpu34t1.mp4"
};

// --- Components ---

const ScreenWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="w-full h-full flex flex-col p-6 max-w-lg mx-auto"
  >
    {children}
  </motion.div>
);

export default function App() {
  const [step, setStep] = useState<Step>('UPLOAD');
  const [currentMock, setCurrentMock] = useState(MOCK_DATA);
  const [userImg, setUserImg] = useState<string | null>(null);
  const [outfitImg, setOutfitImg] = useState<string | null>(null);
  const [finalPhotoIdx, setFinalPhotoIdx] = useState(0);
  const [finalView, setFinalView] = useState<'PHOTO' | 'VIDEO'>('PHOTO');
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [zoomVideo, setZoomVideo] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<'SINGLE' | 'GRID'>('GRID');

  const handleNext = React.useCallback(() => {
    if (step === 'UPLOAD') setStep('ANALYSIS');
    else if (step === 'ANALYSIS') setStep('EXPERTS');
    else if (step === 'EXPERTS') setStep('SHOOTING');
    else if (step === 'SHOOTING') setStep('LOOKBOOK');
    else if (step === 'LOOKBOOK') setStep('POST_PROCESSING');
    else if (step === 'POST_PROCESSING') setStep('FINAL');
  }, [step]);

  const handleBack = () => {
    if (step === 'EXPERTS') setStep('UPLOAD');
    else if (step === 'LOOKBOOK') setStep('EXPERTS');
    else if (step === 'FINAL') setStep('LOOKBOOK');
    else if (step === 'POST_PROCESSING') setStep('LOOKBOOK');
  };

  const handleReset = () => {
    setStep('UPLOAD');
    setUserImg(null);
    setOutfitImg(null);
    setCurrentMock(MOCK_DATA);
    setFinalPhotoIdx(0);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center">
      {/* Navigation Header */}
      <nav className="w-full h-16 px-8 border-b border-zinc-800 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold text-lg select-none">F</div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-sm tracking-tight uppercase text-white">FASHION FITTING ROOM</span>
            <span className="font-bold text-[10px] tracking-tight opacity-70 text-white">AI智能试衣间</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end gap-0.5 text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-none">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              PROCESSOR: {step === 'ANALYSIS' ? 'PROCESSING' : 'READY'}
            </div>
            <div className="opacity-50">{step === 'ANALYSIS' ? '处理中' : '就绪'}</div>
          </div>
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-zinc-800 rounded-full text-[10px] font-black text-white hover:bg-zinc-700 transition-all uppercase tracking-widest flex flex-col items-center leading-tight"
          >
            <span>Reset</span>
            <span className="opacity-60 text-[8px]">重置</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 w-full overflow-hidden flex flex-col relative">
        <AnimatePresence>
          {zoomImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4"
              onClick={() => setZoomImage(null)}
            >
              <button 
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all z-10"
                onClick={(e) => { e.stopPropagation(); setZoomImage(null); }}
              >
                <X size={28} />
              </button>
              <motion.img 
                layoutId="zoom-img"
                src={zoomImage} 
                className="max-w-full max-h-full object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-lg"
                style={{ imageRendering: 'auto' }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              />
            </motion.div>
          )}

          {zoomVideo && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4"
              onClick={() => setZoomVideo(null)}
            >
              <button 
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all z-10"
                onClick={(e) => { e.stopPropagation(); setZoomVideo(null); }}
              >
                <X size={28} />
              </button>
              <motion.div 
                className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <video 
                  src={zoomVideo}
                  className="w-full h-full object-contain"
                  autoPlay
                  controls
                  playsInline
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 'UPLOAD' && (
            <div key="upload" className="w-full h-full">
              <ScreenWrapper>
                <header className="mb-10 text-center md:text-left">
                  <h1 className="text-4xl font-black tracking-tighter leading-none mb-4 uppercase text-white">
                    Upload Reference
                    <br />
                    <span className="text-3xl">上传参考</span>
                  </h1>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                    Stage 01: Character & Style Mapping
                    <br />
                    人物与风格匹配
                  </p>
                </header>

                <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pb-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group relative aspect-[3/4] md:aspect-auto md:h-64 w-full bg-zinc-900 rounded-3xl border border-dashed border-zinc-800 flex flex-col items-center justify-center p-4 transition-all hover:bg-zinc-800/50 hover:border-primary/50 overflow-hidden">
                      {userImg ? (
                        <img src={userImg} className="absolute inset-0 w-full h-full object-contain bg-zinc-950" alt="User" />
                      ) : (
                        <>
                          <User className="text-zinc-600 mb-3" size={32} />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center">Subject Photo<br/>本人照片</span>
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                            if (e.target.files?.[0]) setUserImg(URL.createObjectURL(e.target.files[0]))
                          }} />
                        </>
                      )}
                    </div>

                    <div className="group relative aspect-[3/4] md:aspect-auto md:h-64 w-full bg-zinc-900 rounded-3xl border border-dashed border-zinc-800 flex flex-col items-center justify-center p-4 transition-all hover:bg-zinc-800/50 hover:border-secondary/50 overflow-hidden">
                      {outfitImg ? (
                        <img src={outfitImg} className="absolute inset-0 w-full h-full object-contain bg-zinc-950" alt="Outfit" />
                      ) : (
                        <>
                          <Shirt className="text-zinc-600 mb-3" size={32} />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center">Outfit Ref<br/>服装参考</span>
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                            if (e.target.files?.[0]) setOutfitImg(URL.createObjectURL(e.target.files[0]))
                          }} />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                    <h3 className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-4">
                      Analysis Prompt
                      <br />
                      分析描述
                    </h3>
                    <textarea 
                      placeholder="Input creative direction...&#10;输入创作指令..."
                      className="w-full bg-transparent border-none text-white placeholder:text-zinc-700 text-sm italic leading-relaxed focus:ring-0 resize-none h-24"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={handleNext}
                    disabled={!userImg || !outfitImg}
                    className="group relative w-full p-1 rounded-full bg-gradient-to-tr from-primary to-secondary disabled:opacity-30 disabled:grayscale transition-all active:scale-95"
                  >
                    <div className="bg-black hover:bg-transparent transition-colors px-10 py-5 rounded-full flex flex-col items-center gap-1">
                      <span className="font-black text-lg tracking-tighter uppercase text-white">Generate Proposal</span>
                      <span className="text-xs font-bold opacity-70 text-white">生成方案</span>
                    </div>
                  </button>
                </div>
              </ScreenWrapper>
            </div>
          )}

          {step === 'ANALYSIS' && (
            <motion.div key="analysis" className="w-full h-full">
              <AnalysisAnimation onComplete={() => setStep('EXPERTS')} />
            </motion.div>
          )}

          {step === 'EXPERTS' && (
            <div key="experts" className="w-full h-full">
              <ScreenWrapper>
                <header className="mb-6">
                  <h1 className="text-3xl font-black tracking-tighter leading-none mb-2 uppercase text-white">
                    Styling Vision
                    <br />
                    造型方案
                  </h1>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                    Stage 02: Lead Experts Feedback
                    <br />
                    专家反馈
                  </p>
                </header>

                <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar pb-10">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button 
                      onClick={() => setCurrentMock(MOCK_DATA)}
                      className={`p-3 rounded-2xl border transition-all ${currentMock.id === 1 ? 'bg-primary border-primary text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                    >
                      <span className="text-[10px] font-black uppercase">Scheme 01<br/>方案一</span>
                    </button>
                    <button 
                      onClick={() => setCurrentMock(MOCK_DATA_2)}
                      className={`p-3 rounded-2xl border transition-all ${currentMock.id === 2 ? 'bg-secondary border-secondary text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                    >
                      <span className="text-[10px] font-black uppercase">Scheme 02<br/>方案二</span>
                    </button>
                  </div>

                  <motion.div 
                    key={currentMock.id + 'stylist'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="zinc-border bg-zinc-900/40 rounded-3xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center border border-white/10 italic font-serif text-lg text-white">S</div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-tight text-white">Main Stylist / 搭配师</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/90 leading-relaxed font-serif opacity-90">
                      {currentMock.stylistPlan}
                    </p>
                    <p className="text-xs text-white/60 leading-relaxed mt-2 italic">
                      {currentMock.stylistPlanCn}
                    </p>
                  </motion.div>

                  <motion.div 
                    key={currentMock.id + 'glam'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="zinc-border bg-zinc-900/40 rounded-3xl overflow-hidden p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-secondary text-black flex items-center justify-center border border-black/10 italic font-serif text-lg">G</div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-tight text-white">Glam Director / 妆造师</p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-serif">
                      {currentMock.makeupPlan}
                    </p>
                    <p className="text-xs text-zinc-500 leading-relaxed mt-2 italic">
                      {currentMock.makeupPlanCn}
                    </p>
                  </motion.div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={handleBack}
                    className="flex-1 py-4 bg-zinc-900 text-white rounded-full font-black text-sm uppercase transition-all active:scale-95 border border-zinc-800"
                  >
                    Back / 返回
                  </button>
                  <button 
                    onClick={handleNext}
                    className="flex-[2] py-4 bg-white text-black rounded-full font-black text-sm uppercase transition-all active:scale-95"
                  >
                    Shooting / 进入拍摄
                  </button>
                </div>
              </ScreenWrapper>
            </div>
          )}

          {step === 'SHOOTING' && (
            <motion.div key="shooting" className="w-full h-full">
              <ShootingAnimation onComplete={() => setStep('LOOKBOOK')} />
            </motion.div>
          )}

          {step === 'LOOKBOOK' && (
            <div key="lookbook" className="w-full h-full">
              <ScreenWrapper>
                <header className="mb-6 flex justify-between items-center">
                  <button 
                    onClick={handleBack}
                    className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white active:scale-95 transition-all"
                  >
                    <ChevronRight size={18} className="rotate-180" />
                  </button>
                  <h1 className="text-2xl font-black tracking-tighter uppercase leading-none text-center text-white">
                    LOOK BOOK / 内容展示
                  </h1>
                  <div className="w-10 h-10" />
                </header>

                <div className="flex-1 flex flex-col min-h-0 items-center justify-center p-4 bg-zinc-900 rounded-[2rem] zinc-border relative group overflow-hidden cursor-zoom-in"
                     onClick={() => setZoomImage(currentMock.lookbookImg)}>
                  <motion.img 
                    layoutId={zoomImage === currentMock.lookbookImg ? "zoom-img" : undefined}
                    src={currentMock.lookbookImg} 
                    className="w-full h-full object-contain shadow-2xl transition-transform duration-[2000ms] group-hover:scale-102" 
                    alt="Lookbook" 
                    style={{ imageRendering: 'auto' }}
                  />
                  
                  <div className="absolute top-6 left-6">
                    <span className="bg-amber-400 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter flex flex-col items-center leading-none shadow-lg">
                      <span>Studio Output</span>
                      <span className="text-[8px] opacity-70">拍摄产出</span>
                    </span>
                  </div>
                </div>

                <div className="pt-8 flex gap-3">
                  <button 
                    onClick={() => {
                      setFinalView('PHOTO');
                      handleNext();
                    }}
                    className="flex-1 py-5 bg-zinc-900 text-white rounded-2xl font-black text-[10px] items-center justify-center leading-tight uppercase transition-all active:scale-95 flex gap-2 border border-zinc-800 shadow-xl"
                  >
                    <Camera size={16} />
                    <div className="flex flex-col items-start">
                      <span>Retouch</span>
                      <span className="opacity-70 text-[8px]">精修</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      setFinalView('VIDEO');
                      handleNext();
                    }}
                    className="flex-1 py-5 bg-white text-black rounded-2xl font-black text-[10px] items-center justify-center leading-tight uppercase transition-all active:scale-95 flex gap-2 shadow-xl"
                  >
                    <Play size={16} fill="currentColor" />
                    <div className="flex flex-col items-start">
                      <span>Video Shoot</span>
                      <span className="opacity-70 text-[8px]">视频拍摄</span>
                    </div>
                  </button>
                </div>
              </ScreenWrapper>
            </div>
          )}

          {step === 'POST_PROCESSING' && (
            <motion.div key="post_processing" className="w-full h-full">
              <PostProcessingAnimation 
                type={finalView === 'PHOTO' ? 'RETOUCH' : 'VIDEO'} 
                onComplete={handleNext} 
              />
            </motion.div>
          )}

          {step === 'FINAL' && (
            <div key="final" className="w-full h-full">
              <ScreenWrapper>
                <div className="flex items-center justify-between mb-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-primary rounded-full" />
                    <div>
                      <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
                        {finalView === 'PHOTO' ? 'Retouch Output' : 'Video Shoot'}
                        <br />
                        <span className="text-xl">{finalView === 'PHOTO' ? '精修输出' : '视频拍摄'}</span>
                      </h1>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {finalView === 'PHOTO' && (
                      <button 
                        onClick={() => setLayoutMode(prev => prev === 'SINGLE' ? 'GRID' : 'SINGLE')}
                        className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white active:scale-90 transition-all border border-zinc-700"
                        title="Toggle Layout"
                      >
                        {layoutMode === 'SINGLE' ? <Zap size={18} /> : <Palette size={18} />}
                      </button>
                    )}
                    <button 
                      onClick={() => setStep('LOOKBOOK')}
                      className="px-6 py-2 bg-zinc-100 text-zinc-900 rounded-full font-black text-xs uppercase flex items-center justify-center gap-2 active:scale-90 transition-transform"
                    >
                      <ArrowLeft size={16} />
                      <span>Back</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar">
                  {finalView === 'PHOTO' ? (
                    layoutMode === 'GRID' ? (
                      <div className="grid grid-cols-2 gap-3 pb-8">
                        {currentMock.finalBlockbusters.map((img, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden cursor-zoom-in group"
                            onClick={() => setZoomImage(img)}
                          >
                            <img 
                              src={img} 
                              className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105" 
                              alt={`Retouch ${i+1}`} 
                              style={{ imageRendering: 'auto' }}
                            />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col">
                        <div 
                          className="flex-1 flex items-center justify-center bg-zinc-900 rounded-[2.5rem] border border-zinc-800 relative overflow-hidden mb-6 cursor-zoom-in"
                          onClick={() => setZoomImage(currentMock.finalBlockbusters[finalPhotoIdx])}
                        >
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={finalPhotoIdx}
                              layoutId={zoomImage === currentMock.finalBlockbusters[finalPhotoIdx] ? "zoom-img" : undefined}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 1.05 }}
                              src={currentMock.finalBlockbusters[finalPhotoIdx]}
                              className="w-full h-full object-contain shadow-2xl"
                              alt="Final"
                              style={{ imageRendering: 'auto' }}
                            />
                          </AnimatePresence>
                        </div>
                        
                        <div className="flex justify-center gap-3 mb-8">
                          {currentMock.finalBlockbusters.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setFinalPhotoIdx(i)}
                              className={`w-12 h-12 rounded-2xl font-mono text-sm font-bold transition-all ${
                                finalPhotoIdx === i 
                                  ? 'bg-primary text-white scale-110 shadow-lg' 
                                  : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                              }`}
                            >
                              {(i + 1).toString().padStart(2, '0')}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  ) : (
                  <div 
                    className="flex-1 flex items-center justify-center bg-black rounded-[2.5rem] border border-zinc-800 relative overflow-hidden mb-8 shadow-[0_0_50px_rgba(0,0,0,1)] cursor-zoom-in"
                    onClick={() => setZoomVideo(currentMock.finalVideo)}
                  >
                    <video 
                      src={currentMock.finalVideo}
                      className="w-full h-full object-contain"
                      autoPlay
                      loop
                      playsInline
                    />
                    {/* Removed 4K Badge */}
                  </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pb-4">
                  <button className="py-5 bg-zinc-900 text-white border border-zinc-800 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <Download size={18} />
                    <span>Download / 保存</span>
                  </button>
                  <button className="py-5 bg-white text-black rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-zinc-200">
                    <Share2 size={18} />
                    <span>Share / 发布</span>
                  </button>
                </div>
              </ScreenWrapper>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Tracking Bar (TikTok Aesthetic) */}
      <footer className="w-full h-4 bg-zinc-950 flex overflow-hidden">
        <div className={`h-full transition-all duration-700 ${step === 'UPLOAD' ? 'bg-primary shadow-[0_0_15px_#FE2C55] w-full' : 'bg-white w-1/4'}`}></div>
        <div className={`h-full transition-all duration-700 ${step === 'ANALYSIS' ? 'bg-primary shadow-[0_0_15px_#FE2C55] w-1/2' : (step === 'UPLOAD' ? 'bg-zinc-900 w-0' : 'bg-white/80 w-1/4')}`}></div>
        <div className={`h-full transition-all duration-700 ${step === 'EXPERTS' || step === 'LOOKBOOK' ? 'bg-secondary shadow-[0_0_15px_#25F4EE] w-3/4' : (['UPLOAD', 'ANALYSIS'].includes(step) ? 'bg-zinc-900 w-0' : 'bg-white/60 w-1/4')}`}></div>
        <div className={`h-full transition-all duration-700 ${step === 'FINAL' ? 'bg-gradient-to-r from-primary to-secondary w-full' : 'bg-zinc-900 w-1/4'}`}></div>
      </footer>
    </div>
  );
}

function ShootingAnimation({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 1200);
          return 100;
        }
        return prev + 1.5;
      });
    }, 40);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div key="shooting_wrap" className="w-full h-full flex flex-col items-center justify-center p-12 bg-black">
      <div className="w-full max-w-sm space-y-12">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Camera className="w-20 h-20 text-white opacity-10" />
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={{ opacity: [0, 1, 0], scale: [0.9, 1.1, 0.9] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Camera className="w-20 h-20 text-white" />
            </motion.div>
          </div>
          <div className="mt-8 text-center space-y-2">
            <div className="text-sm font-bold tracking-[0.2em] uppercase text-white">Capturing Content</div>
            <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">正在捕捉拍摄画面</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Status</span>
              <span className="text-xs font-bold uppercase tracking-tight text-white">Virtual Studio / 拍摄中</span>
            </div>
            <span className="text-2xl font-black font-mono tracking-tighter text-white">{Math.floor(progress)}%</span>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden shadow-[0_0_10px_rgba(255,255,255,0.05)]">
            <motion.div 
              className="h-full bg-primary shadow-[0_0_15px_rgba(254,44,85,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
            <span>Live Feed Processing</span>
            <span>流媒体处理中</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostProcessingAnimation({ type, onComplete }: { type: 'RETOUCH' | 'VIDEO', onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 1.2;
      });
    }, 40);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div key="post_processing_wrap" className="w-full h-full flex flex-col items-center justify-center p-12 bg-black">
      <div className="w-full max-w-sm space-y-12">
        <div className="flex flex-col items-center">
          <div className="relative">
            {type === 'RETOUCH' ? (
              <Zap className="w-20 h-20 text-white opacity-10" />
            ) : (
              <Film className="w-20 h-20 text-white opacity-10" />
            )}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {type === 'RETOUCH' ? (
                <Zap className="w-20 h-20 text-white" />
              ) : (
                <Film className="w-20 h-20 text-white" />
              )}
            </motion.div>
          </div>
          <div className="mt-8 text-center space-y-2">
            <div className="text-sm font-bold tracking-[0.2em] uppercase text-white">
              {type === 'RETOUCH' ? 'Refining Details' : 'Rendering Motion'}
            </div>
            <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              {type === 'RETOUCH' ? '正在精修画面细节' : '正在渲染动态视频'}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Processing</span>
              <span className="text-xs font-bold uppercase tracking-tight text-white">
                {type === 'RETOUCH' ? 'Retouching / 精修中' : 'Editing / 剪辑中'}
              </span>
            </div>
            <span className="text-2xl font-black font-mono tracking-tighter text-white">{Math.floor(progress)}%</span>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
            {type === 'RETOUCH' ? 'Upscaling Detail / 画质增强中' : 'Frame Interpolation / 补帧处理中'}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisAnimation({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  const stages = [
    { title: "Visual Director", subtitle: "Analyzing aesthetics & palette...", titleCn: "视觉总监", subtitleCn: "分析美学与色调...", icon: <Camera size={24} /> },
    { title: "Main Stylist", subtitle: "Curating textile & silhouette...", titleCn: "搭配师", subtitleCn: "策划织物与廓形...", icon: <Shirt size={24} /> },
    { title: "Glam Studio", subtitle: "Refining makeup...", titleCn: "妆造专家", subtitleCn: "精修妆容...", icon: <Palette size={24} /> },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStage(prev => {
        if (prev === stages.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div key="analysis_wrap" className="w-full h-full">
      <ScreenWrapper>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative mb-12 text-center">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="w-32 h-32 rounded-full border border-dashed border-zinc-700 mx-auto"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                key={stage}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 rounded-3xl tiktok-gradient flex items-center justify-center shadow-[0_0_50px_rgba(254,44,85,0.2)]"
              >
                {stages[stage].icon}
              </motion.div>
            </div>
          </div>

          <div className="text-center">
            <motion.h3 
              key={stages[stage].title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-black tracking-tighter uppercase mb-2 leading-tight text-white"
            >
              {stages[stage].title}
              <br />
              <span className="text-xl">{stages[stage].titleCn}</span>
            </motion.h3>
            <motion.p 
              key={stages[stage].subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-relaxed"
            >
              {stages[stage].subtitle}
              <br />
              {stages[stage].subtitleCn}
            </motion.p>
          </div>

          <div className="mt-16 flex gap-3">
            {stages.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all duration-700 ${i <= stage ? 'bg-secondary w-12' : 'bg-zinc-800'}`}
              />
            ))}
          </div>
        </div>
      </ScreenWrapper>
    </div>
  );
}
