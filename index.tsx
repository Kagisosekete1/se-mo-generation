/* tslint:disable */
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License: Apache-2.0
 */
import {GoogleGenAI, Modality, Content} from '@google/genai';

// --- App Constants ---
const GEMINI_API_KEY = process.env.API_KEY;
const MAX_FREE_DOWNLOADS = 5;
const MAX_SHARE_CREDITS = 5;
const TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes
const ALL_PROMPTS = [
    'A hyperrealistic portrait of a cyborg cat with glowing neon eyes.',
    'An enchanting forest filled with bioluminescent mushrooms and mythical creatures.',
    'A bustling cyberpunk city street at night, drenched in rain and neon lights.',
    'A majestic dragon soaring through a stormy sky, clutching a crystal.',
    'A retro-futuristic car driving towards a setting sun on an endless grid.',
    'An oil painting of a tranquil Japanese garden with a koi pond.',
    'A breathtaking nebula in deep space, with swirling galaxies and stars.',
    'A steam-powered airship navigating through a canyon of floating islands.',
    'A cozy, cluttered wizard\'s workshop filled with glowing potions and ancient books.',
    'An epic battle between a giant robot and a colossal sea monster in a coastal city.',
    'A hidden village of treehouses connected by rope bridges in a massive jungle.',
    'A minimalist scene of a single red umbrella in a black and white rainy cityscape.',
    'An Art Deco style grand hall, bustling with elegantly dressed figures from the 1920s.',
    'A surreal landscape where the ground is a chessboard and the sky is made of liquid gold.',
    'A close-up shot of a hummingbird with iridescent feathers, hovering by a vibrant flower.',
    'A medieval knight in ornate armor, holding a glowing sword, standing at a castle gate.',
    'A family of friendly robots having a picnic in a lush green park.',
    'An underwater city built inside a giant, transparent dome, with marine life swimming by.',
    'A lone astronaut discovering an ancient alien artifact on a desolate red planet.',
    'A high-speed chase sequence with futuristic motorcycles on a highway in the clouds.',
];
const DAILY_PROMPTS_COUNT = 5;
const CREATIONS_PER_PAGE = 12;


// --- App State ---
let currentUser: string | null = null;
let currentUserName: string | null = null;
let emailToReset: string | null = null;
let userState = {
  isPremium: false,
  downloadsToday: 0,
  lastDownloadDate: '',
  sharesToday: 0,
  lastShareDate: '',
  subscription: {
    plan: '', // 'monthly' or 'yearly'
    nextBilling: '',
  }
};
let userSettings = {
    imageAspectRatio: '1:1',
    imageFormat: 'image/jpeg',
    watermark: true,
    notifications: {
        featureUpdates: true,
        exportAlerts: true,
        communityNews: true,
    },
    theme: 'light',
    language: 'en-US',
    timezone: 'Africa/Johannesburg',
};
let currentCreation = {
    data: '',
    type: '', // 'image'
};
let selectedPremiumPlan: 'monthly' | 'yearly' | null = null;
let base64data = '';
let mimeType = '';
let currentPromptText = '';
let creationsCurrentPage = 1;
let chatHistory: Content[] = [];
let isChatLoading = false;

// --- DOM Elements ---
let mainContent: HTMLElement;
let splashScreen: HTMLElement;

// Auth Elements
let authContainer: HTMLDivElement;
let loginForm: HTMLFormElement;
let registerForm: HTMLFormElement;
let forgotPasswordForm: HTMLFormElement;
let resetPasswordForm: HTMLFormElement;
let authToggleLink: HTMLAnchorElement;
let forgotPasswordLink: HTMLAnchorElement;
let authTitle: HTMLHeadingElement;
let authSubtitle: HTMLParagraphElement;
let authToggleText: HTMLSpanElement;
let authErrorEl: HTMLDivElement;
let authSuccessEl: HTMLDivElement;
let authLegalContainer: HTMLDivElement;
let authLegalTabs: NodeListOf<HTMLButtonElement>;
let authLegalPanes: NodeListOf<HTMLDivElement>;

// Main UI Elements
let userStatusEl: HTMLSpanElement;
let subscribeButton: HTMLButtonElement;
let resultsContainer: HTMLDivElement;
let downloadButton: HTMLButtonElement;
let saveCreationButton: HTMLButtonElement;
let shareButton: HTMLButtonElement;
let viewCreationButton: HTMLButtonElement;
let imageSettings: HTMLDivElement;
let imageAspectRatioSelect: HTMLSelectElement;
let imageFormatSelect: HTMLSelectElement;
let resultImage: HTMLImageElement;
let promptEl: HTMLTextAreaElement;
let generateButton: HTMLButtonElement;
let aiAssistButton: HTMLButtonElement;
let statusEl: HTMLDivElement;
let spinnerContainer: HTMLDivElement;
let examplePromptsSelect: HTMLSelectElement;
let upload: HTMLInputElement;
let fileNameDisplay: HTMLSpanElement;
let fileInputLabel: HTMLLabelElement;

// Main Navigation
let imageNavButton: HTMLButtonElement;
let chatNavButton: HTMLButtonElement;
let imageGeneratorView: HTMLDivElement;
let chatView: HTMLDivElement;

// Chat Elements
let chatHistoryEl: HTMLDivElement;
let chatForm: HTMLFormElement;
let chatInput: HTMLTextAreaElement;
let chatSendButton: HTMLButtonElement;

// Preview Elements
let previewContainer: HTMLDivElement;
let imagePreview: HTMLImageElement;
let clearPreviewButton: HTMLButtonElement;


// Profile & Modals
let profileContainer: HTMLDivElement;
let profileButton: HTMLButtonElement;
let dashboardProfilePicture: HTMLImageElement;
let profileDropdown: HTMLDivElement;
let userNameDisplay: HTMLDivElement;
let userEmailDisplay: HTMLDivElement;
let logoutButton: HTMLAnchorElement;
let settingsButton: HTMLAnchorElement;
let myCreationsButton: HTMLAnchorElement;
let errorModal: HTMLDivElement;
let errorMessageContainer: HTMLDivElement;
let modalCloseButton: HTMLButtonElement;
let subscriptionModal: HTMLDivElement;
let subscriptionModalCloseButton: HTMLButtonElement;
let settingsModal: HTMLDivElement;
let settingsModalCloseButton: HTMLButtonElement;
let creationsModal: HTMLDivElement;
let creationsModalCloseButton: HTMLButtonElement;
let creationsGallery: HTMLDivElement;
let creationsPaginationControls: HTMLDivElement;
let creationsPrevPageButton: HTMLButtonElement;
let creationsNextPageButton: HTMLButtonElement;
let creationsPageInfo: HTMLSpanElement;
let shareFallbackModal: HTMLDivElement;
let shareFallbackCloseButton: HTMLButtonElement;

// Creations Gallery Selection
let creationsSelectionToolbar: HTMLDivElement;
let selectionCountEl: HTMLSpanElement;
let editSelectedButton: HTMLButtonElement;
let deleteSelectedButton: HTMLButtonElement;

// Daily Prompts Section
let dailyPromptsContainer: HTMLDivElement;
let dailyPromptsGallery: HTMLDivElement;
let refreshPromptsButton: HTMLButtonElement;

// Settings Modal Elements
let settingsNavLinks: NodeListOf<HTMLButtonElement>;
let settingsPanes: NodeListOf<HTMLDivElement>;
let profileForm: HTMLFormElement;
let passwordForm: HTMLFormElement;
let linksForm: HTMLFormElement;
let generationSettingsForm: HTMLFormElement;
let notificationsForm: HTMLFormElement;
let appearanceForm: HTMLFormElement;
let languageRegionForm: HTMLFormElement;
let creatorProgramForm: HTMLFormElement;
let profilePicturePreview: HTMLImageElement;
let profilePictureInput: HTMLInputElement;
let profileNameInput: HTMLInputElement;
let profileBioInput: HTMLTextAreaElement;
let currentPasswordInput: HTMLInputElement;
let newPasswordInput: HTMLInputElement;
let confirmPasswordInput: HTMLInputElement;
let facebookLinkInput: HTMLInputElement;
let xLinkInput: HTMLInputElement;
let instagramLinkInput: HTMLInputElement;
let settingImageAspectRatioSelect: HTMLSelectElement;
let settingImageFormatSelect: HTMLSelectElement;
let settingWatermarkToggle: HTMLInputElement;
let watermarkSettingContainer: HTMLDivElement;
let settingNotificationsFeatures: HTMLInputElement;
let settingNotificationsExports: HTMLInputElement;
let settingNotificationsCommunity: HTMLInputElement;
let settingDarkModeToggle: HTMLInputElement;
let settingLanguageSelect: HTMLSelectElement;
let settingTimezoneSelect: HTMLSelectElement;
let creatorAppliedMessage: HTMLDivElement;
let creatorNameInput: HTMLInputElement;
let creatorLinkInput: HTMLInputElement;
let creatorReasonInput: HTMLTextAreaElement;

// Privacy & Security Elements
let manageProjectsButton: HTMLButtonElement;
let clearCacheButton: HTMLButtonElement;
let deleteAccountButton: HTMLButtonElement;
let deleteAccountModal: HTMLDivElement;
let deleteConfirmInput: HTMLInputElement;
let cancelDeleteButton: HTMLButtonElement;
let confirmDeleteButton: HTMLButtonElement;

// Large View Modal Elements
let largeViewModal: HTMLDivElement;
let largeViewImage: HTMLImageElement;
let largeViewVideo: HTMLVideoElement;
let largeViewCloseButton: HTMLButtonElement;

// Payment Modal Elements
let pricingPlans: NodeListOf<HTMLDivElement>;
let continuePaymentButton: HTMLButtonElement;
let paymentMessageContainer: HTMLDivElement;
let planSelectionView: HTMLDivElement;
let paymentSelectionView: HTMLDivElement;
let selectedPlanInfo: HTMLParagraphElement;
let backToPlansButton: HTMLButtonElement;
let modalCardsListContainer: HTMLDivElement;
let modalAddCardButton: HTMLButtonElement;
let modalAddCardForm: HTMLFormElement;
let confirmPaymentButton: HTMLButtonElement;
let modalCardNumberInput: HTMLInputElement;
let modalCardHolderInput: HTMLInputElement;
let modalCardExpiryInput: HTMLInputElement;
let modalCardCvvInput: HTMLInputElement;
let modalSetCardDefaultCheckbox: HTMLInputElement;
let modalCancelAddCardButton: HTMLButtonElement;

