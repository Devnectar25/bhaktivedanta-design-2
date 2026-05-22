/* Unified Admin Panel Layout Manager & Common Interactions */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Shared Layout
    initializeSidebar();
    initializeHeader();
    initializeNotifications();
    initializeInteractions();
    initializeForms();
    initializeBreadcrumbs();
});

// Sidebar & Header Mappings
const navLinks = [
    { name: 'Dashboard', icon: 'dashboard', href: 'dashboard.html' },
    { name: 'Services', icon: 'medical_services', href: 'services.html' },
    { name: 'Specialities', icon: 'star', href: 'specialities.html' },
    { name: 'Doctors', icon: 'group', href: 'doctors.html' },
    { name: 'Doctor Availability', icon: 'event_available', href: 'doctor-availability.html' },
    { name: 'Health Packages', icon: 'health_and_safety', href: 'health-packages.html' },
    { name: 'Centres of Excellence', icon: 'apartment', href: 'centres-of-excellence.html' },
    { name: 'Emergency Services', icon: 'emergency', href: 'emergency-services.html' },
    { divider: true },
    { name: 'Testimonials', icon: 'reviews', href: 'testimonials.html' },
    { name: 'News', icon: 'newspaper', href: 'news.html' },
    { name: 'Events', icon: 'event', href: 'events.html' },
    { name: 'Gallery', icon: 'image', href: 'gallery.html' },
    { divider: true },
    { name: 'Appointments', icon: 'calendar_month', href: 'appointments.html' },
    { name: 'Contact Queries', icon: 'contact_support', href: 'contact-queries.html' },
    { name: 'Admin Users', icon: 'manage_accounts', href: 'admin-users.html' }
];

const parentPages = {
    'add-doctor.html': 'doctors.html',
    'add-service.html': 'services.html',
    'add-speciality.html': 'specialities.html',
    'add-gallery-media.html': 'gallery.html',
    'add-centre-of-excellence.html': 'centres-of-excellence.html',
    'add-health-package.html': 'health-packages.html',
    'add-event.html': 'events.html',
    'add-testimonial.html': 'testimonials.html',
    'add-news.html': 'news.html',
    'add-admin-user.html': 'admin-users.html',
    'add-appointment.html': 'appointments.html',
    'add-emergency-service.html': 'emergency-services.html',
    'add-query.html': 'contact-queries.html'
};

const listPages = {
    'doctors.html': 'add-doctor.html',
    'services.html': 'add-service.html',
    'specialities.html': 'add-speciality.html',
    'gallery.html': 'add-gallery-media.html',
    'centres-of-excellence.html': 'add-centre-of-excellence.html',
    'health-packages.html': 'add-health-package.html',
    'events.html': 'add-event.html',
    'testimonials.html': 'add-testimonial.html',
    'news.html': 'add-news.html',
    'admin-users.html': 'add-admin-user.html',
    'appointments.html': 'add-appointment.html',
    'emergency-services.html': 'add-emergency-service.html',
    'contact-queries.html': 'add-query.html'
};

// Get current page filename
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    return filename || 'dashboard.html';
}

