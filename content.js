document.addEventListener("DOMContentLoaded", () => {
    // Function to loop through data and display everything as list items
    loadFoldersAndButtons = function (data) {
        for (let i = 0; i < data.length; i++) {
            // FOLDERS
            let folderElement = document.createElement("div")
            folderElement.classList.add("booksmart__folder-element")
            let folderElementTitle = document.createElement("h3")
            folderElement.appendChild(folderElementTitle)
            let key = Object.keys(data[i])
            folderElementTitle.innerHTML = key
            document.getElementById('booksmart__folders-list').appendChild(folderElement)
            // REMOVE BUTTON
            let removeFolderButton = document.createElement("button")
            removeFolderButton.classList.add("booksmart__remove-button")
            removeFolderButton.innerHTML = "-"
            folderElement.appendChild(removeFolderButton)
            removeFolderButton.addEventListener("click", () => {
                data.splice(i, 1)
                chrome.storage.local.set({ 'folderList': data });
                document.getElementById('booksmart__folders-list').innerHTML = ""
                loadFoldersAndButtons(data)
            })
            // ADD BUTTON
            let addLinkButton = document.createElement("button")
            addLinkButton.classList.add("booksmart__add-button")
            addLinkButton.innerHTML = "+"
            folderElement.appendChild(addLinkButton)
            addLinkButton.addEventListener("click", () => {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    let linkObj = {}
                    linkObj['title'] = tabs[0].title
                    linkObj['url'] = tabs[0].url
                    data[i][key].push(linkObj)
                    chrome.storage.local.set({ 'folderList': data });
                    document.getElementById('booksmart__folders-list').innerHTML = ""
                    loadFoldersAndButtons(data)
                });
            })
            // SUBFOLDER LINKS
            let folderLinks = Object.values(data[i])
            let folderLinksElement = document.createElement("ul")
            folderLinksElement.classList.add("booksmart__links-list")
            folderElement.appendChild(folderLinksElement)
            for (let j = 0; j < folderLinks[0].length; j++) {
                let linkElementHref = document.createElement("a")
                linkElementHref.classList.add("booksmart__link-item")
                let linkElement = document.createElement('li')
                linkElement.innerHTML = folderLinks[0][j]['title']
                linkElementHref.href = folderLinks[0][j]['url']
                linkElementHref.target = "_blank"
                folderLinksElement.appendChild(linkElementHref)
                linkElementHref.appendChild(linkElement)
                let removeLinkButton = document.createElement("button")
                removeLinkButton.classList.add("booksmart__remove-button")
                removeLinkButton.innerHTML = "-"
                folderLinksElement.appendChild(removeLinkButton)
                removeLinkButton.addEventListener("click", () => {
                    Object.values(data[i])[0].splice(j, 1)
                    chrome.storage.local.set({ 'folderList': data });
                    document.getElementById('booksmart__folders-list').innerHTML = ""
                    loadFoldersAndButtons(data)
                })
            }
        }
    }

    // Load storage data in popup on popup load
    chrome.storage.local.get('folderList', function (data) {
        // check if there are any folders already
        if (data.folderList === undefined || data.folderList.length == 0) {
            chrome.storage.local.set({ 'folderList': [] });
        } else {
            loadFoldersAndButtons(data.folderList)
        }
    })


    //Get input value and add it to the folders list on button click
    let button = document.getElementById('addFolderButton')
    // add onclick event to the addFolder button
    button.addEventListener("click", () => {
        chrome.storage.local.get('folderList', function (data) {
            // get old folders list
            let oldFolderList = data.folderList
            // get input value and ass it to the old folders list
            let newFolder = {}
            let inputValue = document.getElementById("booksmart__add-folder-input").value
            newFolder[inputValue] = []
            oldFolderList.push(newFolder)
            // add the new folders list to the storage
            chrome.storage.local.set({ 'folderList': oldFolderList });
            // call the function to display the recent folder
            document.getElementById('booksmart__folders-list').innerHTML = ""
            // Display new folders
            loadFoldersAndButtons(oldFolderList)
            // clear the input
            document.getElementById("booksmart__add-folder-input").value = ""
        })
    })
})