// Subscription & Payment Settings
let subscriptionStatusContainer: HTMLDivElement;
let paymentMethodsView: HTMLDivElement;
let savedCardsList: HTMLDivElement;
let addNewCardButton: HTMLButtonElement;
let addCardForm: HTMLFormElement;
let cancelAddCardButton: HTMLButtonElement;
let cardNumberInput: HTMLInputElement;
let cardHolderInput: HTMLInputElement;
let cardExpiryInput: HTMLInputElement;
let cardCvvInput: HTMLInputElement;
let setCardDefaultCheckbox: HTMLInputElement;


// --- Function Definitions ---

function cacheDOMElements() {
    mainContent = document.querySelector('main') as HTMLElement;
    splashScreen = document.getElementById('splash-screen') as HTMLElement;

    // Auth
    authContainer = document.querySelector('#auth-container') as HTMLDivElement;
    loginForm = document.querySelector('#login-form') as HTMLFormElement;
    registerForm = document.querySelector('#register-form') as HTMLFormElement;
    forgotPasswordForm = document.querySelector('#forgot-password-form') as HTMLFormElement;
    resetPasswordForm = document.querySelector('#reset-password-form') as HTMLFormElement;
    authToggleLink = document.querySelector('#auth-toggle-link') as HTMLAnchorElement;
    forgotPasswordLink = document.querySelector('#forgot-password-link') as HTMLAnchorElement;
    authTitle = document.querySelector('#auth-title') as HTMLHeadingElement;
    authSubtitle = document.querySelector('#auth-subtitle') as HTMLParagraphElement;
    authToggleText = document.querySelector('#auth-toggle-text') as HTMLSpanElement;
    authErrorEl = document.querySelector('#auth-error') as HTMLDivElement;
    authSuccessEl = document.querySelector('#auth-success') as HTMLDivElement;
    authLegalContainer = document.querySelector('#auth-legal-container') as HTMLDivElement;
    authLegalTabs = document.querySelectorAll<HTMLButtonElement>('.auth-legal-tab');
    authLegalPanes = document.querySelectorAll<HTMLDivElement>('.auth-legal-pane');


    // Main UI
    userStatusEl = document.querySelector('#user-status') as HTMLSpanElement;
    subscribeButton = document.querySelector('#subscribe-button') as HTMLButtonElement;
    resultsContainer = document.querySelector('#results-container') as HTMLDivElement;
    downloadButton = document.querySelector('#download-button') as HTMLButtonElement;
    saveCreationButton = document.querySelector('#save-creation-button') as HTMLButtonElement;
    shareButton = document.querySelector('#share-button') as HTMLButtonElement;
    viewCreationButton = document.querySelector('#view-creation-button') as HTMLButtonElement;
    imageSettings = document.querySelector('#image-settings') as HTMLDivElement;
    imageAspectRatioSelect = document.querySelector('#image-aspect-ratio-select') as HTMLSelectElement;
    imageFormatSelect = document.querySelector('#image-format-select') as HTMLSelectElement;
    resultImage = document.querySelector('#result-image') as HTMLImageElement;
    promptEl = document.querySelector('#prompt-input') as HTMLTextAreaElement;
    generateButton = document.querySelector('#generate-button') as HTMLButtonElement;
    aiAssistButton = document.querySelector('#ai-assist-button') as HTMLButtonElement;
    statusEl = document.querySelector('#status') as HTMLDivElement;
    spinnerContainer = document.querySelector('#spinner-container') as HTMLDivElement;
    examplePromptsSelect = document.querySelector('#example-prompts-select') as HTMLSelectElement;
    upload = document.querySelector('#file-input') as HTMLInputElement;
    fileNameDisplay = document.querySelector('#file-name-display') as HTMLSpanElement;
    fileInputLabel = document.querySelector('#file-input-label') as HTMLLabelElement;

    // Main Navigation
    imageNavButton = document.querySelector('#image-nav-button') as HTMLButtonElement;
    chatNavButton = document.querySelector('#chat-nav-button') as HTMLButtonElement;
    imageGeneratorView = document.querySelector('#image-generator-view') as HTMLDivElement;
    chatView = document.querySelector('#chat-view') as HTMLDivElement;

    // Chat Elements
    chatHistoryEl = document.querySelector('#chat-history') as HTMLDivElement;
    chatForm = document.querySelector('#chat-form') as HTMLFormElement;
    chatInput = document.querySelector('#chat-input') as HTMLTextAreaElement;
    chatSendButton = document.querySelector('#chat-send-button') as HTMLButtonElement;

    // Preview
    previewContainer = document.querySelector('#preview-container') as HTMLDivElement;
    imagePreview = document.querySelector('#image-preview') as HTMLImageElement;
    clearPreviewButton = document.querySelector('#clear-preview-button') as HTMLButtonElement;


    // Profile & Modals
    profileContainer = document.querySelector('#profile-container') as HTMLDivElement;
    profileButton = document.querySelector('#profile-button') as HTMLButtonElement;
    dashboardProfilePicture = document.querySelector('#dashboard-profile-picture') as HTMLImageElement;
    profileDropdown = document.querySelector('#profile-dropdown') as HTMLDivElement;
    userNameDisplay = document.querySelector('#user-name-display') as HTMLDivElement;
    userEmailDisplay = document.querySelector('#user-email-display') as HTMLDivElement;
    logoutButton = document.querySelector('#logout-button') as HTMLAnchorElement;
    settingsButton = document.querySelector('#settings-button') as HTMLAnchorElement;
    myCreationsButton = document.querySelector('#my-creations-button') as HTMLAnchorElement;
    errorModal = document.querySelector('#error-modal') as HTMLDivElement;
    errorMessageContainer = document.querySelector('#error-message-container') as HTMLDivElement;
    modalCloseButton = document.querySelector('#modal-close-button') as HTMLButtonElement;
    subscriptionModal = document.querySelector('#subscription-modal') as HTMLDivElement;
    subscriptionModalCloseButton = document.querySelector('#subscription-modal-close-button') as HTMLButtonElement;
    settingsModal = document.querySelector('#settings-modal') as HTMLDivElement;
    settingsModalCloseButton = document.querySelector('#settings-modal-close-button') as HTMLButtonElement;
    creationsModal = document.querySelector('#creations-modal') as HTMLDivElement;
    creationsModalCloseButton = document.querySelector('#creations-modal-close-button') as HTMLButtonElement;
    creationsGallery = document.querySelector('#creations-gallery') as HTMLDivElement;
    creationsPaginationControls = document.querySelector('#creations-pagination-controls') as HTMLDivElement;
    creationsPrevPageButton = document.querySelector('#creations-prev-page') as HTMLButtonElement;
    creationsNextPageButton = document.querySelector('#creations-next-page') as HTMLButtonElement;
    creationsPageInfo = document.querySelector('#creations-page-info') as HTMLSpanElement;
    shareFallbackModal = document.querySelector('#share-fallback-modal') as HTMLDivElement;
    shareFallbackCloseButton = document.querySelector('#share-fallback-close-button') as HTMLButtonElement;
    creationsSelectionToolbar = document.querySelector('#creations-selection-toolbar') as HTMLDivElement;
    selectionCountEl = document.querySelector('#selection-count') as HTMLSpanElement;
    editSelectedButton = document.querySelector('#edit-selected-button') as HTMLButtonElement;
    deleteSelectedButton = document.querySelector('#delete-selected-button') as HTMLButtonElement;

    // Daily Prompts Section
    dailyPromptsContainer = document.querySelector('#daily-prompts-container') as HTMLDivElement;
    dailyPromptsGallery = document.querySelector('#daily-prompts-gallery') as HTMLDivElement;
    refreshPromptsButton = document.querySelector('#refresh-prompts-button') as HTMLButtonElement;

    // Settings Modal
    settingsNavLinks = document.querySelectorAll<HTMLButtonElement>('.settings-nav-link');
    settingsPanes = document.querySelectorAll<HTMLDivElement>('.settings-pane');
    profileForm = document.querySelector('#profile-form') as HTMLFormElement;
    passwordForm = document.querySelector('#password-form') as HTMLFormElement;
    linksForm = document.querySelector('#links-form') as HTMLFormElement;
    generationSettingsForm = document.querySelector('#generation-settings-form') as HTMLFormElement;
    notificationsForm = document.querySelector('#notifications-form') as HTMLFormElement;
    appearanceForm = document.querySelector('#appearance-form') as HTMLFormElement;
    languageRegionForm = document.querySelector('#language-region-form') as HTMLFormElement;
    creatorProgramForm = document.querySelector('#creator-program-form') as HTMLFormElement;
    profilePicturePreview = document.querySelector('#profile-picture-preview') as HTMLImageElement;
    profilePictureInput = document.querySelector('#profile-picture-input') as HTMLInputElement;
    profileNameInput = document.querySelector('#profile-name-input') as HTMLInputElement;
    profileBioInput = document.querySelector('#profile-bio-input') as HTMLTextAreaElement;
    currentPasswordInput = document.querySelector('#current-password-input') as HTMLInputElement;
    newPasswordInput = document.querySelector('#new-password-input') as HTMLInputElement;
    confirmPasswordInput = document.querySelector('#confirm-password-input') as HTMLInputElement;
    facebookLinkInput = document.querySelector('#facebook-link-input') as HTMLInputElement;
    xLinkInput = document.querySelector('#x-link-input') as HTMLInputElement;
    instagramLinkInput = document.querySelector('#instagram-link-input') as HTMLInputElement;
    settingImageAspectRatioSelect = document.querySelector('#setting-image-aspect-ratio') as HTMLSelectElement;
    settingImageFormatSelect = document.querySelector('#setting-image-format') as HTMLSelectElement;
    settingWatermarkToggle = document.querySelector('#setting-watermark-toggle') as HTMLInputElement;
    watermarkSettingContainer = document.querySelector('#watermark-setting-container') as HTMLDivElement;
    settingNotificationsFeatures = document.querySelector('#setting-notifications-features') as HTMLInputElement;
    settingNotificationsExports = document.querySelector('#setting-notifications-exports') as HTMLInputElement;
    settingNotificationsCommunity = document.querySelector('#setting-notifications-community') as HTMLInputElement;
    settingDarkModeToggle = document.querySelector('#setting-dark-mode-toggle') as HTMLInputElement;
    settingLanguageSelect = document.querySelector('#setting-language-select') as HTMLSelectElement;
    settingTimezoneSelect = document.querySelector('#setting-timezone-select') as HTMLSelectElement;
    creatorAppliedMessage = document.querySelector('#creator-applied-message') as HTMLDivElement;
    creatorNameInput = document.querySelector('#creator-name-input') as HTMLInputElement;
    creatorLinkInput = document.querySelector('#creator-link-input') as HTMLInputElement;
    creatorReasonInput = document.querySelector('#creator-reason-input') as HTMLTextAreaElement;


    // Privacy & Security
    manageProjectsButton = document.querySelector('#manage-projects-button') as HTMLButtonElement;
    clearCacheButton = document.querySelector('#clear-cache-button') as HTMLButtonElement;
    deleteAccountButton = document.querySelector('#delete-account-button') as HTMLButtonElement;
    deleteAccountModal = document.querySelector('#delete-account-modal') as HTMLDivElement;
    deleteConfirmInput = document.querySelector('#delete-confirm-input') as HTMLInputElement;
    cancelDeleteButton = document.querySelector('#cancel-delete-button') as HTMLButtonElement;
    confirmDeleteButton = document.querySelector('#confirm-delete-button') as HTMLButtonElement;

    // Large View Modal
    largeViewModal = document.querySelector('#large-view-modal') as HTMLDivElement;
    largeViewImage = document.querySelector('#large-view-image') as HTMLImageElement;
    largeViewVideo = document.querySelector('#large-view-video') as HTMLVideoElement;
    largeViewCloseButton = document.querySelector('#large-view-close-button') as HTMLButtonElement;
    
    // Payment
    pricingPlans = document.querySelectorAll<HTMLDivElement>('.pricing-plan');
    continuePaymentButton = document.querySelector('#continue-payment-button') as HTMLButtonElement;
    paymentMessageContainer = document.querySelector('#payment-message-container') as HTMLDivElement;
    planSelectionView = document.querySelector('#plan-selection-view') as HTMLDivElement;
    paymentSelectionView = document.querySelector('#payment-selection-view') as HTMLDivElement;
    selectedPlanInfo = document.querySelector('#selected-plan-info') as HTMLParagraphElement;
    backToPlansButton = document.querySelector('#back-to-plans-button') as HTMLButtonElement;
    modalCardsListContainer = document.querySelector('#modal-cards-list-container') as HTMLDivElement;
    modalAddCardButton = document.querySelector('#modal-add-card-button') as HTMLButtonElement;
    modalAddCardForm = document.querySelector('#modal-add-card-form') as HTMLFormElement;
    confirmPaymentButton = document.querySelector('#confirm-payment-button') as HTMLButtonElement;
    modalCardNumberInput = document.querySelector('#modal-card-number-input') as HTMLInputElement;
    modalCardHolderInput = document.querySelector('#modal-card-holder-input') as HTMLInputElement;
    modalCardExpiryInput = document.querySelector('#modal-card-expiry-input') as HTMLInputElement;
    modalCardCvvInput = document.querySelector('#modal-card-cvv-input') as HTMLInputElement;
    modalSetCardDefaultCheckbox = document.querySelector('#modal-set-card-default-checkbox') as HTMLInputElement;
    modalCancelAddCardButton = document.querySelector('#modal-cancel-add-card-button') as HTMLButtonElement;

    // Subscription & Payment Settings
    subscriptionStatusContainer = document.querySelector('#subscription-status-container') as HTMLDivElement;
    paymentMethodsView = document.querySelector('#payment-methods-view') as HTMLDivElement;
    savedCardsList = document.querySelector('#saved-cards-list') as HTMLDivElement;
    addNewCardButton = document.querySelector('#add-new-card-button') as HTMLButtonElement;
    addCardForm = document.querySelector('#add-card-form') as HTMLFormElement;
    cancelAddCardButton = document.querySelector('#cancel-add-card-button') as HTMLButtonElement;
    cardNumberInput = document.querySelector('#card-number-input') as HTMLInputElement;
    cardHolderInput = document.querySelector('#card-holder-input') as HTMLInputElement;
    cardExpiryInput = document.querySelector('#card-expiry-input') as HTMLInputElement;
    cardCvvInput = document.querySelector('#card-cvv-input') as HTMLInputElement;
    setCardDefaultCheckbox = document.querySelector('#set-card-default-checkbox') as HTMLInputElement;
}