// 1. Sidebar Injector
function initializeSidebar() {
    const aside = document.querySelector('aside');
    if (!aside) return;

    // Apply premium styling classes to standard sidebar elements
    aside.className = "fixed left-0 top-0 h-full w-[280px] premium-sidebar flex flex-col py-6 z-50 overflow-hidden text-white";
    aside.style.backgroundColor = ""; // Clear inline override

    const currentPage = getCurrentPage();

    // Check if the current page is one of the add/child pages and determine their parent link active status
    let activeHref = currentPage;
    if (parentPages[currentPage]) {
        activeHref = parentPages[currentPage];
    }

    // Build sidebar contents
    let navHTML = `<div class="px-6 mb-6">
        <a class="flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer" href="dashboard.html">
            <span class="material-symbols-outlined text-[#f59e0b] text-[32px]" style="font-variation-settings: 'FILL' 1;">health_and_safety</span>
            <div>
                <h1 class="font-sans text-[20px] font-bold tracking-tight text-white leading-tight">Bhaktivedanta</h1>
                <p class="text-[10px] font-bold text-white/50 tracking-wider uppercase">Hospital Admin</p>
            </div>
        </a>
    </div>
    
    <nav class="flex-1 overflow-y-auto px-3 custom-scrollbar space-y-1">`;

    navLinks.forEach(item => {
        if (item.divider) {
            navHTML += `<div class="h-px bg-white/10 my-3 mx-3"></div>`;
        } else {
            const isActive = item.href === activeHref;
            const activeClass = isActive ? 'active-nav-link text-white' : 'text-white/80 hover:bg-white/10 hover:text-white';
            
            navHTML += `<a class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all smooth-transition text-sm font-medium ${activeClass}" href="${item.href}">
                <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
                <span>${item.name}</span>
            </a>`;
        }
    });

    navHTML += `</nav>
    
    <div class="px-4 pt-4 border-t border-white/10">
        <button id="emergency-alert-btn" class="w-full bg-[#ef4444] text-white py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 active:scale-95 transition-all shadow-md font-semibold text-sm">
            <span class="material-symbols-outlined text-[18px]">emergency_share</span>
            <span>Emergency Alert</span>
        </button>
        <div class="mt-4 space-y-1">
            <a class="flex items-center gap-3 px-4 py-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all text-sm ${currentPage === 'settings.html' ? 'active-nav-link text-white' : ''}" href="settings.html">
                <span class="material-symbols-outlined text-[20px]">settings</span>
                <span>Settings</span>
            </a>
            <button id="sidebar-logout-btn" class="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-white/80 hover:bg-red-500/20 hover:text-red-300 transition-all text-sm text-left">
                <span class="material-symbols-outlined text-[20px]">logout</span>
                <span>Logout</span>
            </button>
        </div>
    </div>`;

    aside.innerHTML = navHTML;

    // Attach log out handler
    const logoutBtn = document.getElementById('sidebar-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            showToast("Logging out...", "info");
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        });
    }

    // Attach emergency handler
    const alertBtn = document.getElementById('emergency-alert-btn');
    if (alertBtn) {
        alertBtn.addEventListener('click', openEmergencyModal);
    }
}

