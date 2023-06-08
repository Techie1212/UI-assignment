document.addEventListener("DOMContentLoaded", function () {  
    const connectButton = document.getElementById("connectButton");
    const nftList = document.getElementById("nftList");
    const accountAddress = document.getElementById("accountAddress");
    const carousel = document.getElementById("carousel");
    const singleNftPage = document.getElementById("singleNftPage");
    const backButton = document.getElementById("backButton");
    const nftDetails = document.getElementById("nftDetails");
  
    let isConnected = false;
    let selectedNFT = null;
  
    // Connect Keplr Account
    connectButton.addEventListener("click", function () {
      // Connect Keplr account logic here
      // Once connected, set isConnected to true and update accountAddress
      isConnected = true;
      accountAddress.textContent = "Connected Address: <address>"; // Replace <address> with the actual account address
      // After connecting, fetch and display the list of NFTs
      fetchNFTList();
    });

  
    // Fetch and display the list of NFTs
  function fetchNFTList() {
      // Fetch the NFT list using the API endpoint mentioned in the requirements
      // Parse the response and populate the carousel with NFT items
      fetch("https://data-api.omniflix.studio/listings?statuses[]=LISTED&verified=true&ipInfringement=false&sortBy=created_at&order=desc&limit=10")
          .then(response => response.json())
          .then(data => {
              // Clear previous carousel items
              carousel.innerHTML = "";
  
              // Create and append new carousel items for each NFT
              data.forEach(nft => {
                  const item = document.createElement("div");
                  item.className = "carouselItem";
                  item.innerHTML = `
                      <img src="${nft.image}" alt="${nft.name}">
                      <p>${nft.name}</p>
                  `;
  
                  // Add event listener to select an NFT item
                  item.addEventListener("click", function() {
                      // Set the selected NFT and navigate to the single NFT page
                      selectedNFT = nft;
                      showSingleNFTPage();
                  });
  
                  carousel.appendChild(item);
              });
          });
  }
  
  // Show the single NFT page
  function showSingleNFTPage() {
      // Hide the NFT list and show the single NFT page
      nftList.classList.add("hidden");
      singleNftPage.classList.remove("hidden");
  
      // Display the selected NFT details
      nftDetails.innerHTML = `
          <h2>${selectedNFT.name}</h2>
          <img src="${selectedNFT.image}" alt="${selectedNFT.name}">
          <p>Description: ${selectedNFT.description}</p>
          <p>Owner: ${selectedNFT.owner}</p>
          <!-- Add more NFT details here -->
      `;
  }
  
  // Go back to the NFT list
  backButton.addEventListener("click", function() {
      // Clear the selected NFT and navigate back to the NFT list
      selectedNFT = null;
      singleNftPage.classList.add("hidden");
      nftList.classList.remove("hidden");
  });
  
  // Check if Keplr is installed and available
  if (window.getOfflineSigner && window.keplr) {
      // Get the offline signer
      const offlineSigner = window.getOfflineSigner("cosmoshub");
  
      // Check if Keplr is initialized
      if (!window.keplr.experimentalSuggestChain) {
          alert("Please make sure Keplr is initialized and connected.");
          return;
      }
  
      // Create a function to update the account address in the UI
      function updateAccountAddress() {
          if (isConnected) {
              // Get the current Keplr account
              offlineSigner.getAccounts().then((accounts) => {
                  if (accounts.length > 0) {
                      const address = accounts[0].address;
                      accountAddress.textContent = `Connected Address: ${address}`;
                  }
              });
          }
      }
  
      // Add an event listener for the Keplr account change event
      window.keplr.signer.addListener((accounts) => {
          updateAccountAddress();
      });
  
      // Connect Keplr Account
      connectButton.addEventListener("click", function() {
          // Connect Keplr account logic here
          // Once connected, set isConnected to true and update accountAddress
          isConnected = true;
          updateAccountAddress();
  
          // After connecting, fetch and display the list of NFTs
          fetchNFTList();
    });
}
});