function showErrorModal(messages: string[], title: string = 'An Error Occurred') {
    if (!errorModal || !errorMessageContainer) return;
    
    const errorTitleEl = errorModal.querySelector('h2');
    if (errorTitleEl) {
        errorTitleEl.textContent = title;
    }

    errorMessageContainer.innerHTML = ''; // Clear previous messages
    messages.forEach(msg => {
        const p = document.createElement('p');
        p.textContent = msg;
        errorMessageContainer.appendChild(p);
    });
    
    errorModal.style.display = 'flex';
}

function showSettingsToast(message: string) {
    const toast = document.createElement('div');
    toast.className = 'settings-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('visible');
    }, 10);

    // Animate out and remove
    setTimeout(() => {
        toast.classList.remove('visible');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}

function setControlsDisabled(disabled: boolean) {
    if (generateButton) generateButton.disabled = disabled;
    if (aiAssistButton) aiAssistButton.disabled = disabled;
    if (promptEl) promptEl.disabled = disabled;
    if (upload) upload.disabled = disabled;
    if (imageAspectRatioSelect) imageAspectRatioSelect.disabled = disabled;
    if (imageFormatSelect) imageFormatSelect.disabled = disabled;
}

function populateDailyPrompts() {
    if (!dailyPromptsGallery) return;
    dailyPromptsGallery.innerHTML = '';
    
    // Get a random subset of prompts
    const shuffled = [...ALL_PROMPTS].sort(() => 0.5 - Math.random());
    const promptsToShow = shuffled.slice(0, DAILY_PROMPTS_COUNT);
    
    promptsToShow.forEach(promptText => {
        const promptCard = document.createElement('div');
        promptCard.className = 'prompt-card';
        promptCard.textContent = promptText;
        promptCard.addEventListener('click', () => {
            if (promptEl) {
                promptEl.value = promptText;
                promptEl.dispatchEvent(new Event('input', { bubbles: true }));
                promptEl.focus();
            }
        });
        dailyPromptsGallery.appendChild(promptCard);
    });
}

function renderSubscriptionStatus() {
    if (!subscriptionStatusContainer) return;
    if (userState.isPremium) {
        subscriptionStatusContainer.innerHTML = `
            <p><strong>Current Plan:</strong> Premium (${userState.subscription.plan})</p>
            <p><strong>Next Billing Date:</strong> ${userState.subscription.nextBilling}</p>
            <button class="button button-danger">Cancel Subscription</button>
        `;
        // Add event listener for cancellation if needed
    } else {
        subscriptionStatusContainer.innerHTML = `
            <p>You are on the <strong>Free Plan</strong>.</p>
            <p>Upgrade to Premium for unlimited downloads, no watermarks, and higher quality exports.</p>
            <button class="button button-primary" id="settings-upgrade-button">Upgrade to Premium</button>
        `;
        const upgradeButton = document.getElementById('settings-upgrade-button');
        if (upgradeButton) {
            upgradeButton.addEventListener('click', () => {
                if (settingsModal) settingsModal.style.display = 'none';
                if (subscriptionModal) subscriptionModal.style.display = 'flex';
            });
        }
    }
}

function renderSavedCards() {
    if (!savedCardsList || !currentUser) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const cards = users[currentUser]?.paymentMethods || [];
    
    savedCardsList.innerHTML = '';
    
    if (cards.length === 0) {
        savedCardsList.innerHTML = '<p>No payment methods saved.</p>';
        return;
    }
    
    cards.forEach(card => {
        let logoUrl = '';
        const cardTypeLower = card.type.toLowerCase();
        if (cardTypeLower === 'visa') {
            logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg';
        } else if (cardTypeLower === 'mastercard') {
            logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg';
        }
        
        const cardEl = document.createElement('div');
        cardEl.className = 'saved-card-item';
        cardEl.innerHTML = `
            <img src="${logoUrl}" class="card-icon" alt="${card.type}">
            <div class="card-info">
                <span>${card.type} ending in ${card.maskedNumber}</span>
                <small>Holder: ${card.holderName}</small>
            </div>
            <div class="card-actions">
                ${!card.isDefault ? '<button class="button-text set-default-btn" data-id="'+card.id+'">Set as default</button>' : '<span class="default-badge">Default</span>'}
                <button class="button-text-danger remove-card-btn" data-id="${card.id}">Remove</button>
            </div>
        `;
        savedCardsList.appendChild(cardEl);
    });
}

function toggleAddCardView(showForm: boolean) {
    if (addCardForm && addNewCardButton) {
        addCardForm.style.display = showForm ? 'block' : 'none';
        addNewCardButton.style.display = showForm ? 'none' : 'block';
        if (showForm) {
            (addCardForm as HTMLFormElement).reset();
        }
    }
}


// --- Authentication ---
function checkAuthStatus() {
    const user = sessionStorage.getItem('currentUser');
    const name = sessionStorage.getItem('currentUserName');
    
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    if (message === 'account_deleted' && authSuccessEl) {
        authSuccessEl.textContent = 'Your account has been successfully deleted.';
        authSuccessEl.style.display = 'block';
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (user) {
        currentUser = user;
        currentUserName = name;
        showMainApp();
    } else {
        // Before showing auth, apply any saved global theme
        const savedTheme = localStorage.getItem('global_theme') || 'light';
        document.body.dataset.theme = savedTheme;
        showAuthScreen();
    }
}

function showAuthScreen() {
    if (authContainer) authContainer.style.display = 'flex';
    if (mainContent) mainContent.style.display = 'none';
    switchAuthView('login');
}

function showMainApp() {
    if (authContainer) authContainer.style.display = 'none';
    if (mainContent) {
        mainContent.style.display = 'block';
        mainContent.classList.add('visible');
    }
    initializeUserState(); // This will load profile, settings (including theme), and user state
    loadUserProfile();
    populateDailyPrompts();
    if (dailyPromptsContainer) dailyPromptsContainer.style.display = 'block';
}

function switchAuthView(view: 'login' | 'register' | 'forgot' | 'reset') {
    // Hide all forms and legal container first
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'none';
    if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
    if (resetPasswordForm) resetPasswordForm.style.display = 'none';
    if (authLegalContainer) authLegalContainer.style.display = 'none';

    // Clear messages unless coming from a redirect
     const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('message')) {
        if (authSuccessEl) {
            authSuccessEl.textContent = '';
            authSuccessEl.style.display = 'none';
        }
    }
    if (authErrorEl) authErrorEl.textContent = '';


    switch(view) {
        case 'login':
            if (loginForm) loginForm.style.display = 'block';
            if (authTitle) authTitle.textContent = 'Login';
            if (authSubtitle) authSubtitle.textContent = 'Welcome back! Please enter your details.';
            if (authToggleText) authToggleText.textContent = "Don't have an account?";
            if (authToggleLink) {
                authToggleLink.textContent = 'Register';
                authToggleLink.dataset.mode = 'register';
            }
            if (authToggleText?.parentElement) authToggleText.parentElement.style.display = 'block';
            break;
        case 'register':
            if (registerForm) registerForm.style.display = 'block';
            if (authLegalContainer) authLegalContainer.style.display = 'block';
            if (authTitle) authTitle.textContent = 'Create Account';
            if (authSubtitle) authSubtitle.textContent = 'Get started with your free account.';
            if (authToggleText) authToggleText.textContent = 'Already have an account?';
            if (authToggleLink) {
                authToggleLink.textContent = 'Login';
                authToggleLink.dataset.mode = 'login';
            }
            if (authToggleText?.parentElement) authToggleText.parentElement.style.display = 'block';
            break;
        case 'forgot':
            if (forgotPasswordForm) forgotPasswordForm.style.display = 'block';
            if (authTitle) authTitle.textContent = 'Reset Password';
            if (authSubtitle) authSubtitle.textContent = 'Enter your email to receive a reset link.';
            if (authToggleText) authToggleText.textContent = '';
            if (authToggleLink) {
                authToggleLink.textContent = 'Back to Login';
                authToggleLink.dataset.mode = 'login';
            }
            if (authToggleText?.parentElement) authToggleText.parentElement.style.display = 'block';
            break;
        case 'reset':
            if (resetPasswordForm) resetPasswordForm.style.display = 'block';
            if (authTitle) authTitle.textContent = 'Create New Password';
            if (authSubtitle) authSubtitle.textContent = 'Your new password must be at least 6 characters.';
            if (authToggleText?.parentElement) authToggleText.parentElement.style.display = 'none'; // No easy way back from here
            break;
    }
}

function handleLogin(e: Event) {
    e.preventDefault();
    const email = (document.getElementById('login-email') as HTMLInputElement).value;
    const password = (document.getElementById('login-password') as HTMLInputElement).value;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[email] && users[email].password === password) {
        const name = users[email].name || 'User';
        sessionStorage.setItem('currentUser', email);
        sessionStorage.setItem('currentUserName', name);
        currentUser = email;
        currentUserName = name;
        showMainApp();
    } else {
        if (authErrorEl) authErrorEl.textContent = 'Invalid email or password.';
    }
}

