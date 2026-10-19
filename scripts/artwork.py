"""Generate original vector illustrations, not screenshots of the projects."""
from pathlib import Path
import random, math
out = Path(__file__).resolve().parent.parent / 'assets'
random.seed(42)
def save(name, content, bg='#101526'):
    (out / (name+'.svg')).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540"><defs><linearGradient id="s" x2="1" y2="1"><stop stop-color="#25deff"/><stop offset=".45" stop-color="#7470ff"/><stop offset="1" stop-color="#ff34cb"/></linearGradient><radialGradient id="b"><stop stop-color="#6a3cc8"/><stop offset="1" stop-color="{bg}"/></radialGradient><linearGradient id="gold" x2="0" y2="1"><stop stop-color="#ffe7a0"/><stop offset=".4" stop-color="#ffc04b"/><stop offset="1" stop-color="#a45a15"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="8"/></filter></defs><rect width="960" height="540" fill="{bg}"/>{content}</svg>')
# Layered flowing contours, a lightweight vector cover.
paths=[]
for i in range(26):
    y=90+i*13
    d=f'M 100 {y+150} C 210 {y-220} 340 {y+270} 490 {y+25} S 760 {y-180} 1000 {y+110}'
    paths.append(f'<path d="{d}" fill="none" stroke="url(#s)" stroke-width="{2+(i%5)}" opacity="{.25+i*.025}"/>')
ink='<ellipse cx="730" cy="280" rx="330" ry="300" fill="url(#b)" opacity=".7"/>'
ink+=''.join(paths)
for i in range(70):
    x=random.randint(300,950); y=random.randint(20,520); r=random.choice([1,1,2,3,5]); c=random.choice(['#4de6ff','#ce54ff','#ff75cc'])
    ink+=f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}" opacity=".7"/>'
save('ink',ink)
pixels=''
for y in range(0,540,24):
    for x in range(0,960,24):
        if random.random()<.2: continue
        hue=(x/960*210+y/540*90+220)%360
        light=random.randint(35,70)
        pixels+=f'<rect x="{x+2}" y="{y+2}" width="{random.choice([12,18,20])}" height="20" rx="1" fill="hsl({hue:.0f},85%,{light}%)" opacity="{random.uniform(.25,.95):.2f}"/>'
save('pixels',pixels)
chest='<ellipse cx="480" cy="270" rx="340" ry="270" fill="url(#b)" opacity=".35"/><ellipse cx="480" cy="400" rx="260" ry="40" fill="#000" opacity=".5"/>'
for i in range(40):
    x=random.randint(170,800);y=random.randint(60,440)
    chest+=f'<path d="M{x} {y-5}v10m-5-5h10" stroke="#ffda79" opacity="{random.random():.2f}"/>'
chest+='<path d="M310 290 L480 205 L690 280 L520 375Z" fill="#ffe98e" filter="url(#glow)"/><path d="M300 285L510 350L700 280V405L510 470L300 400Z" fill="#512c28" stroke="#cc8a3d" stroke-width="8"/><path d="M300 285V185Q490 90 700 180V280L510 215Z" fill="#40252d" stroke="url(#gold)" stroke-width="12"/><path d="M300 285L510 215L700 280L510 350Z" fill="#fff4b3"/><path d="M510 350V470M355 302V415M645 300V421" stroke="url(#gold)" stroke-width="18"/><rect x="478" y="349" width="63" height="59" rx="7" fill="url(#gold)"/><circle cx="510" cy="369" r="8" fill="#57341d"/><path d="M506 374h8v17h-8z" fill="#57341d"/>'
save('chest',chest,'#15101c')
orbit='<circle cx="480" cy="270" r="225" fill="url(#b)" opacity=".7"/>'
for a in [-35,25,75]:
    orbit+=f'<ellipse cx="480" cy="270" rx="335" ry="105" fill="none" stroke="url(#s)" stroke-width="3" transform="rotate({a} 480 270)"/>'
for i in range(33):
    a=random.random()*math.tau;r=random.randint(70,300);x=480+math.cos(a)*r;y=270+math.sin(a)*r*.65
    orbit+=f'<path d="M480 270L{x:.1f} {y:.1f}" stroke="#9081e3" opacity=".3"/><circle cx="{x:.1f}" cy="{y:.1f}" r="{random.randint(3,12)}" fill="url(#s)"/>'
orbit+='<circle cx="480" cy="270" r="70" fill="#121b39" stroke="url(#s)" stroke-width="5"/><circle cx="462" cy="250" r="22" fill="#55c6ff" opacity=".4"/>'
save('orbit',orbit)
tools='<circle cx="480" cy="270" r="240" fill="url(#b)" opacity=".6"/>'
for x,y,rot in [(190,110,-12),(390,180,10),(610,95,17)]:
    tools+=f'<g transform="rotate({rot} {x+100} {y+100})"><rect x="{x}" y="{y}" width="200" height="250" rx="20" fill="#14233c" stroke="url(#s)" stroke-width="3"/><path d="M{x+40} {y+70}h120M{x+40} {y+110}h90M{x+40} {y+150}h105" stroke="#78a6d4" stroke-width="8"/><circle cx="{x+145}" cy="{y+200}" r="18" fill="url(#s)"/></g>'
save('tools',tools)
chess='<circle cx="480" cy="270" r="260" fill="url(#b)" opacity=".65"/>'
for y in range(6):
    for x in range(10):
        chess+=f'<rect x="{x*96}" y="{y*90}" width="96" height="90" fill="{["#7085a0","#161d35"][(x+y)%2]}" opacity=".22"/>'
chess+='<path d="M340 440h280l-25-55H365Z M375 365h210l-35-65 20-100-50-60-90 25-65 120 75 5 15-50 20 20-35 40Z" fill="url(#s)" stroke="#a5dbff" stroke-width="3"/><circle cx="499" cy="201" r="7" fill="#0f1528"/>'
save('chess',chess)