// 2. Header Injector
function initializeHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    // Capture the original breadcrumb navigation if it resides inside the header
    const originalNav = header.querySelector('nav');

    // Apply premium header styles dynamically
    const isOutsideMain = header.parentElement === document.body || !header.closest('main');
    if (isOutsideMain) {
        header.className = "fixed top-0 right-0 z-40 bg-white/80 backdrop-blur-md flex justify-between items-center h-16 px-8 border-b border-slate-200/50 shadow-sm w-[calc(100%-280px)] ml-[280px]";
    } else {
        header.className = "sticky top-0 z-40 bg-white/80 backdrop-blur-md flex justify-between items-center h-16 px-8 border-b border-slate-200/50 shadow-sm w-full";
    }
    header.style.width = ""; // Reset inline width overrides if any
    header.style.marginLeft = ""; // Reset inline margins

    const currentPage = getCurrentPage();
    let currentTitle = document.title.split('|')[0].trim();
    if (currentTitle === "Bhaktivedanta Hospital Admin Dashboard" || currentTitle === "Dashboard") {
        currentTitle = "Admin Dashboard";
    }

    header.innerHTML = `
        <div class="flex items-center gap-4">
            <h2 class="text-lg font-bold text-slate-800 font-sans">${currentTitle}</h2>
            <div class="relative w-80 group hidden md:block">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] group-focus-within:text-slate-600 transition-colors">search</span>
                <input class="w-full bg-slate-100/80 border border-slate-200 focus:border-slate-300 focus:bg-white rounded-full py-1.5 pl-10 pr-4 focus:ring-2 focus:ring-slate-200 outline-none transition-all text-xs text-slate-700" placeholder="Type here to search list contents..." type="text"/>
            </div>
        </div>
        <div class="flex items-center gap-6">
            <!-- Notification bell wrapper -->
            <div class="relative" id="notification-bell-wrapper">
                <button id="notification-bell-btn" class="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 relative transition-all active:scale-95">
                    <span class="material-symbols-outlined text-[22px]">notifications</span>
                    <span id="notification-badge" class="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border border-white hidden">0</span>
                </button>
                
                <!-- Dropdown -->
                <div id="notification-dropdown" class="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-slate-200/60 z-50 hidden flex-col max-h-[480px] overflow-hidden">
                    <!-- Dropdown Header -->
                    <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                        <span class="font-bold text-slate-700 text-sm">Notifications</span>
                        <button id="mark-all-read-btn" class="text-xs font-bold text-[#f59e0b] hover:text-amber-600 transition-colors">Mark all as read</button>
                    </div>
                    <!-- Notifications List -->
                    <div id="notifications-list" class="flex-1 overflow-y-auto custom-scrollbar-light divide-y divide-slate-100 max-h-[350px]">
                        <!-- Rendered dynamically -->
                    </div>
                    <!-- Dropdown Footer -->
                    <div class="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 text-center">
                        <button id="clear-all-notifications-btn" class="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors">Clear all notifications</button>
                    </div>
                </div>
            </div>
            <div class="h-6 w-[1px] bg-slate-200"></div>
            <!-- Profile Avatar and Info -->
            <div class="flex items-center gap-3">
                <div class="flex flex-col text-right hidden sm:block">
                    <span class="text-xs font-bold text-slate-800 leading-tight">Admin User</span>
                    <span class="text-[10px] font-semibold text-slate-400 leading-tight">Super Administrator</span>
                </div>
                <img alt="Admin Profile" class="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGqK0tUfbuqSxbfBIUdGMeFLtChbPcohJwmAhWmeKsnzBL50kdu9WUBzGrHm-_mjxXCOvs6vGG_KAEUZ0Aq4JK5XBMZnc0T2VNlIUGjxep88pAjeDh1qOjk-EQbBKMFilmsY84OYXkeUX5vrgN9FYHK-54D_SoK75i0Ef3GfVYJfcmKlz5nP_7RxFWc5dcg0fmLTej9icKl3NdyPKslBkJiav17I9drerB0CgS_Fi_YVuX8y12TNGXtXGTP3Ye8z1rJHjQThSl7pQ"/>
            </div>
        </div>
    `;

    // Reposition the original breadcrumbs to the content area if captured
    if (originalNav) {
        const contentArea = header.nextElementSibling || document.querySelector('main > section') || document.querySelector('main');
        if (contentArea) {
            contentArea.insertBefore(originalNav, contentArea.firstChild);
            originalNav.className = "flex items-center gap-2 mb-6 text-on-surface-variant font-label-sm text-label-sm";
            if (contentArea.classList.contains('grid')) {
                originalNav.classList.add('col-span-12');
            }
        }
    }

    // Global Search interaction: filter rows dynamically
    const searchInput = header.querySelector('input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const rows = document.querySelectorAll('table tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }
}