function handleRegister(e: Event) {
    e.preventDefault();
    const name = (document.getElementById('register-name') as HTMLInputElement).value;
    const email = (document.getElementById('register-email') as HTMLInputElement).value;
    const password = (document.getElementById('register-password') as HTMLInputElement).value;
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[email]) {
        if (authErrorEl) authErrorEl.textContent = 'An account with this email already exists.';
        return;
    }
    if (password.length < 6) {
        if (authErrorEl) authErrorEl.textContent = 'Password must be at least 6 characters long.';
        return;
    }

    users[email] = {
        password,
        name,
        profile: {
            bio: '',
            avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2EwYTBiMiIgd2lkdGg9IjgwcHgiIGhlaWdodD0iODBweCI+PHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPjwvc3ZnPg==',
            links: { facebook: '', x: '', instagram: '' }
        },
        paymentMethods: []
    };
    localStorage.setItem('users', JSON.stringify(users));
    
    // Automatically log in after registration
    sessionStorage.setItem('currentUser', email);
    sessionStorage.setItem('currentUserName', name);
    currentUser = email;
    currentUserName = name;
    showMainApp();
}

function handleLogout() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUserName');
    currentUser = null;
    currentUserName = null;
    window.location.search = '';
    showAuthScreen();
}

async function handleForgotPasswordRequest(e: Event) {
    e.preventDefault();
    const email = (document.getElementById('forgot-email') as HTMLInputElement).value;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    // Always show a generic message to prevent email enumeration
    if (authSuccessEl) {
        authSuccessEl.textContent = 'If an account with that email exists, a password reset link has been sent.';
        authSuccessEl.style.display = 'block';
    }
    if (authErrorEl) authErrorEl.textContent = '';
    (e.target as HTMLFormElement).reset();
    
    if (users[email]) {
        const token = Date.now().toString(36) + Math.random().toString(36).substring(2);
        const expiry = Date.now() + TOKEN_EXPIRY_MS;
        const resetData = { token, expiry };
        localStorage.setItem(`reset_${email}`, JSON.stringify(resetData));
        emailToReset = email;

        // Simulate clicking the link in the email
        setTimeout(() => {
            if (authSuccessEl) {
                authSuccessEl.textContent = '';
                authSuccessEl.style.display = 'none';
            }
            switchAuthView('reset');
        }, 2000); // Wait 2 seconds before showing the reset form
    }
}

async function handlePasswordReset(e: Event) {
    e.preventDefault();
    if (!emailToReset) {
        if (authErrorEl) authErrorEl.textContent = 'Password reset session expired. Please try again.';
        switchAuthView('forgot');
        return;
    }

    const newPassword = (document.getElementById('reset-new-password') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('reset-confirm-password') as HTMLInputElement).value;
    
    if (newPassword.length < 6) {
        if (authErrorEl) authErrorEl.textContent = 'Password must be at least 6 characters long.';
        return;
    }
    if (newPassword !== confirmPassword) {
        if (authErrorEl) authErrorEl.textContent = 'Passwords do not match.';
        return;
    }

    const resetDataStr = localStorage.getItem(`reset_${emailToReset}`);
    if (!resetDataStr) {
        if (authErrorEl) authErrorEl.textContent = 'Invalid or expired reset link. Please request a new one.';
        return;
    }

    const resetData = JSON.parse(resetDataStr);
    if (Date.now() > resetData.expiry) {
        localStorage.removeItem(`reset_${emailToReset}`);
        if (authErrorEl) authErrorEl.textContent = 'Reset link has expired. Please request a new one.';
        return;
    }
    
    // All checks passed, update password
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[emailToReset].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    // Cleanup
    localStorage.removeItem(`reset_${emailToReset}`);
    emailToReset = null;

    // Show success and switch to login
    switchAuthView('login');
    if (authSuccessEl) {
        authSuccessEl.textContent = 'Password has been reset successfully. Please log in.';
        authSuccessEl.style.display = 'block';
    }
}

function setupAuthLegalTabs() {
    authLegalTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;

            // Deactivate all tabs and panes
            authLegalTabs.forEach(t => t.classList.remove('active'));
            authLegalPanes.forEach(p => p.classList.remove('active'));

            // Activate clicked tab and corresponding pane
            tab.classList.add('active');
            const correspondingPane = document.querySelector(`.auth-legal-pane[data-tab-content="${tabId}"]`);
            if (correspondingPane) {
                correspondingPane.classList.add('active');
            }
        });
    });
}

// --- User State & UI ---
function loadUserProfile() {
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentUser];
    if (user) {
        currentUserName = user.name || 'User';
        if (userNameDisplay) userNameDisplay.textContent = currentUserName;
        if (userEmailDisplay) userEmailDisplay.textContent = currentUser;
        if (dashboardProfilePicture) dashboardProfilePicture.src = user.profile?.avatar || '';
    }
}

function initializeUserState() {
  if (!currentUser) return;
  const today = new Date().toISOString().split('T')[0];
  const userData = JSON.parse(localStorage.getItem(`user_${currentUser}`) || '{}');

  userState.isPremium = userData.isPremium || false;
  userState.lastDownloadDate = userData.lastDownloadDate || '';
  userState.lastShareDate = userData.lastShareDate || '';
  userState.subscription = userData.subscription || { plan: '', nextBilling: '' };

  if (userState.lastDownloadDate !== today) {
    userState.downloadsToday = 0;
    userState.lastDownloadDate = today;
  } else {
    userState.downloadsToday = userData.downloadsToday || 0;
  }
  
  if (userState.lastShareDate !== today) {
      userState.sharesToday = 0;
      userState.lastShareDate = today;
  } else {
      userState.sharesToday = userData.sharesToday || 0;
  }
  
  saveUserState();
  updateUserStatusUI();
  
  loadUserSettings();
  applyTheme();
  applyUserSettingsToDashboard();
}

function saveUserState() {
    if (!currentUser) return;
    const userData = {
        isPremium: userState.isPremium,
        downloadsToday: userState.downloadsToday,
        lastDownloadDate: userState.lastDownloadDate,
        sharesToday: userState.sharesToday,
        lastShareDate: userState.lastShareDate,
        subscription: userState.subscription,
    };
    localStorage.setItem(`user_${currentUser}`, JSON.stringify(userData));
}

function loadUserSettings() {
    if (!currentUser) return;
    const savedSettings = JSON.parse(localStorage.getItem(`settings_${currentUser}`) || '{}');
    userSettings = {
        imageAspectRatio: savedSettings.imageAspectRatio || '1:1',
        imageFormat: savedSettings.imageFormat || 'image/jpeg',
        watermark: savedSettings.watermark !== undefined ? savedSettings.watermark : !userState.isPremium,
        notifications: savedSettings.notifications || {
            featureUpdates: true,
            exportAlerts: true,
            communityNews: true,
        },
        theme: savedSettings.theme || 'light',
        language: savedSettings.language || 'en-US',
        timezone: savedSettings.timezone || 'Africa/Johannesburg',
    };
}

