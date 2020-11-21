document.addEventListener("DOMContentLoaded", () => {
    // Load storage data in popup

    chrome.storage.local.get('folderList', function(data){
        if (data.folderList === undefined || data.folderList.length == 0) {
            chrome.storage.local.set({'folderList':[]});
        } else {
            for (let i=0; i<data.folderList.length; i++) {
                let folderElement = document.createElement("li")
                folderElement.innerHTML = data.folderList[i]
                document.getElementById('folders-list').appendChild(folderElement)
            }
        }
    })

    addNewFolder = function() {
        chrome.storage.local.get('folderList', function(data){
                let newFolderElement = document.createElement("li")
                lastItemIndex = data.folderList.length - 1
                newFolderElement.innerHTML = data.folderList[lastItemIndex]
                document.getElementById('folders-list').appendChild(newFolderElement)
        })
    }

    //Get input value and store it
    let button = document.getElementById('addFolderButton')
    button.addEventListener("click", () => {
        chrome.storage.local.get('folderList', function(data){
            let oldFolderList = data.folderList
            let newFolder = document.getElementById("folder-input").value
            oldFolderList.push(newFolder)
            chrome.storage.local.set({'folderList': oldFolderList});
            addNewFolder()
            document.getElementById("folder-input").value = ""     
        })
    })
    
   })