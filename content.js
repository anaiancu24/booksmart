document.addEventListener("DOMContentLoaded", () => {
    // Load storage data in popup

    chrome.storage.local.get('folders', function(data){
        if (data.folders === undefined) {
            chrome.storage.local.set({'folders':[]});
        }else {
            for (let i=0; i<data.folders[0].length;i++) {
                let folderElement = document.createElement("li")
                folderElement.innerHTML = data.folders[0][i]
                document.getElementById('folders-list').appendChild(folderElement)
            }
        }
    })

    addNewFolder = function() {
        chrome.storage.local.get('folders', function(data){
                let newFolderElement = document.createElement("li")
                lastItemIndex = data.folders[0].length - 1
                console.log(data.folders[0])
                console.log(lastItemIndex)
                newFolderElement.innerHTML = data.folders[0][lastItemIndex]
                document.getElementById('folders-list').appendChild(newFolderElement)
        })
    }
    // Get input value and store it
    let button = document.getElementById('addFolderButton')
    button.addEventListener("click", () => {
        chrome.storage.local.get('folders', function(data){
            let oldFolders = data.folders[0]
            let newFolder = document.getElementById("folder-input").value
            oldFolders.push(newFolder)
            chrome.storage.local.set({'folders':[oldFolders]});
            addNewFolder()
            document.getElementById("folder-input").value = ""
        })
    })
    
   })