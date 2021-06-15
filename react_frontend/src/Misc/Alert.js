export function AlertSuccess(message)
{
    createNotification('Sukces', message);
}

export function AlertFailure(message)
{
    createNotification('Błąd', message);
}

export function AlertInfo(message)
{
    createNotification("Informacja", message);
}

function createNotification(type, message)
{
    var topElement = document.getElementsByClassName('top-menu')[0];
    var div = document.createElement('div');
    var span = document.createElement('span');
    span.className = 'close-button';
    span.innerHTML = 'X';
    span.onclick = function() { div.parentNode.removeChild(div); };
    span.style.cursor = "pointer";
    if(type === 'Sukces')
        div.className = 'alert-success';
    else if(type === 'Błąd')
        div.className = 'alert-failed';
    else if(type === 'Informacja')
        div.className = 'alert-info';
    var header = document.createElement('h3');
    header.className = 'message-head';
    var strongElement = document.createElement('strong');
    strongElement.style = 'font-size:x-large';
    strongElement.innerHTML = type;
    var pElement = document.createElement('p');
    pElement.className = 'message';
    pElement.style = 'text-overflow: ellipsis; white-space: nowrap; overflow: hidden';
    pElement.innerHTML = message;
    header.appendChild(strongElement);//strong
    header.appendChild(pElement);//p
    header.appendChild(span);
    div.appendChild(header);
    topElement.after(div);
    setTimeout( function(){ if(div.parentNode) div.parentNode.removeChild(div);} , 3000);
}