// 3. Setup form button redirections and general events
function initializeInteractions() {
    const currentPage = getCurrentPage();

    // Setup Dashboard KPI Cards click redirection
    if (currentPage === 'dashboard.html' || currentPage === 'ad portal.html' || currentPage === '') {
        const kpiCardMappings = {
            'total doctors': 'doctors.html',
            'total services': 'services.html',
            'specialities': 'specialities.html',
            'appointments': 'appointments.html',
            'total news': 'news.html',
            'total events': 'events.html',
            'testimonials': 'testimonials.html',
            'gallery images': 'gallery.html'
        };
        const cards = document.querySelectorAll('main section.grid > div');
        cards.forEach(card => {
            const pElement = card.querySelector('p');
            if (pElement) {
                const text = pElement.textContent.toLowerCase().trim();
                const destination = kpiCardMappings[text];
                if (destination) {
                    card.style.cursor = 'pointer';
                    card.classList.add('hover:shadow-lg', 'transition-all');
                    card.addEventListener('click', (e) => {
                        showToast(`Navigating to ${pElement.textContent}...`, "info");
                        setTimeout(() => {
                            window.location.href = destination;
                        }, 500);
                    });
                }
            }
        });
    }

    // Setup ADD button actions on List pages
    const targetAddPage = listPages[currentPage];
    if (targetAddPage) {
        // Find buttons containing "Add", "ADD", "Upload" or "Create"
        document.querySelectorAll('button').forEach(btn => {
            const text = btn.textContent.toLowerCase();
            if (text.includes('add') || text.includes('upload') || text.includes('create')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = targetAddPage;
                });
            }
        });

        // Setup EDIT, VIEW, and DELETE actions on tables
        document.querySelectorAll('table tbody tr').forEach(row => {
            row.querySelectorAll('button, a').forEach(btn => {
                const text = btn.textContent.toLowerCase();
                const title = (btn.getAttribute('title') || '').toLowerCase();
                const classStr = (btn.className || '').toLowerCase();
                
                const isEdit = text.includes('edit') || title.includes('edit') || classStr.includes('edit');
                const isView = text.includes('visibility') || text.includes('view') || title.includes('view') || title.includes('visibility') || classStr.includes('view');
                const isDelete = text.includes('delete') || title.includes('delete') || classStr.includes('delete');
                
                if (isEdit || isView) {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        showToast("Opening form details...", "info");
                        setTimeout(() => {
                            window.location.href = targetAddPage;
                        }, 500);
                    });
                } else if (isDelete) {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (confirm("Are you sure you want to delete this record?")) {
                            showToast("Deleting record...", "info");
                            setTimeout(() => {
                                row.style.transition = 'all 0.4s ease';
                                row.style.opacity = '0';
                                row.style.transform = 'translateX(20px)';
                                setTimeout(() => {
                                    row.remove();
                                    showToast("Record successfully deleted!", "success");
                                }, 400);
                            }, 800);
                        }
                    });
                }
            });

            // Make the entire row clickable to open details (for tables, excluding direct action buttons)
            row.style.cursor = 'pointer';
            row.addEventListener('click', (e) => {
                if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) return;
                showToast("Opening form details...", "info");
                setTimeout(() => {
                    window.location.href = targetAddPage;
                }, 500);
            });
        });
    }

    // Setup CANCEL / BACK button actions on Add pages
    const targetParentPage = parentPages[currentPage];
    if (targetParentPage) {
        document.querySelectorAll('button').forEach(btn => {
            const text = btn.textContent.toLowerCase();
            if (text.includes('cancel') || text.includes('back') || text.includes('close')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = targetParentPage;
                });
            }
        });
    }

    // Global real-time filter search for page search boxes
    document.querySelectorAll('input').forEach(input => {
        const placeholder = (input.getAttribute('placeholder') || '').toLowerCase();
        if (placeholder.includes('search') || placeholder.includes('filter') || placeholder.includes('name') || placeholder.includes('id...')) {
            input.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                const rows = document.querySelectorAll('table tbody tr');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(query) ? '' : 'none';
                });
            });
        }
    });
}

// 4. Handle Submissions and Login Validation
function initializeForms() {
    const currentPage = getCurrentPage();

    // A. Login Page Interactions
    if (currentPage === 'login.html') {
        const form = document.querySelector('form');
        const loginBtn = document.querySelector('form button');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (form && loginBtn) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                validateAndLogin();
            });

            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                validateAndLogin();
            });
        }

        function validateAndLogin() {
            const username = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';

            if (!username) {
                showToast("Please enter your username.", "error");
                return;
            }
            if (!password) {
                showToast("Please enter your password.", "error");
                return;
            }

            if ((username !== 'Admin' && username !== 'Admin@bhaktivedantahospital.com') || password !== 'Admin') {
                showToast("Invalid credentials! Please use 'Admin' for both.", "error");
                return;
            }

            showToast("Authenticating details...", "info");
            loginBtn.disabled = true;
            loginBtn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">autorenew</span> Connecting...`;

            setTimeout(() => {
                showToast("Welcome Back! Redirecting to Dashboard...", "success");
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            }, 1200);
        }
    }

    // B. Add Forms Interceptions (Save/Publish Notifications)
    const parentPage = parentPages[currentPage];
    if (parentPage) {
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                handleFormPublish();
            });
        }

        // Also bind any "Publish", "Save", "Submit", "Upload" or "Add" buttons
        document.querySelectorAll('button').forEach(btn => {
            const text = btn.textContent.toLowerCase();
            if (text.includes('publish') || text.includes('save') || text.includes('submit')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    handleFormPublish();
                });
            }
        });

        function handleFormPublish() {
            showToast("Saving records...", "info");
            setTimeout(() => {
                showToast("Records successfully published and synced!", "success");
                setTimeout(() => {
                    window.location.href = parentPage;
                }, 1200);
            }, 1000);
        }
    }
}

