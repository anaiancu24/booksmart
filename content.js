document.addEventListener("DOMContentLoaded", () => {
    // Function to loop through data and display everything as list items
    let colorsArray = ["#fda6a5", "#b95072", "#893c55", "#d66175", "#d62155", "#e66165", "#b95a7a", "#eda4b5", "#a83a55", "#9c335a"]
    loadFoldersAndButtons = function (data) {
        for (let i = 0; i < data.length; i++) {
            // FOLDERS
            let folderElement = document.createElement("div")
            folderElement.classList.add("booksmart__folder-element")
            let folderElementTitle = document.createElement("h3")
            folderElement.appendChild(folderElementTitle)
            let key = Object.keys(data[i])
            folderElementTitle.innerHTML = key
            let dropdownButton = document.createElement("button")
            // dropdownButton.innerHTML = "&#x25BC;"
            dropdownButton.classList.add("booksmart__dropdown-button")
            folderElementTitle.appendChild(dropdownButton)
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
            addLinkButton.addEventListener("click", (e) => {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    let linkObj = {}
                    linkObj['title'] = tabs[0].title
                    linkObj['url'] = tabs[0].url
                    data[i][key].push(linkObj)
                    chrome.storage.local.set({ 'folderList': data });
                    document.getElementById('booksmart__folders-list').innerHTML = ""
                    loadFoldersAndButtons(data)
                });
                // addLinkButton.nextSibling.classList.add("hidden")
                // e.target.nextSibling.classList.remove("hidden")
            })
            // SUBFOLDER LINKS
            let folderLinks = Object.values(data[i])
            let folderLinksElement = document.createElement("ul")
            folderLinksElement.classList.add("booksmart__links-list")
            folderLinksElement.classList.add("hidden")
            folderElement.appendChild(folderLinksElement)
            for (let j = 0; j < folderLinks[0].length; j++) {
                let linkElementHref = document.createElement("a")
                let linkElement = document.createElement('li')
                linkElement.classList.add("booksmart__link-item")
                linkElementHref.innerHTML = folderLinks[0][j]['title']
                linkElementHref.href = folderLinks[0][j]['url']
                linkElementHref.target = "_blank"
                folderLinksElement.appendChild(linkElement)
                linkElement.appendChild(linkElementHref)
                let removeLinkButton = document.createElement("button")
                removeLinkButton.classList.add("booksmart__remove-button")
                removeLinkButton.innerHTML = "-"
                linkElement.appendChild(removeLinkButton)
                removeLinkButton.addEventListener("click", () => {
                    Object.values(data[i])[0].splice(j, 1)
                    chrome.storage.local.set({ 'folderList': data });
                    document.getElementById('booksmart__folders-list').innerHTML = ""
                    loadFoldersAndButtons(data)
                })
            }
        }
        // Remove Sublinks container if no sublinks
        let linksContainers = document.querySelectorAll(".booksmart__links-list")
        for (let z = 0; z < linksContainers.length; z++) {
            if (!linksContainers[z].hasChildNodes()) {
                linksContainers[z].style.display = "none"
            }
        }
        // Change folder colors and toggle sublinks on folder click
        let folderElements = document.querySelectorAll("h3")
        for (let y = 0; y < folderElements.length; y++) {
            let randomColor = colorsArray[Math.floor(
                Math.random() * colorsArray.length)];
            folderElements[y].style.backgroundColor = randomColor
            folderElements[y].addEventListener("click", () => {
                let sublinksFolder = document.getElementsByClassName('booksmart__links-list')[y]
                sublinksFolder.classList.toggle('hidden')
            })
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