function saveUserSettings() {
    if (!currentUser) return;
    localStorage.setItem(`settings_${currentUser}`, JSON.stringify(userSettings));
    // Also save theme globally for the login screen
    localStorage.setItem('global_theme', userSettings.theme);
}

function applyTheme() {
    document.body.dataset.theme = userSettings.theme;
}


function applyUserSettingsToDashboard() {
    if (imageAspectRatioSelect) imageAspectRatioSelect.value = userSettings.imageAspectRatio;
    if (imageFormatSelect) imageFormatSelect.value = userSettings.imageFormat;
}


function updateUserStatusUI() {
  if (userState.isPremium) {
    if (userStatusEl) {
        userStatusEl.innerHTML = `<span class="premium-badge">Premium</span> Unlimited Access`;
    }
    if (subscribeButton) subscribeButton.style.display = 'none';
  } else {
    const remainingDownloads = MAX_FREE_DOWNLOADS - userState.downloadsToday;
    const remainingShares = MAX_SHARE_CREDITS - userState.sharesToday;
    
    let statusHTML = `<div class="status-line"><span class="free-badge">Free</span> <span>Downloads: <strong>${remainingDownloads}/${MAX_FREE_DOWNLOADS}</strong></span>`;
    
    if (remainingShares > 0) {
      statusHTML += ` <span class="status-separator">|</span> <span>Shares: <strong>${remainingShares}/${MAX_SHARE_CREDITS}</strong></span>`;
    }
    statusHTML += `</div>`;

    if (remainingDownloads <= 0) {
      let cta = 'Out of downloads? ';
      if (remainingShares > 0) {
          cta += `Share to earn more or `;
      }
      cta += `<strong class="upgrade-cta">upgrade to Premium</strong> for unlimited access.`;
      statusHTML += `<small class="status-cta">${cta}</small>`;
    }
    
    if (userStatusEl) userStatusEl.innerHTML = statusHTML;
    if (subscribeButton) subscribeButton.style.display = 'block';
  }
}

// --- Payment ---
function handlePlanSelection(selectedPlanElement: HTMLDivElement) {
    pricingPlans.forEach(plan => plan.classList.remove('selected'));
    selectedPlanElement.classList.add('selected');
    selectedPremiumPlan = selectedPlanElement.dataset.plan as 'monthly' | 'yearly';
}

function showPaymentMessage(message: string, type: 'success' | 'error') {
  if (!paymentMessageContainer) return;
  paymentMessageContainer.textContent = message;
  paymentMessageContainer.className = `payment-message-${type}`;
}

function showPaymentSelectionView() {
    if (!selectedPremiumPlan) {
        showPaymentMessage('Please select a plan.', 'error');
        return;
    }
    if(paymentMessageContainer) paymentMessageContainer.innerHTML = '';
    planSelectionView.style.display = 'none';
    paymentSelectionView.style.display = 'block';
    
    const planName = selectedPremiumPlan.charAt(0).toUpperCase() + selectedPremiumPlan.slice(1);
    const planPrice = selectedPremiumPlan === 'monthly' ? '$9.99' : '$99.99';
    const planDuration = selectedPremiumPlan === 'monthly' ? '/ month' : '/ year';

    selectedPlanInfo.textContent = `Selected Plan: ${planName} (${planPrice}${planDuration})`;
    if (confirmPaymentButton) confirmPaymentButton.textContent = `Pay ${planPrice}`;
    
    populateModalCardsList();
}

function populateModalCardsList() {
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const cards = users[currentUser]?.paymentMethods || [];

    if (cards.length > 0) {
        modalCardsListContainer.innerHTML = '';
        cards.forEach((card, index) => {
             let logoUrl = '';
            const cardTypeLower = card.type.toLowerCase();
            if (cardTypeLower === 'visa') {
                logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg';
            } else if (cardTypeLower === 'mastercard') {
                logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg';
            }
            const isDefault = card.isDefault || index === 0;

            const cardLabel = document.createElement('label');
            cardLabel.className = 'modal-card-option';
            cardLabel.innerHTML = `
                <input type="radio" name="payment-method" value="${card.id}" ${isDefault ? 'checked' : ''}>
                <img src="${logoUrl}" class="card-icon" alt="${card.type}">
                <div class="card-info">
                    <div class="card-info-main">
                      <span>${card.type} ending in ${card.maskedNumber}</span>
                    </div>
                </div>
            `;
            modalCardsListContainer.appendChild(cardLabel);
        });

        modalCardsListContainer.style.display = 'flex';
        modalAddCardButton.style.display = 'block';
        modalAddCardForm.style.display = 'none';
    } else {
        // No cards saved, show the add card form directly
        modalCardsListContainer.style.display = 'none';
        modalAddCardButton.style.display = 'none';
        modalAddCardForm.style.display = 'block';
    }
}


async function handleConfirmPayment() {
  if (paymentMessageContainer) paymentMessageContainer.innerHTML = '';
  
  const selectedCard = modalCardsListContainer.querySelector('input[name="payment-method"]:checked');
  if (!selectedCard && modalAddCardForm.style.display === 'none') {
      showPaymentMessage('Please select a payment method.', 'error');
      return;
  }
  
  showPaymentMessage('Processing payment...', 'success');
  if (confirmPaymentButton) {
      confirmPaymentButton.disabled = true;
      confirmPaymentButton.classList.add('processing');
  }
  
  // Simulate API call
  setTimeout(() => {
    showPaymentMessage('Payment successful! Welcome to Premium.', 'success');
    
    setTimeout(() => {
      userState.isPremium = true;
      userState.subscription.plan = selectedPremiumPlan!;
      const nextBillingDate = new Date();
      if (selectedPremiumPlan === 'monthly') {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      } else {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      }
      userState.subscription.nextBilling = nextBillingDate.toLocaleDateString();

      saveUserState();
      updateUserStatusUI();
      if (subscriptionModal) {
        subscriptionModal.style.display = 'none';
        // Reset modal state
        planSelectionView.style.display = 'block';
        paymentSelectionView.style.display = 'none';
      }
      if (confirmPaymentButton) {
          confirmPaymentButton.disabled = false;
          confirmPaymentButton.classList.remove('processing');
      }
      if (paymentMessageContainer) paymentMessageContainer.innerHTML = '';
      
      // Reset plan selection
      pricingPlans.forEach(plan => plan.classList.remove('selected'));
      selectedPremiumPlan = null;

    }, 2000);
  }, 1500);
}

function handleSaveCardInModal(e: Event) {
    e.preventDefault();
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[currentUser]) return;

    const cardNumber = modalCardNumberInput.value.replace(/\s/g, '');
    const shouldSave = modalSetCardDefaultCheckbox.checked;

    if (shouldSave) {
        const newCard = {
            id: Date.now(),
            type: cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
            maskedNumber: cardNumber.slice(-4),
            holderName: modalCardHolderInput.value,
            isDefault: false, // Don't make default from this flow to avoid confusion
        };

        let cards = users[currentUser].paymentMethods || [];
        cards.push(newCard);
        users[currentUser].paymentMethods = cards;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // After saving (or not), refresh the list view
    populateModalCardsList();
}


// --- Generation ---
function clearPreview() {
    if (previewContainer) previewContainer.style.display = 'none';
    if (imagePreview) {
        imagePreview.src = '';
        imagePreview.style.display = 'none';
    }
    if (upload) upload.value = ''; // Reset file input
    if (fileNameDisplay) fileNameDisplay.textContent = 'No file chosen';

    base64data = '';
    mimeType = '';

    if (statusEl) statusEl.textContent = 'Ready.';
    
    // Re-evaluate generate button state
    if (generateButton) {
        generateButton.disabled = currentPromptText.trim() === '';
    }
}

async function handleFileUpload(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) {
      clearPreview();
      return;
    }
    
    if (fileNameDisplay) fileNameDisplay.textContent = file.name;
  
    const isImage = file.type.startsWith('image/');

    if (isImage) {
      if (previewContainer) previewContainer.style.display = 'block';
      base64data = await blobToBase64(file);
      mimeType = file.type;
      
      if (imagePreview) {
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.style.display = 'block';
      }
      
      if (statusEl) statusEl.textContent = `Image loaded for editing.`;
      if (generateButton) generateButton.disabled = currentPromptText.trim() === '';
    } else {
      clearPreview();
      if (statusEl) statusEl.textContent = 'Unsupported file. Please upload an image.';
      showErrorModal(['Only image files are supported.'], 'Unsupported File Type');
    }
}

function blobToBase64(blob: Blob) {
  return new Promise<string>(async (resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      resolve(url.split(',')[1]);
    };
    reader.readAsDataURL(blob);
  });
}

function applyWatermark(imageUrl: string): Promise<string> {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(imageUrl); // Return original if canvas fails
                return;
            }
            
            ctx.drawImage(img, 0, 0);

            // Style the watermark
            ctx.font = `${Math.max(12, Math.min(img.width / 20, 48))}px "Google Sans", sans-serif`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            
            // Add watermark
            ctx.fillText('Se-Mo Generation', canvas.width - 15, canvas.height - 15);

            resolve(canvas.toDataURL(userSettings.imageFormat as 'image/png' | 'image/jpeg'));
        };
        img.onerror = () => {
            resolve(imageUrl); // Return original on error
        };
        img.src = imageUrl;
    });
}

async function generateImageContent() {
    const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
    const aspectRatio = userSettings.imageAspectRatio;
    let imageUrl: string;

    if (base64data && mimeType) { // Image editing
        if (statusEl) statusEl.innerText = 'Applying your edits...';
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [ { inlineData: { data: base64data, mimeType: mimeType } }, { text: currentPromptText } ] },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
        });
        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (!imagePart?.inlineData) throw new Error('Model did not return an image.');
        imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        if (statusEl) statusEl.innerText = 'Image edited successfully!';
    } else { // Text-to-image
        if (statusEl) statusEl.innerText = 'Generating your image...';
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: currentPromptText,
            config: { 
                numberOfImages: 1, 
                outputMimeType: userSettings.imageFormat as 'image/jpeg' | 'image/png', 
                aspectRatio: aspectRatio as '1:1' | '3:4' | '4:3' | '9:16' | '16:9'
            },
        });
        if (!response.generatedImages?.length) throw new Error('No images were generated.');
        const mime = userSettings.imageFormat;
        imageUrl = `data:${mime};base64,${response.generatedImages[0].image.imageBytes}`;
        if (statusEl) statusEl.innerText = 'Image generated successfully!';
    }
    
    if (!userState.isPremium && userSettings.watermark) {
        imageUrl = await applyWatermark(imageUrl);
    }

    if (resultImage) {
        resultImage.src = imageUrl;
        resultImage.style.display = 'block';
    }
    if (resultsContainer) resultsContainer.style.display = 'block';
    if (saveCreationButton) saveCreationButton.disabled = false;
    if (shareButton) shareButton.disabled = false;
    if (viewCreationButton) viewCreationButton.disabled = false;
    currentCreation = { data: imageUrl, type: 'image' };
}

