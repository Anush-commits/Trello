window.addEventListener('load', (e => {
    console.log(localStorage);
    loopThroughNodes(...['.lists', , (l => l.id = `${l.id}a`)]);
    for (let e = 0; e < document.querySelectorAll('a').length; e++) {
        const list = document.createElement('div');
        list.className = 'todoList';
        const element = document.querySelectorAll('a')[e];
        element.parentNode.insertBefore(list, element)
    }
    addCards()
}))

function loopArr(arr, fn) {for (let i = 0; i < arr.length; i++) fn(arr[i])};
function SubmitHandler(e, val) {
    let id = e.parentNode.parentNode.id;
    if (val !== '') {
        loopArr(e.parentNode.parentNode.children, (a => {
            if(a.className == 'todoList') {
                 a.innerHTML += `<div class="item"><a class="label">${val}</a> <span class="material-icons edit" onclick= "editHandler(event)">edit</span>
        <div id="configs" class="configs">
        <span id="delete" onclick="deleteHandler(event)">Delete</span>
        <span id="change" onclick="changeHandler(event)">Change label</span>
        <span id="move" onclick="moveHandler(e)">Move</span>
    </div></div>`}}))
        loopArr(e.parentNode.parentNode.children, (b => b.className === 'item' ? b.appendChild(e) : b))
        if (localStorage.getItem(`${id}`) == null || localStorage.getItem(`${id}`) === undefined) {
            localStorage.setItem(`${id}`, JSON.stringify({ [Date.now()]: val }))
        } else {
            let parsed = JSON.parse(localStorage.getItem(`${id}`));
            parsed[Date.now()] = val;
            localStorage.setItem(`${id}`, JSON.stringify(parsed))
        }
      e.parentNode.reset()
    }
}
function addCards() {
    for (const m in localStorage) {
        if (localStorage.hasOwnProperty(m)) {
            const data = localStorage[m];
            loopThroughNodes(...['.todoList', , (e => {
                if (e.parentNode.id === m) {
                    for (const k in JSON.parse(data)) {
                        if (JSON.parse(data).hasOwnProperty(k)) {
                            e.innerHTML += `<div class="item" id=${k}><a class="label"> ${JSON.parse(data)[k]}</a><span class="material-icons edit" onclick= "editHandler(event)" >edit </span>
                            <div id="configs" class="configs">
                            <span id="delete" onclick="deleteHandler(event)">Delete</span>
                            <span id="change" onclick="changeHandler(event)">Change label</span>
                            <span id="move" onclick="moveHandler(e)">Move</span>
                        </div></div>`                            
                        }
                    }
                }
            })])
        }
    }
}
function changeHandler(event) {
    const btn = document.createElement('button');
    btn.innerText = 'Save';
    loopArr(event.target.parentNode.parentNode.children, (t => {
         t.tagName == 'A' ?  btn.addEventListener('click', (e => ChangeLabel(e, t.textContent))) : null
        
    }))
   loopArr(event.target.parentNode.children, (i =>  i.tagName == 'BUTTON' ? i.remove() : i))
    event.target.parentNode.appendChild(btn)
    loopArr(event.target.parentNode.parentNode.children, (e => {
        if(e.tagName === 'A') {
             e.contentEditable = true;
             e.focus();
        }
    }))
}

function ChangeLabel(e, txt) {
    loopThroughNodes(...['.label',,(l => l.contentEditable = false)])
    e.target.parentNode.style.opacity = '0';
    let id = e.target.parentNode.parentNode.id, classId = e.target.parentNode.parentNode.parentNode.parentNode.id;
    let obj = {...JSON.parse(localStorage.getItem(classId)) }   
    loopThroughNodes(...['.edit',,(e => e.style.display = 'inline-block')])
    obj[id] = txt;
    localStorage.setItem(classId, JSON.stringify(obj))
}
function editHandler(event) {
    console.log('editHandler');
    loopThroughNodes('.configs', 'button', (b => b.remove()))
    loopThroughNodes(...['.label',,(l => l.contentEditable = false)])
    loopThroughNodes(...['.edit', , (e => e.style.display = 'inline-block')])
    loopThroughNodes(...['.configs',, (e => e.style.display = 'none') ])
    loopArr(event.target.parentNode.children, (a => a.className === 'configs' ? a.style.display = 'block' : a))
    event.target.style.display = 'none';
}
function deleteHandler(event) {
    console.log('deletehandler');
    let objClass = event.target.parentNode.parentNode.parentNode.parentNode.id;
    event.target.parentNode.parentNode.remove();
   for (const a in JSON.parse( localStorage.getItem(objClass))) {
       if (JSON.parse( localStorage.getItem(objClass)).hasOwnProperty(a)) {
          let obj = {...JSON.parse( localStorage.getItem(objClass))};
          delete obj[event.target.parentNode.parentNode.id]
          localStorage.setItem(`${objClass}`, JSON.stringify(obj));
       }
   }
}
function loopThroughNodes(Class_Name = '', has = '', fn) {
    const nodes = document.querySelectorAll(Class_Name);
    let flag = true;
    if (nodes.length == 0) return false;
    if (has == '') for (let u = 0; u < nodes.length; u++)  fn(nodes[u])
    for (let f = 0; f < nodes.length; f++) {
        for (let i = 0; i < nodes[f].children.length; i++) {
            const element = nodes[f].children[i];
            if (element.tagName == has.toUpperCase()) fn(element);
            else flag = false;
        }
    }
    return flag
}
function appendParentandNode(newnode, parent, parentfn, val = '') {
    parent.innerHTML += newnode;
    parentfn(parent)
}
loopThroughNodes('.lists', 'a', (e => {
    e.addEventListener('click', n => {
        loopThroughNodes('.lists', 'form', (form => form.remove()))
        const form = document.createElement('form');
        loopThroughNodes('.lists', 'a', (link => link.style.display = 'inline-block'));
        appendParentandNode(`<textarea placeholder="Type"></textarea><input class="submit" type="submit"/><span class="material-icons">close</span>`, form, (form) => n.target.parentNode.appendChild(form));
        n.target.style.display = 'none';
        loopThroughNodes(...['.material-icons', , (closeIcon => {
            closeIcon.addEventListener('click', () => {
                form.remove();
                n.target.style.display = 'inline-block';
            })
        })])
        loopThroughNodes(...['.submit', , (s => s.addEventListener('click', (e => loopThroughNodes(...['textarea', , (textarea => SubmitHandler(e.target, textarea.value))]))))])
    })
}))
//localStorage.clear();


