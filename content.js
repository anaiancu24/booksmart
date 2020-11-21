document.addEventListener("DOMContentLoaded", () => {
    // Load storage data in popup
    chrome.storage.local.get('folder', function(data){
        document.getElementById('storage').innerHTML = data.folder
    })

    getNewFolders = function() {
        chrome.storage.local.get('folder', function(data){
            document.getElementById('storage').innerHTML = data.folder
        })
    }
    // Get input value and store it
    let button = document.getElementById('addFolderButton')
    button.addEventListener("click", () => {
        let newFolder = document.getElementById("folder-input").value
        chrome.storage.local.set({'folder':[newFolder]});
        getNewFolders()
    })
    
   })