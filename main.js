var filters = document.querySelectorAll("ul li input");
var labels = document.querySelectorAll("ul li label");
var download =_("download");
let reset = _("reset");
let img = _("image");
let upload = _("upload");
let reload = _("reload")
let canvas = _("canvas");
let draw = _("draw");
let crop = _("crop");
let save =_("save");
let ctx = canvas.getContext("2d");
let x = -1;
let y = -1 ; 
let allow;
let down;
let allow_c;
let down_c;
let totalc= 0;
var points ;
var points_b=[20,70,20,20];
let click_crop=20;
function _(id)
{
    return document.getElementById(id);
}

window.onload=function ()
{
    download.style.display="none";
    reset.style.display="none";
    canvas.style.display="none";
    reload.style.display="none";
    filters.forEach(filter => {filter.disabled=true;})
    
   

}
upload.onchange = function ()
{
    resetFilters();

    download.style.display="block";
    reset.style.display="block";
    
    upload.value="";
    let file = new FileReader();
    file.readAsDataURL(upload.files[0]);
    file.onload=function()
    {
    img.src=file.result;
    filters.forEach(filter => {filter.disabled=false;})

    }
    img.onload =function()
    {
        saveImage();
        canvas.style.display="block";
    }
  
    
   

}
function resetFilters ()
{
    
   ctx.filter="none";
   ctx.drawImage(img,0,0,canvas.width,canvas.height);
   filters[0].value ="100";
   filters[1].value ="100";
   filters[2].value ="100";
   filters[3].value ="0";
   filters[4].value ="0";
   filters[5].value ="0";
   filters[6].value ="0";

   labels[0].innerHTML=`saturate(${filters[0].value*100/200}%)`;
   labels[1].innerHTML=`contrast(${filters[1].value*100/200}%)`;
   labels[2].innerHTML=`brightness(${filters[2].value*100/200}%)`;
   labels[3].innerHTML=`sepia(${filters[3].value*100/200}%)`;
   labels[4].innerHTML=`grayscale(${filters[4].value*100}%)`;
   labels[5].innerHTML=`blur(${filters[5].value*100/10}%)`;
   labels[6].innerHTML=`hue-rotate(${filters[6].value*100/350}%)`;
   
}
function saveImage ()
{
    
    canvas.width=img.width;
    canvas.height = img.height;
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    img.style.display="none";

   
}
filters.forEach(filter =>{
    filter.addEventListener("input",function(){
        ctx.filter=`
        saturate(${filters[0].value}%)
        contrast(${filters[1].value}%)
        brightness(${filters[2].value}%)
        sepia(${filters[3].value}%)
        grayscale(${filters[4].value})
        blur(${filters[5].value}px)
        hue-rotate(${filters[6].value}deg)
        `;
        ctx.drawImage(img,0,0,canvas.width,canvas.height);

        labels[0].innerHTML=`saturate(${filters[0].value*100/200}%)`;
        labels[1].innerHTML=`contrast(${filters[1].value*100/200}%)`;
        labels[2].innerHTML=`brightness(${filters[2].value*100/200}%)`;
        labels[3].innerHTML=`sepia(${filters[3].value*100/200}%)`;
        labels[4].innerHTML=`grayscale(${filters[4].value*100}%)`;
        labels[5].innerHTML=`blur(${filters[5].value*100/10}%)`;
        labels[6].innerHTML=`hue-rotate(${filters[6].value*100/350}%)`;

        
        
    })
})

reset.onclick = function (){resetFilters()};
download.onclick = function (){
    download.href = canvas.toDataURL();
}
reload.onclick = function ()
{
    location.reload();
}
draw.onclick = function () {
    allow=true;
}
function start_crop (x1=20,x2=70,y1=20,y2=20)
{
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        points = [x1,x2,y1,y2];
        img.style.display="none";
        ctx.beginPath();
        ctx.moveTo(x1,0);
        ctx.lineTo(x1,img.height);
        ctx.strokeStyle="yellow";
        ctx.stroke();
        ctx.moveTo(x2,0);
        ctx.lineTo(x2,img.height);
        ctx.strokeStyle="yellow";
        ctx.stroke();
        
}

crop.onclick = function (){
   canvas.style.border="5px solid rgb(46, 2, 73)";
   canvas.style.cursor="grabbing";
   start_crop();
   allow_c=true;
}
function startDraw(event)
{
    let track = event;
     bound = canvas.getBoundingClientRect();
    x = track.clientX-bound.left;
    y =track.clientY-bound.top;
    if (allow)
    {
    down=true;
    ctx.beginPath();
    ctx.arc(x,y,8 , 0, 2 * Math.PI);
    ctx.fill();
    }
    if (allow_c)
    {
        down_c=true;
        click_crop=x;
    }

}
function drawing (event){
    bound = canvas.getBoundingClientRect();
    let track = event;
    x = track.clientX-bound.left;
    y = track.clientY-bound.top;
    if (allow && down)
    {
    ctx.beginPath();
   
    ctx.arc(x,y,8 , 0, 2 * Math.PI);
    ctx.fill();
    }
    if (allow_c && down_c)
    {
        if (points_b[0]-10 <= click_crop && click_crop<= points_b[0]+10)
        {

        start_crop(x,points[1]);

        }
        else if(points_b[1]-10 <= click_crop && click_crop<= points_b[1]+10)
        {
           if (points[0]+45<points[1])
           {
            start_crop(points[0],x);
            
           }
           else
           {
            start_crop(points[0],points[0]+50);
            down_c=false;
           }
           
          
        }
       
    }
   
}
function done ()
{
    down=false;
    if (allow_c && down_c)
    {
    
    down_c=false;
    points_b=points;
    }
}
canvas.ontouchstart = startDraw;
canvas.onmousedown = startDraw;

canvas.onmousemove = drawing;
canvas.ontouchmove = drawing;

canvas.onmouseup = done;
canvas.ontouchend = done;
save.onclick = function (event)
{
    bound = canvas.getBoundingClientRect();
    let wc = event.clientX-bound.left;
    ctx.clearRect(0,0,img.width,img.height);
    canvas.style.display="none";
    img.style.display="block";
    totalc+=wc;
    canvas.width=img.width-totalc;
    canvas.height = img.height;
    ctx.drawImage(img,-totalc,0,img.width,img.height);
    canvas.style.display="block";
    img.style.display="none";
}