async function generate() {
  if (currentPromptText.trim() === '') {
    showErrorModal(['Please enter a prompt.']); return;
  }
  const explicitWords = ['explicit', 'forbidden', 'banned', 'inappropriate'];
  if (explicitWords.some(word => currentPromptText.toLowerCase().includes(word))) {
    if (statusEl) statusEl.innerText = 'Image creation out of line.'; return;
  }

  if (spinnerContainer) spinnerContainer.style.display = 'flex';
  if (statusEl) statusEl.innerText = '';
  if (resultsContainer) resultsContainer.style.display = 'none';
  if (resultImage) resultImage.src = '';
  if (saveCreationButton) saveCreationButton.disabled = true;
  if (shareButton) shareButton.disabled = true;
  if (viewCreationButton) viewCreationButton.disabled = true;

  setControlsDisabled(true);

  try {
    await generateImageContent();
  } catch (e) {
    console.error(`Image generation failed:`, e);
    
    let rawErrorMessage = 'An unknown error occurred.';
    if (e instanceof Error) {
        rawErrorMessage = e.message;
    } else if (typeof e === 'string') {
        rawErrorMessage = e;
    } else if (typeof e === 'object' && e !== null) {
        rawErrorMessage = JSON.stringify(e);
    }

    if (rawErrorMessage.toLowerCase().includes('quota exceeded') || rawErrorMessage.toLowerCase().includes('resource_exhausted')) {
        showErrorModal(
            [
                'The API key has reached its usage limit. Please check your Google AI Studio account for details on your quota.',
            ],
            'API Quota Exceeded'
        );
    } else {
        let displayMessage = rawErrorMessage;
        try {
            const parsed = JSON.parse(rawErrorMessage);
            if (parsed.error && parsed.error.message) {
                displayMessage = parsed.error.message;
            }
        } catch (parseError) {
            // Not a JSON string, use the raw message which is fine.
        }
        showErrorModal([displayMessage], `Image Generation Failed`);
    }
    
    if (statusEl) statusEl.innerText = `Error generating image.`;
  } finally {
    if (spinnerContainer) spinnerContainer.style.display = 'none';
    setControlsDisabled(false);
  }
}

async function handleAiAssist() {
    if (!promptEl || promptEl.value.trim() === '') return;

    aiAssistButton.classList.add('loading');
    setControlsDisabled(true);

    try {
        const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
        const userPrompt = promptEl.value;
        
        const enhancementPrompt = `You are a creative assistant and expert prompt engineer for generative AI models. Your task is to take a user's simple prompt and enhance it to be more vivid, descriptive, and detailed, leading to a higher quality and more artistic generation. Add details about style (e.g., hyperrealistic, cinematic, oil painting), lighting (e.g., soft morning light, dramatic chiaroscuro), composition (e.g., wide-angle shot, rule of thirds), and mood. Only return the enhanced prompt, without any conversational text, labels, or explanation.

User's prompt: "${userPrompt}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: enhancementPrompt,
        });
        
        const enhancedText = response.text.trim().replace(/^"|"$/g, ''); // Remove quotes if model adds them

        if (enhancedText) {
            promptEl.value = enhancedText;
            promptEl.dispatchEvent(new Event('input', { bubbles: true }));
            showSettingsToast('Prompt enhanced with AI!');
        } else {
            throw new Error('AI did not return an enhanced prompt.');
        }

    } catch (e) {
        console.error('AI Assist failed:', e);
        showErrorModal([(e as Error).message], 'AI Assist Failed');
    } finally {
        aiAssistButton.classList.remove('loading');
        setControlsDisabled(false);
    }
}


// --- Settings Modal Logic ---
function setupSettingsNavigation() {
    settingsNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            const paneId = link.dataset.pane;
            
            // Update nav links
            settingsNavLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Update panes
            settingsPanes.forEach(pane => {
                pane.classList.toggle('active', pane.id === `pane-${paneId}`);
            });
        });
    });
}

function openSettingsModal() {
    if (!settingsModal || !currentUser) return;
    
    // Populate Profile
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const userProfile = users[currentUser]?.profile;
    if (userProfile) {
        if (profilePicturePreview) profilePicturePreview.src = userProfile.avatar;
        if (profileNameInput) profileNameInput.value = users[currentUser].name;
        if (profileBioInput) profileBioInput.value = userProfile.bio;
        if (facebookLinkInput) facebookLinkInput.value = userProfile.links.facebook;
        if (xLinkInput) xLinkInput.value = userProfile.links.x;
        if (instagramLinkInput) instagramLinkInput.value = userProfile.links.instagram;
    }

    // Populate Subscription & Payments
    renderSubscriptionStatus();
    renderSavedCards();
    toggleAddCardView(false); // Ensure card list is shown by default

    // Populate Generation Settings
    if (settingImageAspectRatioSelect) settingImageAspectRatioSelect.value = userSettings.imageAspectRatio;
    if (settingImageFormatSelect) settingImageFormatSelect.value = userSettings.imageFormat;
    if (settingWatermarkToggle) {
        settingWatermarkToggle.checked = userSettings.watermark;
        // Disable toggle for premium users as watermark is always off
        if(userState.isPremium && watermarkSettingContainer) {
            settingWatermarkToggle.disabled = true;
            watermarkSettingContainer.style.opacity = '0.5';
        } else if (watermarkSettingContainer) {
            settingWatermarkToggle.disabled = false;
            watermarkSettingContainer.style.opacity = '1';
        }
    }

    // Populate Notifications
    if (settingNotificationsFeatures) settingNotificationsFeatures.checked = userSettings.notifications.featureUpdates;
    if (settingNotificationsExports) settingNotificationsExports.checked = userSettings.notifications.exportAlerts;
    if (settingNotificationsCommunity) settingNotificationsCommunity.checked = userSettings.notifications.communityNews;

    // Populate Appearance
    if (settingDarkModeToggle) settingDarkModeToggle.checked = userSettings.theme === 'dark';


    // Populate Language & Region
    if (settingLanguageSelect) settingLanguageSelect.value = userSettings.language;
    if (settingTimezoneSelect) settingTimezoneSelect.value = userSettings.timezone;

    // Check creator application status
    const creatorApps = JSON.parse(localStorage.getItem('creator_applications') || '{}');
    if (creatorApps[currentUser]) {
        if (creatorProgramForm) creatorProgramForm.style.display = 'none';
        if (creatorAppliedMessage) creatorAppliedMessage.style.display = 'block';
    } else {
        if (creatorProgramForm) creatorProgramForm.style.display = 'block';
        if (creatorAppliedMessage) creatorAppliedMessage.style.display = 'none';
        (creatorProgramForm as HTMLFormElement)?.reset();
    }
    
    // Reset to the first pane
    settingsNavLinks.forEach((link, index) => link.classList.toggle('active', index === 0));
    settingsPanes.forEach((pane, index) => pane.classList.toggle('active', index === 0));


    settingsModal.style.display = 'flex';
}

function handleProfileUpdate(e: Event) {
    e.preventDefault();
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[currentUser]) {
        users[currentUser].name = profileNameInput.value;
        users[currentUser].profile.bio = profileBioInput.value;
        // Avatar is handled separately in handleAvatarChange
        localStorage.setItem('users', JSON.stringify(users));
        sessionStorage.setItem('currentUserName', profileNameInput.value);
        currentUserName = profileNameInput.value;
        if(userNameDisplay) userNameDisplay.textContent = currentUserName;
        showSettingsToast('Profile updated!');
    }
}

async function handleAvatarChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!currentUser || !file) return;

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[currentUser]?.profile) {
        const newAvatarUrl = `data:${file.type};base64,${await blobToBase64(file)}`;
        users[currentUser].profile.avatar = newAvatarUrl;
        localStorage.setItem('users', JSON.stringify(users));
        if (profilePicturePreview) profilePicturePreview.src = newAvatarUrl;
        if (dashboardProfilePicture) dashboardProfilePicture.src = newAvatarUrl;
        showSettingsToast('Avatar updated!');
    }
}

async function handleLinksUpdate(e: Event) {
    e.preventDefault();
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[currentUser]) {
        users[currentUser].profile.links = {
            facebook: facebookLinkInput.value,
            x: xLinkInput.value,
            instagram: instagramLinkInput.value,
        };
        localStorage.setItem('users', JSON.stringify(users));
        showSettingsToast('Social links updated!');
    }
}

async function handlePasswordUpdate(e: Event) {
    e.preventDefault();
    if (!currentUser) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentUser];
    
    if (user && user.password === currentPasswordInput.value) {
        if (newPasswordInput.value.length < 6) {
            showErrorModal(['New password must be at least 6 characters long.'], 'Update Failed');
            return;
        }
        if (newPasswordInput.value !== confirmPasswordInput.value) {
            showErrorModal(['New passwords do not match.'], 'Update Failed');
            return;
        }
        
        user.password = newPasswordInput.value;
        localStorage.setItem('users', JSON.stringify(users));
        showSettingsToast('Password updated successfully!');
        (e.target as HTMLFormElement).reset();
    } else {
        showErrorModal(['Current password is incorrect.'], 'Update Failed');
    }
}

function handleGenerationSettingsUpdate(e: Event) {
    e.preventDefault();
    userSettings.imageAspectRatio = settingImageAspectRatioSelect.value;
    userSettings.imageFormat = settingImageFormatSelect.value;
    if (!userState.isPremium) {
      userSettings.watermark = settingWatermarkToggle.checked;
    }
    
    saveUserSettings();
    applyUserSettingsToDashboard();
    showSettingsToast('Generation settings saved!');
}

function handleNotificationsUpdate(e: Event) {
    e.preventDefault();
    userSettings.notifications = {
        featureUpdates: settingNotificationsFeatures.checked,
        exportAlerts: settingNotificationsExports.checked,
        communityNews: settingNotificationsCommunity.checked,
    };
    saveUserSettings();
    showSettingsToast('Notification preferences saved!');
}

function handleThemeToggle(e: Event) {
    userSettings.theme = (e.target as HTMLInputElement).checked ? 'dark' : 'light';
    saveUserSettings();
    applyTheme();
}

function handleLanguageRegionUpdate(e: Event) {
    e.preventDefault();
    userSettings.language = settingLanguageSelect.value;
    userSettings.timezone = settingTimezoneSelect.value;
    saveUserSettings();
    showSettingsToast('Language & region settings saved!');
}

function handleCreatorApplication(e: Event) {
    e.preventDefault();
    if (!currentUser) return;
    const creatorApps = JSON.parse(localStorage.getItem('creator_applications') || '{}');
    creatorApps[currentUser] = {
        name: creatorNameInput.value,
        link: creatorLinkInput.value,
        reason: creatorReasonInput.value,
        status: 'pending'
    };
    localStorage.setItem('creator_applications', JSON.stringify(creatorApps));
    
    if (creatorProgramForm) creatorProgramForm.style.display = 'none';
    if (creatorAppliedMessage) creatorAppliedMessage.style.display = 'block';
    
    showSettingsToast('Application submitted!');
}

function handleSaveCard(e: Event) {
    e.preventDefault();
    if (!currentUser) return;
    // ... logic to save card from settings ...
    toggleAddCardView(false);
    renderSavedCards();
    showSettingsToast('Payment method added!');
}

function handleRemoveCard(cardId: number) {
    // ... logic to remove card ...
    renderSavedCards();
    showSettingsToast('Payment method removed.');
}

function handleSetDefaultCard(cardId: number) {
    // ... logic to set default card ...
    renderSavedCards();
}

function handleDeleteAccount() {
    if (!currentUser) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    delete users[currentUser];
    localStorage.setItem('users', JSON.stringify(users));
    
    // Clear all related data
    localStorage.removeItem(`user_${currentUser}`);
    localStorage.removeItem(`settings_${currentUser}`);
    localStorage.removeItem(`creations_${currentUser}`);
    sessionStorage.clear();
    
    window.location.href = window.location.pathname + '?message=account_deleted';
}

// --- Creations & Gallery ---
function handleDownload() {
    if (!currentCreation.data) return;

    if (!userState.isPremium && userState.downloadsToday >= MAX_FREE_DOWNLOADS) {
        showErrorModal(['You have reached your daily download limit.'], 'Download Limit Reached');
        return;
    }
    
    const a = document.createElement('a');
    a.href = currentCreation.data;
    
    const fileExtension = userSettings.imageFormat.split('/')[1];
    a.download = `creation-${Date.now()}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (!userState.isPremium) {
        userState.downloadsToday++;
        saveUserState();
        updateUserStatusUI();
    }
}

function handleSaveCreation() {
    if (!currentUser) return;
    if (!userState.isPremium) {
        showErrorModal(['Saving creations is a Premium feature.'], 'Upgrade to Save');
        subscriptionModal.style.display = 'flex';
        return;
    }
    if (!currentCreation.data) return;

    try {
        const creations = JSON.parse(localStorage.getItem(`creations_${currentUser}`) || '[]');
        const newCreation = {
            id: Date.now(),
            prompt: currentPromptText,
            type: currentCreation.type,
            data: currentCreation.data,
            timestamp: new Date().toISOString()
        };
        creations.unshift(newCreation); // Add to the beginning
        localStorage.setItem(`creations_${currentUser}`, JSON.stringify(creations));
        showSettingsToast('Creation saved successfully!');
    } catch (e) {
        if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
            showErrorModal(['Your browser storage is full. Please remove some saved creations to make space.'], 'Storage Full');
        } else {
            showErrorModal(['An unexpected error occurred while saving.'], 'Save Failed');
        }
        console.error("Save failed:", e);
    }
}

