// Lightweight sidebar utilities for docs pages:
// - Search: filters visible sidebar links as you type
// - Resize: draggable sidebar width with persistence

function onReady(fn) {
  if (typeof window === 'undefined') return;
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

function waitForElement(selector, timeout = 10000) {
  if (typeof window === 'undefined') return Promise.reject(new Error('Window not available'));
  
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Timeout fallback
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

function setupSidebarUtilities() {
  if (typeof window === 'undefined') return;
  
  const sidebarContainer = document.querySelector('.theme-doc-sidebar-container');
  const sidebarRoot =
    document.querySelector('.theme-doc-sidebar-menu') ||
    (sidebarContainer ? sidebarContainer.querySelector('nav.menu') : null) ||
    document.querySelector('nav.menu');

  // Search functionality
  let input = document.getElementById('sidebar-search-input');
  
  // If input doesn't exist, create it
  if (!input && sidebarRoot) {
    input = document.createElement('input');
    input.id = 'sidebar-search-input';
    input.type = 'text';
    input.placeholder = 'Search in sidebar...';
    input.setAttribute('aria-label', 'Search in sidebar');
    
    // Insert at the top of the sidebar
    const firstList = sidebarRoot.querySelector('ul.menu__list');
    if (firstList && firstList.parentElement === sidebarRoot) {
      sidebarRoot.insertBefore(input, firstList);
    } else {
      sidebarRoot.prepend(input);
    }
  }

  if (input && sidebarRoot) {
    function setElementVisible(element, visible) {
      try {
        if (element && element.style && typeof element.style.display !== 'undefined') {
          element.style.display = visible ? '' : 'none';
        }
      } catch (error) {
        // Silently handle any DOM manipulation errors
      }
    }

    function resetVisibility() {
      try {
        const allItems = sidebarRoot.querySelectorAll('li.menu__list-item');
        allItems.forEach((li) => setElementVisible(li, true));
      } catch (error) {
        // Silently handle any DOM manipulation errors
      }
    }

    function expandAllCategories() {
      try {
        const toggles = sidebarRoot.querySelectorAll('button.menu__link--sublist, div.menu__list-item-collapsible button');
        toggles.forEach((btn) => {
          if (btn && btn.getAttribute && typeof btn.click === 'function') {
            const expanded = btn.getAttribute('aria-expanded');
            if (expanded !== 'true') {
              btn.click();
            }
          }
        });
      } catch (error) {
        // Silently handle any DOM manipulation errors
      }
    }

    function filterSidebar(query) {
      try {
        // Ensure query is a valid string
        if (!query || typeof query !== 'string') {
          resetVisibility();
          return;
        }
        
        const q = query.trim().toLowerCase();
        if (q.length === 0) {
          resetVisibility();
          return;
        }

        // Always expand categories when filtering
        expandAllCategories();

        const linkItems = sidebarRoot.querySelectorAll('li.menu__list-item a.menu__link');
        
        linkItems.forEach((link) => {
          try {
            const li = link.closest('li.menu__list-item');
            if (!li) return;
            
            const text = link.textContent || '';
            if (typeof text === 'string' && text.length > 0) {
              const match = text.toLowerCase().includes(q);
              setElementVisible(li, match);
            }
          } catch (error) {
            // Skip this link if there's an error
          }
        });

        // Show categories only if a descendant item is visible
        const categoryItems = sidebarRoot.querySelectorAll('li.menu__list-item > div.menu__list-item-collapsible');
        categoryItems.forEach((wrapper) => {
          try {
            const li = wrapper.closest('li.menu__list-item');
            const subList = li && li.querySelector(':scope > ul.menu__list');
            if (!li || !subList) return;
            
            const anyVisible = Array.from(subList.children).some((child) => {
              try {
                return child && child.style && typeof child.style.display !== 'undefined' && child.style.display !== 'none';
              } catch (error) {
                return false;
              }
            });
            setElementVisible(li, anyVisible);
          } catch (error) {
            // Skip this category if there's an error
          }
        });
      } catch (error) {
        // If filtering fails, reset visibility
        resetVisibility();
      }
    }

    let debounceTimer = null;
    
    // Safe input event handler
    function handleInput(e) {
      try {
        if (e && e.target && typeof e.target.value === 'string') {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            try {
              filterSidebar(e.target.value);
            } catch (error) {
              // If filtering fails, just reset visibility
              resetVisibility();
            }
          }, 100);
        }
      } catch (error) {
        // If input handling fails, reset visibility
        resetVisibility();
      }
    }

    // Safe keydown event handler
    function handleKeydown(e) {
      try {
        if (e && e.key === 'Escape' && input) {
          input.value = '';
          filterSidebar('');
          input.blur();
        }
      } catch (error) {
        // Silently handle keydown errors
      }
    }

    // Add event listeners with error handling
    try {
      input.addEventListener('input', handleInput);
      input.addEventListener('keydown', handleKeydown);
    } catch (error) {
      // If event listeners fail, the search won't work but won't crash
    }
  }

  // Resizer functionality
  if (sidebarContainer) {
    try {
      const STORAGE_KEY = 'sidebarWidthPx';
      const MIN_WIDTH = 160;
      const MAX_WIDTH = 420;

      function applyWidth(px) {
        try {
          const clamped = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, px));
          sidebarContainer.style.width = clamped + 'px';
          sidebarContainer.style.minWidth = clamped + 'px';
          document.documentElement.style.setProperty('--doc-sidebar-width', clamped + 'px');
        } catch (error) {
          // Silently handle width setting errors
        }
      }

      const saved = parseInt(localStorage.getItem(STORAGE_KEY) || '', 10);
      if (!Number.isNaN(saved)) {
        applyWidth(saved);
      }

      const handle = document.createElement('div');
      handle.className = 'theme-doc-sidebar-resizer';
      handle.setAttribute('aria-hidden', 'true');
      sidebarContainer.appendChild(handle);

      let startX = 0;
      let startWidth = 0;
      let dragging = false;

      function onMouseMove(e) {
        try {
          if (!dragging) return;
          const delta = e.clientX - startX;
          const nextWidth = startWidth + delta;
          applyWidth(nextWidth);
        } catch (error) {
          // Silently handle mouse move errors
        }
      }

      function endDrag() {
        try {
          if (!dragging) return;
          dragging = false;
          document.body.classList.remove('sidebar-resizing');
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', endDrag);
          const widthNow = parseInt(window.getComputedStyle(sidebarContainer).width, 10);
          if (!Number.isNaN(widthNow)) {
            localStorage.setItem(STORAGE_KEY, String(widthNow));
          }
        } catch (error) {
          // Silently handle drag end errors
        }
      }

      function startDrag(e) {
        try {
          startX = e.clientX;
          startWidth = parseInt(window.getComputedStyle(sidebarContainer).width, 10);
          dragging = true;
          document.body.classList.add('sidebar-resizing');
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', endDrag);
        } catch (error) {
          // Silently handle drag start errors
        }
      }

      try {
        handle.addEventListener('mousedown', startDrag);
      } catch (error) {
        // If event listener fails, resizer won't work but won't crash
      }
    } catch (error) {
      // If resizer setup fails, it won't work but won't crash the page
    }
  }
}

onReady(async () => {
  if (typeof window === 'undefined') return;
  
  // Wait for the sidebar to be rendered
  try {
    await waitForElement('.theme-doc-sidebar-container');
    setupSidebarUtilities();
  } catch (error) {
    // Fallback: retry after a delay
    setTimeout(() => {
      try {
        setupSidebarUtilities();
      } catch (error) {
        // If setup fails, don't crash the page
      }
    }, 1000);
  }
  
  // Also watch for navigation changes (SPA routing)
  try {
    let lastUrl = location.href;
    new MutationObserver(() => {
      try {
        const url = location.href;
        if (url !== lastUrl) {
          lastUrl = url;
          setTimeout(() => {
            try {
              setupSidebarUtilities();
            } catch (error) {
              // If setup fails, don't crash the page
            }
          }, 500);
        }
      } catch (error) {
        // Silently handle navigation observer errors
      }
    }).observe(document, { subtree: true, childList: true });
  } catch (error) {
    // If navigation observer fails, don't crash the page
  }
});


