document.addEventListener("DOMContentLoaded", () => {
    // Function to loop through data and display everything as list items
    loadFoldersAndButtons = function (data) {
        for (let i = 0; i < data.length; i++) {
            // FOLDERS
            let folderElement = document.createElement("li")
            let key = Object.keys(data[i])
            folderElement.innerHTML = key
            document.getElementById('folders-list').appendChild(folderElement)
            // SUBFOLDER LINKS
            let folderLinks = Object.values(data[i])
            for (let j=0; j<folderLinks.length; j++) {
                let linkElement = document.createElement("a")
                linkElement.innerHTML = folderLinks[j]
                folderElement.appendChild(linkElement)
            }
            // ADD BUTTON
            let addLinkButton = document.createElement("button")
            addLinkButton.innerHTML = "+"
            folderElement.appendChild(addLinkButton)
            addLinkButton
            // REMOVE BUTTON
            let removeFolderButton = document.createElement("button")
            removeFolderButton.innerHTML = "-"
            folderElement.appendChild(removeFolderButton)
            removeFolderButton.addEventListener("click", () => {
                data.splice(i, 1)
                chrome.storage.local.set({ 'folderList': data });
                document.getElementById('folders-list').innerHTML = ""
                loadFoldersAndButtons(data)
            })


        }
    }

    // let folders = [
    //     {'jobs': ['job1', 'job2']},
    //     {'work': ['work1', 'work2']},
    //     {'articles': ['article1', 'article2']}

    // ]

    // loadFoldersAndButtons(folders)

    // Load storage data in popup on popup load
    chrome.storage.local.get('folderList', function (data) {
        // check if there are any folders already
        if (data.folderList === undefined || data.folderList.length == 0) {
            chrome.storage.local.set({ 'folderList': [] });
        } else {
            loadFoldersAndButtons(data.folderList)
            // loop through folders and display as list items
            // for (let i = 0; i < data.folderList.length; i++) {
            //     let folderElement = document.createElement("li")
            //     let key = Object.keys(data.folderList[i])
            //     folderElement.innerHTML = key
            //     document.getElementById('folders-list').appendChild(folderElement)
            //     // remove a folder
            //     let removeFolderButton = document.createElement("button")
            //     removeFolderButton.innerHTML = "-"
            //     folderElement.appendChild(removeFolderButton)
            //     removeFolderButton.addEventListener("click", () => {
            //         data.folderList.splice(i, 1)
            //         console.log(data.folderList)
            //         chrome.storage.local.set({ 'folderList': data.folderList });
            //         document.getElementById('folders-list').innerHTML = ""
            //         for (let i = 0; i < data.folderList.length; i++) {
            //             let folderElement = document.createElement("li")
            //             let key = Object.keys(data.folderList[i])
            //             folderElement.innerHTML = key
            //             document.getElementById('folders-list').appendChild(folderElement)
            //             // remove a folder
            //             let removeFolderButton = document.createElement("button")
            //             removeFolderButton.innerHTML = "-"
            //             folderElement.appendChild(removeFolderButton)
            //             removeFolderButton.addEventListener("click", () => {
            //                 data.folderList.splice(i, 1)
            //                 console.log(data.folderList)
            //                 chrome.storage.local.set({ 'folderList': data.folderList });
            //                 document.getElementById('folders-list').innerHTML = ""
            //                 for (let i = 0; i < data.folderList.length; i++) {
            //                     let folderElement = document.createElement("li")
            //                     let key = Object.keys(data.folderList[i])
            //                     folderElement.innerHTML = key
            //                     document.getElementById('folders-list').appendChild(folderElement)
            //                 }
            //             })
            //         }
            //     })


            //     // create an addLink button for each new folder item
            //     let addLinkButton = document.createElement("button")
            //     addLinkButton.innerHTML = "+"
            //     addLinkButton.id = Object.keys(data.folderList[i])
            //     folderElement.appendChild(addLinkButton)
            //     // create a ul element and append it for each folder item
            //     let linksListElement = document.createElement("ul")
            //     folderElement.appendChild(linksListElement)
            //     // on add Link button click, add a link to the folder item list
            //     addLinkButton.addEventListener("click", () => {
            //         let linkElement = document.createElement("a")
            //         // get current tab url
            //         chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            //             console.log(Object.values(data.folderList[i]))
            //             console.log(key)
            //             linkElement.innerHTML = tabs[0].title
            //             linkElement.href = tabs[0].url
            //             linkElement.target = "_blank"
            //         });
            //         linksListElement.appendChild(linkElement)
            //     })
            // }
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
            let inputValue = document.getElementById("folder-input").value
            newFolder[inputValue] = []
            console.log(newFolder)
            oldFolderList.push(newFolder)
            // add the new folders list to the storage
            chrome.storage.local.set({ 'folderList': oldFolderList });
            // call the function to display the recent folder
            document.getElementById('folders-list').innerHTML = ""
            // Display new folders
            loadFoldersAndButtons(oldFolderList)
            // clear the input
            document.getElementById("folder-input").value = ""
        })
    })
})