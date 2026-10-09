/* Shared data + helpers for every page */
const P0=[
{id:1,n:"Matooke (green bananas)",e:"🍌",c:"Fruit",p:25000,u:"bunch",f:"Mukasa Farms, Mpigi",s:40,d:"Firm, freshly cut matooke from highland plantations. Harvested within 24 hours of delivery."},
{id:2,n:"Dry maize",e:"🌽",c:"Grain",p:1400,u:"kg",f:"Aber Growers, Lira",s:900,d:"Sun-dried, sorted maize with low moisture content. Suitable for milling or animal feed."},
{id:3,n:"Kidney beans",e:"🫘",c:"Grain",p:4200,u:"kg",f:"Nakato Co-op, Masaka",s:350,d:"Clean red beans, hand-sorted and free of stones. High in protein and quick to cook."},
{id:4,n:"Tomatoes",e:"🍅",c:"Vegetables",p:3500,u:"kg",f:"Kigozi Gardens, Wakiso",s:120,d:"Ripe, firm tomatoes grown with drip irrigation. Good for sauces and fresh salads."},
{id:5,n:"Sweet pineapples",e:"🍍",c:"Fruit",p:3000,u:"piece",f:"Buikwe Fruit Union",s:200,d:"Large, sweet pineapples picked at full ripeness. Sold per piece."},
{id:6,n:"Arabica coffee (green beans)",e:"☕",c:"Cash crops",p:11000,u:"kg",f:"Bugisu Highlands Co-op",s:500,d:"Washed Arabica grown above 1,800 m. Notes of citrus and dark chocolate."},
{id:7,n:"Fresh farm eggs",e:"🥚",c:"Livestock",p:12000,u:"tray (30)",f:"Ssemwogerere Poultry",s:80,d:"Free-range eggs collected daily. A tray holds 30 eggs."},
{id:8,n:"Fresh cow milk",e:"🥛",c:"Livestock",p:2000,u:"litre",f:"Ankole Dairy Group",s:300,d:"Raw milk from healthy, vaccinated cows. Chilled and delivered the same morning."},
{id:9,n:"Cassava flour",e:"🌿",c:"Grain",p:2800,u:"kg",f:"Gulu Women Farmers",s:260,d:"Finely milled cassava flour for posho and baking. Packed in 1 kg bags."},
{id:10,n:"Pure forest honey",e:"🍯",c:"Cash crops",p:18000,u:"litre",f:"Kibale Bee Keepers",s:60,d:"Raw, unfiltered honey harvested from forest hives. Crystallises naturally."},
{id:11,n:"Hass avocados",e:"🥑",c:"Fruit",p:6000,u:"kg",f:"Mukasa Farms, Mpigi",s:90,d:"Creamy Hass avocados, hard-ripe on arrival and ready in 2–3 days."},
{id:12,n:"Groundnuts",e:"🥜",c:"Grain",p:5500,u:"kg",f:"Aber Growers, Lira",s:210,d:"Shelled, sun-dried groundnuts. Roast them or grind into paste."}];
const CATS=["All","Fruit","Grain","Vegetables","Cash crops","Livestock"];
const ST={get(k,d){try{const v=localStorage.getItem("sm_"+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem("sm_"+k,JSON.stringify(v))}catch(e){}}};
const P=ST.get("products",P0);
const S={user:ST.get("user",null),role:ST.get("role","buyer"),farm:ST.get("farm",""),cart:ST.get("cart",{}),orders:ST.get("orders",[])};
const $=s=>document.querySelector(s);
const fmt=n=>"UGX "+n.toLocaleString("en-US");
const get=id=>P.find(p=>p.id==id);
const param=k=>new URLSearchParams(location.search).get(k);
Object.keys(S.cart).forEach(k=>{if(!get(k))delete S.cart[k]});
const count=()=>Object.values(S.cart).reduce((a,b)=>a+b,0);
const sub=()=>Object.entries(S.cart).reduce((a,[id,q])=>a+get(id).p*q,0);
const saveCart=()=>ST.set("cart",S.cart);
const TINT={Fruit:"#fde3b0",Grain:"#efe0b5",Vegetables:"#cfe8c4","Cash crops":"#e6d3bd",Livestock:"#d6e4ee"};
const pic=p=>p.img?`<img src="${p.img}" alt="${p.n}">`:`<span class="tile" style="background:${TINT[p.c]||"#ddd"}">${p.e||"🧺"}</span>`;
const card=p=>`<a class="card prod" href="product.html?id=${p.id}"><div class="pic">${pic(p)}</div><div class="in"><h3>${p.n}</h3><span class="mute">${p.f}</span><span class="price">${fmt(p.p)} / ${p.u}</span></div></a>`;
function toast(m){document.querySelector(".toast")?.remove();document.body.insertAdjacentHTML("beforeend",`<div class="toast" role="status">${m}</div>`);setTimeout(()=>document.querySelector(".toast")?.remove(),1800)}
function add(id,q=1){const p=get(id);if(p.s<1){toast("Out of stock");return}S.cart[id]=Math.min((S.cart[id]||0)+q,p.s);saveCart();const b=$(".badge");if(b)b.textContent=count();toast("Added "+p.n+" to cart")}
function logout(){S.cart={};saveCart();ST.set("user",null);ST.set("role","buyer");location.href="index.html"}
const STEPS=[["index","Login"],["dashboard","Dashboard"],["products","Browse"],["product","Details"],["cart","Cart"],["checkout","Order"],["confirmation","Confirmed"]];
/* Guards the page and draws the header + progress bar. cur = nav page, step = journey step */
function page(cur,role,step){
 if(!S.user||S.role!=role){location.replace("index.html");return false}
 const f=role=="farmer";
 const nav=f?[["farm.html","My listings"],["product-form.html","Add product"],["farmer-orders.html","Orders received"]]:[["dashboard.html","Home"],["products.html","Products"],["cart.html","Cart"]];
 $("#hdr").innerHTML=`<header class="top"><div class="bar"><a class="logo" href="${nav[0][0]}">🌱 Shamba Market</a><nav>${nav.map(n=>`<a class="nb ${n[0]==cur+".html"?"on":""}" href="${n[0]}">${n[1]}${n[1]=="Cart"?`<span class="badge">${count()}</span>`:""}</a>`).join("")}<button class="nb" onclick="logout()">Log out</button></nav></div></header>`;
 if(!f){const i=STEPS.findIndex(s=>s[0]==(step||cur));$("#steps").innerHTML=`<div class="steps" aria-label="Progress">${STEPS.map((s,k)=>`<span class="${k==i?"cur":k<i?"done":""}">${s[1]}</span>`).join("")}</div>`}
 return true}
