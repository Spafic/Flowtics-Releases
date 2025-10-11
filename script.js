// Flowtics Download Page Script
const RELEASES_URL = "releases/latest.json";

// Platform detection
function detectPlatform() {
  const platform = navigator.platform.toLowerCase();
  const userAgent = navigator.userAgent.toLowerCase();

  if (platform.includes("win")) return "windows";
  if (platform.includes("mac") || userAgent.includes("mac")) return "macos";
  if (platform.includes("linux")) return "linux";

  return "windows"; // Default
}

// Format file size
function formatBytes(bytes) {
  if (bytes === 0 || !bytes) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

// Show error message
function showError(message) {
  const loadingState = document.getElementById("loading-state");
  loadingState.innerHTML = `
        <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <i class="fas fa-exclamation-circle text-red-500 text-3xl mb-3"></i>
            <p class="text-red-800 font-semibold mb-2">Failed to Load Release Information</p>
            <p class="text-red-600 text-sm">${message}</p>
            <button onclick="loadReleaseInfo()" class="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
                <i class="fas fa-redo mr-2"></i>Try Again
            </button>
        </div>
    `;
}

// Load release information
async function loadReleaseInfo() {
  try {
    const response = await fetch(RELEASES_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Update version text safely
    const versionText = document.getElementById("version-text");
    const versionNumber = document.getElementById("version-number");
    const releaseNotes = document.getElementById("release-notes");

    if (versionText) {
      versionText.textContent = `Version ${data.version}`;
    }
    if (versionNumber) {
      versionNumber.textContent = data.version;
    }
    if (releaseNotes) {
      releaseNotes.textContent =
        data.releaseNotes || "No release notes available";
    }

    // Get download sections
    const windowsContainer = document.getElementById("windows-downloads");
    const macContainer = document.getElementById("mac-downloads");
    const linuxContainer = document.getElementById("linux-downloads");

    // Get section wrappers
    const windowsSection = windowsContainer?.closest(".download-section");
    const macSection = macContainer?.closest(".download-section");
    const linuxSection = linuxContainer?.closest(".download-section");

    // Clear containers
    if (windowsContainer) windowsContainer.innerHTML = "";
    if (macContainer) macContainer.innerHTML = "";
    if (linuxContainer) linuxContainer.innerHTML = "";

    // Track if we have any downloads for each platform
    let hasWindows = false;
    let hasMac = false;
    let hasLinux = false;

    // Check if platforms exist and is an object
    if (data.platforms && typeof data.platforms === "object") {
      // Group platforms by OS
      for (const [key, platform] of Object.entries(data.platforms)) {
        // Skip if no URL or empty URL
        if (!platform || !platform.url || platform.url.trim() === "") continue;

        const downloadCard = createDownloadCard(key, platform, data.version);

        if (key.startsWith("win") && windowsContainer) {
          windowsContainer.appendChild(downloadCard);
          hasWindows = true;
        } else if (key.startsWith("mac") && macContainer) {
          macContainer.appendChild(downloadCard);
          hasMac = true;
        } else if (key.startsWith("linux") && linuxContainer) {
          linuxContainer.appendChild(downloadCard);
          hasLinux = true;
        }
      }
    }

    // Show/hide sections based on available downloads
    if (windowsSection) {
      windowsSection.style.display = hasWindows ? "block" : "none";
    }
    if (macSection) {
      macSection.style.display = hasMac ? "block" : "none";
    }
    if (linuxSection) {
      linuxSection.style.display = hasLinux ? "block" : "none";
    }

    // Check if we have any downloads at all
    const hasAnyDownloads = hasWindows || hasMac || hasLinux;

    if (!hasAnyDownloads) {
      throw new Error("No release downloads are currently available");
    }

    // Hide loading state and show download buttons
    const loadingState = document.getElementById("loading-state");
    const downloadButtons = document.getElementById("download-buttons");
    const releaseInfo = document.getElementById("release-info");

    if (loadingState) loadingState.classList.add("hidden");
    if (downloadButtons) downloadButtons.classList.remove("hidden");
    if (releaseInfo) releaseInfo.classList.remove("hidden");
  } catch (error) {
    console.error("Error loading release info:", error);
    showError(
      error.message ||
        "Unable to fetch release information. Please try again later."
    );
  }
}

// Create download card element
function createDownloadCard(key, platform, version) {
  const card = document.createElement("a");
  card.href = platform.url;
  card.className =
    "download-card block bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-400 rounded-lg p-4 transition-all duration-200 hover:shadow-md";

  const size = platform.size ? formatBytes(platform.size) : "Download";

  card.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="font-medium text-gray-900">${platform.label || key}</div>
        <div class="text-sm text-gray-500 mt-1">${size}</div>
      </div>
      <div class="ml-4">
        <i class="fas fa-download text-blue-600 text-lg"></i>
      </div>
    </div>
  `;

  card.addEventListener("click", (e) => {
    // Check if URL is valid before allowing download
    if (!platform.url || platform.url === "" || platform.url === "#") {
      e.preventDefault();
      alert("This installer is not yet available. Please check back later.");
      return;
    }
    trackDownload(key, version);
  });

  return card;
}

// Highlight recommended platform based on user's OS
function highlightRecommendedPlatform() {
  // Removed - no longer highlighting recommended platform
}

// Track download (you can extend this to send analytics)
function trackDownload(platform, version) {
  console.log(`Download started: ${platform} - v${version}`);

  // Show download notification
  showDownloadNotification(platform);
}

// Show download notification
function showDownloadNotification(platform) {
  const notification = document.createElement("div");
  notification.className =
    "fixed bottom-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center space-x-3 animate-fade-in";
  notification.innerHTML = `
        <i class="fas fa-check-circle text-2xl"></i>
        <div>
            <div class="font-semibold">Download Started!</div>
            <div class="text-sm text-green-100">Your ${platform} installer is downloading...</div>
        </div>
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateY(20px)";
    notification.style.transition = "all 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Add fade-in animation
const style = document.createElement("style");
style.textContent = `
    @keyframes animate-fade-in {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .animate-fade-in {
        animation: animate-fade-in 0.3s ease;
    }
`;
document.head.appendChild(style);

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadReleaseInfo();

  // Add smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      // Skip if it's just "#" or if element has download functionality
      if (href === "#" || this.id.includes("download")) {
        return;
      }
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});

// Handle offline state
window.addEventListener("offline", () => {
  const banner = document.createElement("div");
  banner.className =
    "fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50";
  banner.innerHTML =
    '<i class="fas fa-wifi-slash mr-2"></i>You appear to be offline. Download functionality may be limited.';
  banner.id = "offline-banner";
  document.body.prepend(banner);
});

window.addEventListener("online", () => {
  const banner = document.getElementById("offline-banner");
  if (banner) {
    banner.remove();
  }
});