async function handleShare() {
    if (!currentCreation.data) return;
    
    const blob = await fetch(currentCreation.data).then(res => res.blob());
    const file = new File([blob], `creation.jpg`, { type: blob.type });

    if (navigator.share && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({
                title: 'AI Creation',
                text: `Check out this ${currentCreation.type} I made!`,
                files: [file],
            });
            if (!userState.isPremium) {
                userState.sharesToday++;
                saveUserState();
                updateUserStatusUI();
            }
        } catch (error) {
            console.error('Sharing failed:', error);
        }
    } else {
        shareFallbackModal.style.display = 'flex';
    }
}

function updateSelectionToolbar() {
    if (!creationsGallery || !creationsSelectionToolbar) return;
    const selectedCheckboxes = creationsGallery.querySelectorAll('.creation-checkbox:checked');
    const selectedCount = selectedCheckboxes.length;
    
    if (selectedCount > 0) {
        creationsSelectionToolbar.style.display = 'flex';
        if (selectionCountEl) selectionCountEl.textContent = `${selectedCount} selected`;
        // For now, let's assume editing is only for one item.
        if (editSelectedButton) editSelectedButton.disabled = selectedCount !== 1;
        if (deleteSelectedButton) deleteSelectedButton.disabled = false;
    } else {
        creationsSelectionToolbar.style.display = 'none';
    }
}

function deleteCreations(ids: number[]) {
    if (!currentUser) return;
    let creations = JSON.parse(localStorage.getItem(`creations_${currentUser}`) || '[]');
    creations = creations.filter(c => !ids.includes(c.id));
    localStorage.setItem(`creations_${currentUser}`, JSON.stringify(creations));
    
    // After deleting, we might need to adjust the page number if the last item(s) on a page are removed
    const totalPages = Math.ceil(creations.length / CREATIONS_PER_PAGE) || 1;
    if (creationsCurrentPage > totalPages) {
        creationsCurrentPage = totalPages;
    }

    renderCreations(creationsCurrentPage); // Re-render
    showSettingsToast(`${ids.length} creation(s) deleted.`);
}

