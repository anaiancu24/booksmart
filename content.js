document.addEventListener("DOMContentLoaded", () => {
    // Load storage data in popup on popup load
    chrome.storage.local.get('folderList', function (data) {
        // check if there are any folders already
        if (data.folderList === undefined || data.folderList.length == 0) {
            chrome.storage.local.set({ 'folderList': [] });
        } else {
            // loop through folders are display as list items
            for (let i = 0; i < data.folderList.length; i++) {
                let folderElement = document.createElement("li")
                folderElement.innerHTML = data.folderList[i]
                document.getElementById('folders-list').appendChild(folderElement)
                // create an addLink button for each new folder item
                let addLinkElement = document.createElement("button")
                addLinkElement.innerHTML = "+"
                addLinkElement.id = data.folderList[i]
                folderElement.appendChild(addLinkElement)
                // create a ul element and append it for each folder item
                let linksListElement = document.createElement("ul")
                folderElement.appendChild(linksListElement)
                // on add Link button click, add a link to the folder item list
                addLinkElement.addEventListener("click", () => {
                    let linkElement = document.createElement("a")
                    // get current tab url
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        console.log(tabs)
                        linkElement.innerHTML = tabs[0].title
                        linkElement.href = tabs[0].url
                        linkElement.target = "_blank"
                     });
                    linksListElement.appendChild(linkElement)
                })
            }
        }
    })

    // function to display the new folder item
    addNewFolder = function () {
        chrome.storage.local.get('folderList', function (data) {
            // create the folder node element and append it to the list
            let newFolderElement = document.createElement("li")
            lastItemIndex = data.folderList.length - 1
            newFolderElement.innerHTML = data.folderList[lastItemIndex]
            document.getElementById('folders-list').appendChild(newFolderElement)
            // create an addLink button for each new folder item
            let addLinkElement = document.createElement("button")
            addLinkElement.innerHTML = "+"
            addLinkElement.id = data.folderList[lastItemIndex]
            newFolderElement.appendChild(addLinkElement)
            // create a ul element and append it for each folder item
            let linksListElement = document.createElement("ul")
            newFolderElement.appendChild(linksListElement)
            // on add Link button click, add a link to the folder item list
            addLinkElement.addEventListener("click", () => {
                let linkElement = document.createElement("li")
                linkElement.innerHTML = "Test Link"
                linksListElement.appendChild(linkElement)
            })
        })
    }

    //Get input value and add it to the folders list on button click
    let button = document.getElementById('addFolderButton')
    // add onclick event to the addFolder button
    button.addEventListener("click", () => {
        chrome.storage.local.get('folderList', function (data) {
            // get old folders list
            let oldFolderList = data.folderList
            // get input value and ass it to the old folders list
            let newFolder = document.getElementById("folder-input").value
            oldFolderList.push(newFolder)
            // add the new folders list to the storage
            chrome.storage.local.set({ 'folderList': oldFolderList });
            // call the function to display the recent folder
            addNewFolder()
            // clear the input
            document.getElementById("folder-input").value = ""
        })
    })

})