// Toast Notification System
function showToast(message, type = 'success') {
    // Remove existing toast container if exists
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = "fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full";
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = "flex items-center gap-3 p-4 rounded-xl shadow-lg border text-sm font-sans animate-slide-up bg-white";
    
    let icon = 'check_circle';
    let iconColor = 'text-green-500';
    let borderColor = 'border-green-100';

    if (type === 'error') {
        icon = 'cancel';
        iconColor = 'text-red-500';
        borderColor = 'border-red-100';
    } else if (type === 'info') {
        icon = 'info';
        iconColor = 'text-blue-500';
        borderColor = 'border-blue-100';
    }

    toast.classList.add(borderColor);
    toast.innerHTML = `
        <span class="material-symbols-outlined ${iconColor} text-[22px] flex-shrink-0">${icon}</span>
        <span class="text-slate-700 flex-1 font-medium">${message}</span>
        <button class="text-slate-400 hover:text-slate-600 transition-colors ml-2" onclick="this.parentElement.remove()">
            <span class="material-symbols-outlined text-[16px]">close</span>
        </button>
    `;

    toastContainer.appendChild(toast);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Emergency Alert Modal dialog
function openEmergencyModal() {
    let modal = document.getElementById('emergency-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'emergency-modal';
    modal.className = "fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in";
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-red-100 animate-slide-up">
            <div class="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white flex items-center gap-3">
                <span class="material-symbols-outlined text-[28px] animate-pulse">emergency</span>
                <div>
                    <h3 class="text-lg font-bold">Broadcast Emergency Alert</h3>
                    <p class="text-xs text-white/70">Announce system notices or hospital emergency codes</p>
                </div>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Alert Template</label>
                    <select id="emergency-template" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500/20 text-slate-700 font-sans">
                        <option value="code-red">Code Red: Fire Emergency</option>
                        <option value="code-blue">Code Blue: Cardiac Arrest</option>
                        <option value="maintenance">System Scheduled Maintenance (15 Mins)</option>
                        <option value="custom">Custom Message Alert</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Custom Broadcast Message</label>
                    <textarea id="emergency-message" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500/20 text-slate-700 font-sans" placeholder="Type custom message here...">Code Red is active in Wing B. Evacuate immediately.</textarea>
                </div>
            </div>
            <div class="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
                <button id="cancel-alert-btn" class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-sans">Cancel</button>
                <button id="broadcast-alert-btn" class="px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md hover:shadow-lg active:scale-95 transition-all font-sans flex items-center gap-1">
                    <span class="material-symbols-outlined text-[16px]">campaign</span>
                    <span>Broadcast</span>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const templateSelect = document.getElementById('emergency-template');
    const messageArea = document.getElementById('emergency-message');

    templateSelect.addEventListener('change', () => {
        const value = templateSelect.value;
        if (value === 'code-red') {
            messageArea.value = "Code Red is active in Wing B. Evacuate immediately.";
        } else if (value === 'code-blue') {
            messageArea.value = "Code Blue reported in Neurology Ward (3rd floor). Team B assemble.";
        } else if (value === 'maintenance') {
            messageArea.value = "System will undergo a scheduled sync update in 15 minutes. Save active forms.";
        } else {
            messageArea.value = "";
            messageArea.focus();
        }
    });

    document.getElementById('cancel-alert-btn').addEventListener('click', () => {
        modal.remove();
    });

    document.getElementById('broadcast-alert-btn').addEventListener('click', () => {
        const msg = messageArea.value.trim();
        if (!msg) {
            showToast("Please enter an alert message.", "error");
            return;
        }
        
        modal.remove();
        showToast("Broadcasting Emergency Alert...", "info");
        setTimeout(() => {
            showToast(`ALERT BROADCASTED: "${msg}"`, "error");
            addNotification("Emergency Alert Broadcasted", msg, "error");
        }, 1000);
    });
}

// Notification System State & UI Helpers
const defaultNotifications = [
    {
        id: "notif-1",
        title: "New Appointment Request",
        message: "Patient Amit Sharma requested an appointment with Dr. Avinash (Neurology).",
        time: "10 mins ago",
        type: "info",
        read: false
    },
    {
        id: "notif-2",
        title: "Emergency Alert Broadcasted",
        message: "Code Red active in Wing B. Personnel please respond.",
        time: "1 hour ago",
        type: "error",
        read: false
    },
    {
        id: "notif-3",
        title: "Inventory Stock Alert",
        message: "Critical Warning: Oxygen cylinder reserve is below 15%. Reorder immediately.",
        time: "2 hours ago",
        type: "warning",
        read: false
    },
    {
        id: "notif-4",
        title: "System Sync Complete",
        message: "Database sync finished successfully. 142 records updated.",
        time: "5 hours ago",
        type: "success",
        read: true
    }
];

function getNotifications() {
    const data = localStorage.getItem('bhaktivedanta_notifications');
    if (!data) {
        localStorage.setItem('bhaktivedanta_notifications', JSON.stringify(defaultNotifications));
        return defaultNotifications;
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return defaultNotifications;
    }
}

function saveNotifications(notifications) {
    localStorage.setItem('bhaktivedanta_notifications', JSON.stringify(notifications));
    updateNotificationsUI();
}

function addNotification(title, message, type = 'info') {
    const list = getNotifications();
    const newNotif = {
        id: `notif-${Date.now()}`,
        title,
        message,
        time: "Just now",
        type,
        read: false
    };
    list.unshift(newNotif);
    saveNotifications(list);
}

function updateNotificationsUI() {
    const list = getNotifications();
    const badge = document.getElementById('notification-badge');
    const listContainer = document.getElementById('notifications-list');
    
    if (!badge || !listContainer) return;
    
    const unreadCount = list.filter(n => !n.read).length;
    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
    
    listContainer.innerHTML = '';
    
    if (list.length === 0) {
        listContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center py-8 px-4 text-center">
                <span class="material-symbols-outlined text-[36px] text-slate-300 mb-2">notifications_off</span>
                <p class="text-xs text-slate-400 font-bold">No notifications</p>
            </div>
        `;
        return;
    }
    
    list.forEach(notif => {
        const item = document.createElement('div');
        item.className = `flex gap-3 p-4 hover:bg-slate-50 transition-colors relative group/item cursor-pointer ${notif.read ? 'opacity-70' : ''}`;
        item.setAttribute('data-id', notif.id);
        
        let iconName = 'info';
        let iconBgClass = 'bg-blue-50 text-blue-500 border border-blue-100';
        
        if (notif.type === 'success') {
            iconName = 'check_circle';
            iconBgClass = 'bg-green-50 text-green-500 border border-green-100';
        } else if (notif.type === 'warning') {
            iconName = 'warning';
            iconBgClass = 'bg-amber-50 text-amber-500 border border-amber-100';
        } else if (notif.type === 'error') {
            iconName = 'emergency';
            iconBgClass = 'bg-red-50 text-red-500 border border-red-100 animate-pulse';
        }
        
        item.innerHTML = `
            <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBgClass}">
                <span class="material-symbols-outlined text-[18px]">${iconName}</span>
            </div>
            <div class="flex-1 min-w-0 pr-6">
                <div class="flex items-center justify-between gap-2 mb-0.5">
                    <p class="text-xs ${notif.read ? 'font-medium text-slate-600' : 'font-bold text-slate-800'} truncate">${notif.title}</p>
                    <span class="text-[10px] text-slate-400 whitespace-nowrap">${notif.time}</span>
                </div>
                <p class="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">${notif.message}</p>
            </div>
            ${!notif.read ? `<span class="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></span>` : ''}
            <button class="absolute bottom-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 rounded hover:bg-slate-100 delete-notif-btn" data-id="${notif.id}">
                <span class="material-symbols-outlined text-[14px]">delete</span>
            </button>
        `;
        
        // Item click to mark as read
        item.addEventListener('click', (e) => {
            if (e.target.closest('.delete-notif-btn')) return; // ignore delete click
            if (!notif.read) {
                const notifications = getNotifications();
                const target = notifications.find(n => n.id === notif.id);
                if (target) {
                    target.read = true;
                    saveNotifications(notifications);
                }
            }
        });
        
        // Delete button click
        const deleteBtn = item.querySelector('.delete-notif-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const notifications = getNotifications();
            const filtered = notifications.filter(n => n.id !== notif.id);
            saveNotifications(filtered);
            showToast("Notification deleted", "info");
        });
        
        listContainer.appendChild(item);
    });
}

function initializeNotifications() {
    const bellBtn = document.getElementById('notification-bell-btn');
    const dropdown = document.getElementById('notification-dropdown');
    const markAllBtn = document.getElementById('mark-all-read-btn');
    const clearAllBtn = document.getElementById('clear-all-notifications-btn');
    const wrapper = document.getElementById('notification-bell-wrapper');
    
    if (!bellBtn || !dropdown) return;
    
    // Initial Render
    updateNotificationsUI();
    
    // Toggle dropdown on bell click
    bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = dropdown.classList.contains('hidden');
        if (isHidden) {
            dropdown.classList.remove('hidden');
            dropdown.classList.add('flex', 'animate-dropdown');
        } else {
            dropdown.classList.add('hidden');
            dropdown.classList.remove('flex', 'animate-dropdown');
        }
    });
    
    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (wrapper && !wrapper.contains(e.target)) {
            dropdown.classList.add('hidden');
            dropdown.classList.remove('flex', 'animate-dropdown');
        }
    });
    
    // Mark all read
    if (markAllBtn) {
        markAllBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const list = getNotifications();
            list.forEach(n => n.read = true);
            saveNotifications(list);
            showToast("All notifications marked as read", "success");
        });
    }
    
    // Clear all
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm("Are you sure you want to clear all notifications?")) {
                saveNotifications([]);
                showToast("All notifications cleared", "success");
            }
        });
    }
}

// 5. Initialize Breadcrumbs Links
function initializeBreadcrumbs() {
    const breadcrumbNavs = Array.from(document.querySelectorAll('nav')).filter(nav => {
        // Exclude sidebar navigation (which is inside <aside>)
        if (nav.closest('aside')) return false;
        
        // Find if it has "Dashboard" or "Directory" or "chevron_right" (either text or inside a child)
        const text = nav.textContent.toLowerCase();
        return text.includes('dashboard') || text.includes('directory') || nav.querySelector('.material-symbols-outlined');
    });

    const mapping = {
        'dashboard': 'dashboard.html',
        'directory': 'admin-users.html',
        'services': 'services.html',
        'specialities': 'specialities.html',
        'doctors': 'doctors.html',
        'doctor availability': 'doctor-availability.html',
        'health packages': 'health-packages.html',
        'centres of excellence': 'centres-of-excellence.html',
        'emergency services': 'emergency-services.html',
        'testimonials': 'testimonials.html',
        'news': 'news.html',
        'events': 'events.html',
        'gallery': 'gallery.html',
        'appointments': 'appointments.html',
        'contact queries': 'contact-queries.html',
        'admin users': 'admin-users.html',
        'settings': 'settings.html'
    };

    const currentPage = getCurrentPage().split('?')[0].split('#')[0];

    breadcrumbNavs.forEach(nav => {
        const children = Array.from(nav.childNodes);
        children.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const text = node.textContent.trim().toLowerCase();
                
                // Skip if it's a divider
                if (text === 'chevron_right' || text === '/' || node.classList.contains('material-symbols-outlined')) {
                    return;
                }
                
                if (mapping[text]) {
                    const targetUrl = mapping[text];
                    
                    // If it's already the current page, don't link it (keep it static)
                    if (currentPage === targetUrl) {
                        return;
                    }
                    
                    if (node.tagName.toLowerCase() === 'a') {
                        node.setAttribute('href', targetUrl);
                        node.classList.add('hover:text-primary', 'cursor-pointer', 'transition-colors');
                    } else {
                        // Replace span/text node with an anchor tag to make it a real link
                        const newLink = document.createElement('a');
                        newLink.href = targetUrl;
                        newLink.textContent = node.textContent;
                        newLink.className = node.className;
                        newLink.classList.add('hover:text-primary', 'cursor-pointer', 'transition-colors');
                        node.parentNode.replaceChild(newLink, node);
                    }
                }
            }
        });
    });
}