function renderCreations(page: number) {
    if (!currentUser || !creationsGallery) return;

    creationsCurrentPage = page;
    let creations = JSON.parse(localStorage.getItem(`creations_${currentUser}`) || '[]').filter(c => c.type === 'image');
    
    creationsGallery.innerHTML = ''; // Clear previous content

    if (creations.length === 0) {
        creationsGallery.innerHTML = '<p class="empty-gallery-message">You haven\'t saved any creations yet. Saved creations will appear here.</p>';
        if (creationsPaginationControls) creationsPaginationControls.style.display = 'none';
        if (creationsSelectionToolbar) creationsSelectionToolbar.style.display = 'none';
        return;
    }

    const totalPages = Math.ceil(creations.length / CREATIONS_PER_PAGE);
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    creationsCurrentPage = page;

    const startIndex = (page - 1) * CREATIONS_PER_PAGE;
    const endIndex = startIndex + CREATIONS_PER_PAGE;
    const pageCreations = creations.slice(startIndex, endIndex);

    pageCreations.forEach(creation => {
        const creationEl = document.createElement('div');
        creationEl.className = 'creation-item';
        creationEl.dataset.id = String(creation.id);
        
        let mediaEl = document.createElement('img');
        mediaEl.src = creation.data;
        mediaEl.alt = creation.prompt;

        creationEl.innerHTML = `
            <div class="creation-media-wrapper">
                ${mediaEl.outerHTML}
                <div class="creation-overlay">
                    <p title="${creation.prompt}">${creation.prompt.substring(0, 100)}${creation.prompt.length > 100 ? '...' : ''}</p>
                </div>
            </div>
            <div class="creation-actions">
                <input type="checkbox" class="creation-checkbox" data-id="${creation.id}">
                <span class="creation-date">${new Date(creation.timestamp).toLocaleDateString()}</span>
                <button class="icon-button delete-creation-btn" data-id="${creation.id}" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                </button>
            </div>
        `;
        
        creationsGallery.appendChild(creationEl);
    });
    
    creationsGallery.querySelectorAll<HTMLElement>('.creation-item').forEach(item => {
        const creationId = parseInt(item.dataset.id || '0', 10);
        const creation = pageCreations.find(c => c.id === creationId);
        if (!creation) return;

        const mediaWrapper = item.querySelector('.creation-media-wrapper');
        if (mediaWrapper) {
            mediaWrapper.addEventListener('click', (e) => {
                if ((e.target as HTMLElement).tagName === 'INPUT') return;

                if (largeViewModal && largeViewImage && largeViewVideo) {
                    largeViewModal.style.display = 'flex';
                    largeViewImage.src = creation.data;
                    largeViewImage.style.display = 'block';
                    largeViewVideo.style.display = 'none';
                    largeViewVideo.src = '';
                }
            });
        }
        
        const checkbox = item.querySelector('.creation-checkbox');
        if (checkbox) checkbox.addEventListener('change', updateSelectionToolbar);

        const deleteBtn = item.querySelector('.delete-creation-btn');
        if (deleteBtn) deleteBtn.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete this creation?`)) {
                deleteCreations([creationId]);
            }
        });
    });

    if (creationsPaginationControls) {
        creationsPaginationControls.style.display = totalPages > 1 ? 'flex' : 'none';
        if (creationsPageInfo) creationsPageInfo.textContent = `Page ${page} of ${totalPages}`;
        if (creationsPrevPageButton) creationsPrevPageButton.disabled = page === 1;
        if (creationsNextPageButton) creationsNextPageButton.disabled = page === totalPages;
    }
    
    updateSelectionToolbar();
}

function openCreationsModal() {
    if (!userState.isPremium) {
        showErrorModal(['Viewing saved creations is a Premium feature.'], 'Premium Feature');
        subscriptionModal.style.display = 'flex';
        return;
    }
    renderCreations(1);
    creationsModal.style.display = 'flex';
}

// --- Chat ---
function parseSimpleMarkdown(text: string): string {
    return text
        .replace(/```([\s\S]*?)```/g, (_match, code) => `<pre><code>${code.trim()}</code></pre>`)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
}


function renderChatMessage(message: string, role: 'user' | 'model', sources?: any[]) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = `chat-message ${role}`;

    const messageContent = document.createElement('div');
    messageContent.className = 'chat-message-content';
    
    if (role === 'model' && isChatLoading) {
        messageContent.innerHTML = `
            <div class="chat-loading-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        `;
    } else {
        messageContent.innerHTML = parseSimpleMarkdown(message);
    }
    
    messageWrapper.appendChild(messageContent);

    if (sources && sources.length > 0) {
        const sourcesContainer = document.createElement('div');
        sourcesContainer.className = 'grounding-sources';
        sourcesContainer.innerHTML = '<strong>Sources:</strong>';
        const sourcesList = document.createElement('ol');
        sources.forEach(source => {
            if (source.web && source.web.uri) {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${source.web.uri}" target="_blank" rel="noopener noreferrer" class="source-link">${source.web.title || source.web.uri}</a>`;
                sourcesList.appendChild(li);
            }
        });
        sourcesContainer.appendChild(sourcesList);
        messageWrapper.appendChild(sourcesContainer);
    }

    chatHistoryEl.appendChild(messageWrapper);
    chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;
    return messageWrapper;
}

async function handleChatSubmit(e?: Event) {
    if (e) e.preventDefault();
    if (isChatLoading || chatInput.value.trim() === '') return;

    const userInput = chatInput.value.trim();
    chatHistory.push({ role: 'user', parts: [{ text: userInput }] });
    renderChatMessage(userInput, 'user');
    
    chatInput.value = '';
    chatInput.style.height = 'auto';
    chatSendButton.disabled = true;
    isChatLoading = true;
    
    const loadingIndicator = renderChatMessage('', 'model');

    try {
        const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: chatHistory,
            config: {
                tools: [{googleSearch: {}}],
            },
        });

        const modelResponse = response.text;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        
        chatHistory.push({ role: 'model', parts: [{ text: modelResponse }] });
        
        // Update the loading indicator with the actual response
        const messageContent = loadingIndicator.querySelector('.chat-message-content') as HTMLDivElement;
        if(messageContent) messageContent.innerHTML = parseSimpleMarkdown(modelResponse);
        if (groundingChunks && groundingChunks.length > 0) {
            const sourcesContainer = document.createElement('div');
            sourcesContainer.className = 'grounding-sources';
            sourcesContainer.innerHTML = '<strong>Sources:</strong>';
            const sourcesList = document.createElement('ol');
            groundingChunks.forEach(source => {
                 if (source.web && source.web.uri) {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="${source.web.uri}" target="_blank" rel="noopener noreferrer" class="source-link">${source.web.title || source.web.uri}</a>`;
                    sourcesList.appendChild(li);
                }
            });
            sourcesContainer.appendChild(sourcesList);
            loadingIndicator.appendChild(sourcesContainer);
        }

    } catch (err) {
        const errorMessage = (err as Error).message || 'An unknown error occurred.';
        const errorContent = loadingIndicator.querySelector('.chat-message-content') as HTMLDivElement;
        if(errorContent) {
            errorContent.innerHTML = `Sorry, something went wrong. Please try again. <br><small>Error: ${errorMessage}</small>`;
            errorContent.style.color = 'var(--danger-color)';
        }
    } finally {
        isChatLoading = false;
        chatSendButton.disabled = false;
        chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;
    }
}


function setupEventListeners() {
    // --- Auth ---
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (forgotPasswordForm) forgotPasswordForm.addEventListener('submit', handleForgotPasswordRequest);
    if (resetPasswordForm) resetPasswordForm.addEventListener('submit', handlePasswordReset);
    if (authToggleLink) authToggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthView(authToggleLink.dataset.mode as any);
    });
    if (forgotPasswordLink) forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthView('forgot');
    });
    setupAuthLegalTabs();

    // --- Main Navigation ---
    [imageNavButton, chatNavButton].forEach(button => {
        button.addEventListener('click', () => {
            const view = button.dataset.view;
            imageGeneratorView.style.display = view === 'image' ? 'block' : 'none';
            chatView.style.display = view === 'chat' ? 'flex' : 'none';
            imageNavButton.classList.toggle('active', view === 'image');
            chatNavButton.classList.toggle('active', view === 'chat');
        });
    });

    // --- Main UI & Generation ---
    if (generateButton) generateButton.addEventListener('click', generate);
    if (aiAssistButton) aiAssistButton.addEventListener('click', handleAiAssist);
    if (promptEl) promptEl.addEventListener('input', (e) => {
        currentPromptText = (e.target as HTMLTextAreaElement).value;
        if (generateButton) generateButton.disabled = currentPromptText.trim() === '' && !base64data;
        if (aiAssistButton) aiAssistButton.disabled = currentPromptText.trim() === '';
    });
    if (examplePromptsSelect) examplePromptsSelect.addEventListener('change', (e) => {
        const value = (e.target as HTMLSelectElement).value;
        if (value && promptEl) {
            promptEl.value = value;
            promptEl.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
    if (upload) upload.addEventListener('change', handleFileUpload);
    if (clearPreviewButton) clearPreviewButton.addEventListener('click', clearPreview);
    
    // --- Chat ---
    if (chatForm) chatForm.addEventListener('submit', handleChatSubmit);
    if (chatInput) {
        chatInput.addEventListener('input', () => {
            if (chatSendButton) {
                chatSendButton.disabled = chatInput.value.trim() === '';
            }
            chatInput.style.height = 'auto';
            chatInput.style.height = `${chatInput.scrollHeight}px`;
        });
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleChatSubmit();
            }
        });
    }

    // --- Results Actions ---
    if (downloadButton) downloadButton.addEventListener('click', handleDownload);
    if (saveCreationButton) saveCreationButton.addEventListener('click', handleSaveCreation);
    if (shareButton) shareButton.addEventListener('click', handleShare);
    if (viewCreationButton) viewCreationButton.addEventListener('click', () => openCreationsModal());

    // --- Daily Prompts ---
    if (refreshPromptsButton) refreshPromptsButton.addEventListener('click', populateDailyPrompts);

    // --- Profile & Modals ---
    if (profileButton) profileButton.addEventListener('click', () => {
        if(profileDropdown) profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', (e) => {
        if (profileContainer && !profileContainer.contains(e.target as Node)) {
            if (profileDropdown) profileDropdown.style.display = 'none';
        }
    });
    if (logoutButton) logoutButton.addEventListener('click', handleLogout);
    if (settingsButton) settingsButton.addEventListener('click', (e) => {
        e.preventDefault();
        openSettingsModal();
        if(profileDropdown) profileDropdown.style.display = 'none';
    });
    if (myCreationsButton) myCreationsButton.addEventListener('click', (e) => {
        e.preventDefault();
        openCreationsModal();
        if(profileDropdown) profileDropdown.style.display = 'none';
    });
    
    // --- Modal Close Buttons ---
    if(modalCloseButton) modalCloseButton.addEventListener('click', () => { if(errorModal) errorModal.style.display = 'none' });
    if(subscriptionModalCloseButton) subscriptionModalCloseButton.addEventListener('click', () => { if(subscriptionModal) subscriptionModal.style.display = 'none' });
    if(settingsModalCloseButton) settingsModalCloseButton.addEventListener('click', () => { if(settingsModal) settingsModal.style.display = 'none' });
    if(creationsModalCloseButton) creationsModalCloseButton.addEventListener('click', () => { if(creationsModal) creationsModal.style.display = 'none' });
    if(largeViewCloseButton) largeViewCloseButton.addEventListener('click', () => { if(largeViewModal) largeViewModal.style.display = 'none' });
    if(shareFallbackCloseButton) shareFallbackCloseButton.addEventListener('click', () => { if(shareFallbackModal) shareFallbackModal.style.display = 'none' });

    // --- Settings Listeners ---
    setupSettingsNavigation();
    if (profileForm) profileForm.addEventListener('submit', handleProfileUpdate);
    if (profilePictureInput) profilePictureInput.addEventListener('change', handleAvatarChange);
    if (linksForm) linksForm.addEventListener('submit', handleLinksUpdate);
    if (passwordForm) passwordForm.addEventListener('submit', handlePasswordUpdate);
    if (generationSettingsForm) generationSettingsForm.addEventListener('submit', handleGenerationSettingsUpdate);
    if (notificationsForm) notificationsForm.addEventListener('submit', handleNotificationsUpdate);
    if (settingDarkModeToggle) settingDarkModeToggle.addEventListener('change', handleThemeToggle);
    if (languageRegionForm) languageRegionForm.addEventListener('submit', handleLanguageRegionUpdate);
    if (creatorProgramForm) creatorProgramForm.addEventListener('submit', handleCreatorApplication);
    if (deleteAccountButton) deleteAccountButton.addEventListener('click', () => { if(deleteAccountModal) deleteAccountModal.style.display = 'flex'; });
    if (cancelDeleteButton) cancelDeleteButton.addEventListener('click', () => {
        if(deleteAccountModal) deleteAccountModal.style.display = 'none';
        if(deleteConfirmInput) deleteConfirmInput.value = '';
    });
    if (deleteConfirmInput) deleteConfirmInput.addEventListener('input', () => {
        if(confirmDeleteButton) confirmDeleteButton.disabled = deleteConfirmInput.value !== currentUser;
    });
    if (confirmDeleteButton) confirmDeleteButton.addEventListener('click', handleDeleteAccount);
    
    // --- Creations Gallery ---
    if(creationsPrevPageButton) creationsPrevPageButton.addEventListener('click', () => renderCreations(creationsCurrentPage - 1));
    if(creationsNextPageButton) creationsNextPageButton.addEventListener('click', () => renderCreations(creationsCurrentPage + 1));
    if(deleteSelectedButton) deleteSelectedButton.addEventListener('click', () => {
        const selectedCheckboxes = creationsGallery.querySelectorAll<HTMLInputElement>('.creation-checkbox:checked');
        const idsToDelete = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.id || '0'));
        if (idsToDelete.length > 0 && confirm(`Are you sure you want to delete ${idsToDelete.length} selected creations?`)) {
            deleteCreations(idsToDelete);
        }
    });
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    cacheDOMElements();
    setupEventListeners();
    
    // Simulate loading time for splash screen
    setTimeout(() => {
        checkAuthStatus();
        if (splashScreen) {
            splashScreen.classList.add('hidden');
        }
    }, 1500);
});